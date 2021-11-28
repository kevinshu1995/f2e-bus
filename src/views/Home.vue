<template>
    <div class="grid gap-5 home-grid-template w-full h-full pt-6 lg:pt-0 relative z-10">
        <div class="home-grid-map rounded-2xl overflow-hidden relative z-20">
            <Map
                @onMoveend="bindCurrentMap"
                @onReadyMap="onReadyMap"
                @onSelectStation="bindSelectedStaion"
                :nearbyStations="bus.nearbyStations"
                :userPosition="info.userPosition"
                :busRoute="bus.busRoute"
            />
        </div>
        <div class="home-grid-method relative z-30">
            <div class="space-y-8">
                <div class="space-y-8">
                    <!-- Alert -->
                    <Alert> 目前僅限部分地區提供動態「預估到站時間」功能，敬請見諒。 </Alert>
                    <div class="space-y-5">
                        <!-- Search -->
                        <SearchBus @checkoutBusRoute="checkoutBusRoute" />
                        <!-- Buttons -->
                        <div class="flex w-full gap-4">
                            <Button icon="flag" class="flex-grow" disabled> 市區公車路線 </Button>
                            <Button icon="bookmark" class="flex-grow" disabled> 我的收藏 </Button>
                        </div>
                    </div>
                </div>
                <!-- 最近站牌 or 選擇站牌  -->
                <div class="space-y-4">
                    <h2 class="font-bold text-sm sm:text-base">{{ stationInfo.title }}</h2>
                    <div class="space-y-2">
                        <div class="flex items-end space-x-3">
                            <h3 class="text-xl">{{ stationInfo.stationName }}</h3>
                            <p class="text-xs sm:text-sm text-paragraph">
                                {{ stationInfo.distance ? stationInfo.distance + " 公尺" : "無法取得目前位置" }}
                            </p>
                        </div>
                        <div class="flex justify-between">
                            <p class="text-xs sm:text-sm text-paragraph">資料更新時間：{{ stationInfo.updateTime }}</p>
                            <!-- <button class="p-1">
                                <Icon name="refresh" class="w-3" />
                            </button> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="home-grid-stations relative">
            <ScrollStations
                :currentDisplayStation="currentDisplayStation"
                :userPostion="info.userPosition"
                class="absolute w-full h-full max-h-full left-0 top-0"
            />
        </div>
        <Modal :title="msgModal.title" :description="msgModal.description" :content="msgModal.content" ref="modal" />
    </div>
</template>

<script>
import Button from "@/components/elements/Button.vue";
import Alert from "@/components/elements/Alert.vue";
import Modal from "@/components/templates/Modal.vue";
import SearchBus from "@/components/SearchBus.vue";
import Map from "@/components/Map.vue";
import ScrollStations from "@/components/stations/ScrollStations.vue";
import dayjs from "dayjs";

import { GET_NearbyEstimatedTimeOfArrival, GET_NearbyStations } from "@/apis/bus/index.js";
import { distance } from "@/plugins/mixins.js";
import { reactive, ref, watch, watchEffect, computed, onMounted } from "vue";

export default {
    name: "Home",
    components: {
        Map,
        ScrollStations,
        Alert,
        Modal,
        SearchBus,
        Button,
    },
    setup() {
        const modal = ref(null);
        const msgModal = reactive({
            title: "",
            description: "",
            content: "",
        });
        const info = reactive({
            defaultPostion: [24.147703227978166, 120.67296981811525],
            userPosition: null, // lat, lng
            nearestStation: null,
            selectedStation: null,
            mode: "nearby", // "nearby" || "selected"
        });
        const map = reactive({
            instance: null,
            center: { lat: null, lng: null },
        });
        const bus = reactive({
            nearbyStations: null,
            busRoute: null,
        });
        const timeFormat = (time = "", format = "YYYY/MM/DD HH:mm:ss") => {
            return dayjs(time).format(format);
        };
        let watchPostion = null;

        const currentDisplayStation = computed(() => {
            switch (info.mode) {
                case "nearby":
                    return info.nearestStation;
                case "selected":
                    return info.selectedStation;
                default:
                    return null;
            }
        });

        const stationInfo = computed(() => {
            const defaultInfo = {
                title: "站牌",
                stationName: "無法取得站牌",
                distance: "-",
                updateTime: timeFormat(dayjs()),
            };
            try {
                switch (info.mode) {
                    case "selected":
                        if (!info.selectedStation) return defaultInfo;
                        return {
                            title: "選擇站牌",
                            stationName: info.selectedStation.StationName.Zh_tw,
                            distance: info.userPosition
                                ? Math.floor(
                                      distance(info.userPosition, [
                                          info.selectedStation.StationPosition.PositionLat,
                                          info.selectedStation.StationPosition.PositionLon,
                                      ])
                                  )
                                : null,
                            updateTime: info.selectedStation ? timeFormat(info.selectedStation.UpdateTime) : "",
                        };
                    case "nearby":
                    default:
                        if (!info.nearestStation) return defaultInfo;
                        return {
                            title: "最近站牌",
                            stationName: info.nearestStation.StationName.Zh_tw,
                            distance: info.nearestStation.Distance,
                            updateTime: info.nearestStation ? timeFormat(info.nearestStation.UpdateTime) : "",
                        };
                }
            } catch (err) {
                console.error("Home stationInfo =>", err);
                return defaultInfo;
            }
        });

        watch(
            () => info.userPosition,
            () => {
                getNearestStation();
            }
        );

        watchEffect(async () => {
            bus.nearbyStations = await getNearbyStops(map.center);
        });

        onMounted(() => {
            getUserLocation();
        });

        function handleModal(options = null) {
            if (options) {
                const { title = "", description = "", content = "" } = options;
                msgModal.title = title;
                msgModal.description = description;
                msgModal.content = content;
            }
            console.log(modal);
            modal.value.setIsOpen(!!options);
        }

        function getUserLocation() {
            if (navigator.geolocation) {
                watchPostion = navigator.geolocation.watchPosition(
                    position => {
                        const { coords } = position;
                        info.userPosition = [coords.latitude, coords.longitude];
                    },
                    error => {
                        handleModal({
                            title: "警告",
                            description: "取得位置錯誤",
                            content: "由於某種原因，無法取得您目前的所在位置，請嘗試重新整理，謝謝。",
                        });
                        console.error(error);
                    },
                    {
                        timeout: 5000,
                    }
                );
            } else {
                handleModal({
                    title: "警告",
                    description: "無法取得目前位置",
                    content: "您的瀏覽器無法取得目前位置，請嘗試使用其他瀏覽器，謝謝。",
                });
                console.log("Geolocation is not supported by this browser.");
            }
        }

        function bindCurrentMap(mapInstance) {
            map.instance = mapInstance;
            map.center = map.instance.getCenter();
        }

        async function onReadyMap(mapInstance) {
            bindCurrentMap(mapInstance);
            bus.nearbyStations = await getNearbyStops(map.center);
            getNearestStation();
        }

        /**
         *  以 info.userPosition 來取最近的站牌
         *  只會綁定一個站
         */
        function getNearestStation() {
            if (!bus.nearbyStations || !Array.isArray(bus.nearbyStations)) return;
            let nearestStation = null;
            let nearestDistance = Infinity;
            bus.nearbyStations.forEach(station => {
                const position = info.userPosition ? info.userPosition : info.defaultPostion;
                const { PositionLat, PositionLon } = station.StationPosition;
                const getDistance = distance(position, [PositionLat, PositionLon]);
                if (nearestDistance > getDistance) {
                    nearestDistance = getDistance;
                    nearestStation = station;
                }
            });
            info.nearestStation = { ...nearestStation, Distance: Math.floor(nearestDistance) };
        }

        let getNearbyStopsTimeout;
        function getNearbyStops({ lat = null, lng = null }) {
            if (!lat || !lng) return;
            clearTimeout(getNearbyStopsTimeout);
            return new Promise(resolve => {
                getNearbyStopsTimeout = setTimeout(() => {
                    try {
                        const data = GET_NearbyStations({
                            $spatialFilter: `nearby(${lat}, ${lng}, 1000)`,
                        });
                        resolve(data);
                    } catch (error) {
                        console.error("Home getNearbyStops failed", error);
                    }
                }, 1000);
            });
        }

        function bindSelectedStaion(selectedStation = null) {
            if (selectedStation !== null) {
                info.selectedStation = selectedStation;
                info.mode = "selected";
            }
        }

        function checkoutBusRoute(bus) {
            bus.busRoute = bus;
        }

        async function getNearby({ lat = null, lng = null }) {
            if (!lat || !lng) return;
            try {
                bus.nearbyStations = await GET_NearbyEstimatedTimeOfArrival({
                    $spatialFilter: `nearby(${lat}, ${lng}, 1000)`,
                });
            } catch (err) {
                console.log(err);
            }
        }

        return {
            info,
            bus,
            stationInfo,
            currentDisplayStation,
            onReadyMap,
            bindCurrentMap,
            bindSelectedStaion,
            msgModal,
            modal,
            checkoutBusRoute,
        };
    },
};
</script>

<style scoped>
.home-grid-template {
    grid-template:
        "method" fit-content(400px)
        "map" auto
        "stations" 170px;
}
@screen lg {
    .home-grid-template {
        grid-template:
            "map method" fit-content(400px)
            "map stations" 1fr
            / auto minmax(200px, 400px);
    }
}
.home-grid-map {
    grid-area: map;
}
.home-grid-method {
    grid-area: method;
}
.home-grid-stations {
    grid-area: stations;
}
.scroll-bar-hidden::-webkit-scrollbar {
    display: none;
}
</style>
