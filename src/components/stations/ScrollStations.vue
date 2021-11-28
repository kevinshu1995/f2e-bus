<template>
    <div class="h-full overflow-hidden flex items-center justify-center">
        <div class="h-full w-full" v-if="data.busList">
            <swiper
                :class="['w-full h-full', data.busList.length !== 0 && 'cursor-[grab] active:cursor-[grabbing]']"
                direction="horizontal"
                slidesPerView="auto"
                :breakpoints="breakpoints"
            >
                <template v-if="data.busList.length !== 0">
                    <swiper-slide
                        class="!h-auto !w-auto max-w-[300px] lg:max-w-full pr-4 lg:pr-0 pb-4"
                        v-for="(bus, i) in data.busList"
                        :key="`bus-list-${bus.RouteUID}-${i}`"
                    >
                        <div
                            :class="[
                                'rounded-2xl py-4 px-6 h-full',
                                bus.StopStatus === 0 ? 'bg-grey-dark' : 'border border-grey-dark',
                            ]"
                        >
                            <div class="space-y-3">
                                <h4 class="text-xl text-primary">{{ bus.RouteName.Zh_tw }}</h4>
                                <div class="flex flex-wrap -mx-4 px-1 text-paragraph">
                                    <div class="px-4 py-1 w-full">
                                        <div class="flex items-center space-x-4">
                                            <Icon name="directionArrow" class="w-4" />
                                            <p>
                                                往
                                                <span class="text-grey-light inline-block px-1">
                                                    {{ directionText(bus) }}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <!-- <div class="px-4 py-1 w-full md:w-1/2">end</div> -->
                                    <template v-if="bus.StopStatus === 0">
                                        <div class="px-4 py-1 w-full" v-if="bus.StopCountDown">
                                            距離本站站數:
                                            <span class="text-grey-light inline-block px-1">
                                                {{ bus.StopCountDown }}
                                            </span>
                                        </div>
                                        <template v-if="bus.EstimateTime">
                                            <div class="px-4 py-1 w-full" v-if="bus.EstimateTime">
                                                <div class="flex items-center space-x-4">
                                                    <Icon name="clock" class="w-4" />
                                                    <p>
                                                        預估到站:
                                                        <span class="text-grey-light inline-block px-1">
                                                            {{ Math.floor((bus.EstimateTime / 60) * 100) / 100 }}
                                                        </span>
                                                        分鐘
                                                    </p>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else-if="bus.NextBusTime">
                                            <div class="px-4 py-1 w-full" v-if="bus.NextBusTime">
                                                <div class="flex items-center space-x-4">
                                                    <Icon name="clock" class="w-4" />
                                                    <p>
                                                        下班公車表定時間:
                                                        <span class="text-grey-light inline-block px-1">
                                                            {{ dayjs(bus.NextBusTime).format("HH:mm") }}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </template>
                                        <div class="px-4 py-1 w-full text-highlight" v-if="bus.IsLastBus">末班車</div>
                                    </template>
                                    <template v-if="bus.StopStatus === 1">
                                        <div class="px-4 py-1 w-full text-highlight">尚未發車</div>
                                    </template>
                                    <template v-if="bus.StopStatus === 3">
                                        <div class="px-4 py-1 w-full text-highlight">末班車已過</div>
                                    </template>
                                    <template v-if="bus.StopStatus === 4">
                                        <div class="px-4 py-1 w-full text-highlight">今日未營運</div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                </template>
                <template v-else>
                    <swiper-slide
                        :class="['!h-auto w-full max-w-[300px] lg:max-w-full', 'flex items-center pr-4 lg:pr-0 pb-4']"
                    >
                        <p class="text-paragraph">很抱歉，此站點目前沒有資料</p>
                    </swiper-slide>
                </template>
            </swiper>
        </div>
        <h4 v-else>Loading</h4>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import dayjs from "dayjs";
import "swiper/css";
import StationCard from "@/components/stations/Card.vue";
import {
    GET_currentCity,
    GET_StationEstimatedTimeOfArrival,
    GET_StationRealTimeNearStop,
    ISO_cityCode,
    GET_RouteInfo,
} from "@/apis/bus/index.js";

import { onMounted, reactive, toRefs, watchEffect } from "vue";
export default {
    name: "Scroll-stations",
    components: {
        StationCard,
        Swiper,
        SwiperSlide,
    },

    props: {
        currentDisplayStation: {
            type: Object,
        },
        userPostion: {
            type: Array,
        },
    },

    setup(props) {
        const { currentDisplayStation, userPostion } = toRefs(props);
        const data = reactive({
            busList: null,
        });
        const breakpoints = {
            1024: {
                direction: "vertical",
            },
        };

        watchEffect(() => {
            get_StationList();
        });

        async function getCurrentCity() {
            if (!currentDisplayStation.value) return null;
            try {
                const { PositionLat, PositionLon } = currentDisplayStation.value.StationPosition;
                const city = await GET_currentCity({ lat: PositionLat, lng: PositionLon });
                console.log(ISO_cityCode(city.LocationCityCode), city);
                return ISO_cityCode(city.LocationCityCode);
            } catch (error) {
                console.error("ScrollStations error", error);
                return null;
            }
        }

        async function get_StationList() {
            const lag = userPostion.value ? userPostion.value[0] : 25.047675;
            const lng = userPostion.value ? userPostion.value[1] : 121.517055;
            const currentCity = await getCurrentCity({ lag, lng });
            if (!currentCity) return;
            try {
                const buses = await GET_StationEstimatedTimeOfArrival(
                    currentCity,
                    currentDisplayStation.value.StationID
                );
                const buses_routeInfo = await GET_RouteInfo(currentCity, currentDisplayStation.value.StationID);
                const result = buses
                    .map(bus => {
                        const routeInfo = buses_routeInfo.find(route => route.RouteID === bus.RouteID);
                        return { ...bus, ...routeInfo };
                    })
                    .sort((a, b) => {
                        return b.StopStatus !== 0 ? -1 : 1;
                    });
                console.log("result", buses, buses_routeInfo, currentCity, currentDisplayStation.value.StationID);
                data.busList = result;
            } catch (error) {
                data.busList = null;
            }
        }

        function directionText(bus) {
            switch (bus.Direction) {
                case 0:
                    return `${bus.DestinationStopNameZh}`;
                case 1:
                    return `${bus.DepartureStopNameZh}`;
                case 2:
                    console.log("迴圈!", bus);
                case 255:
                    return "無資料";
            }
        }

        return {
            data,
            breakpoints,
            directionText,
            dayjs,
        };
    },
};
</script>
