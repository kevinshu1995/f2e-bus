<template>
    <div id="map" class="h-full w-full"></div>
</template>

<script>
import { leaflet as L, initMap, icons } from "@/plugins/leaflet.js";
import { reactive, toRefs, toRaw, onMounted, watch, watchEffect } from "vue";

export default {
    name: "Map",

    emits: ["onReadyMap", "onMoveend", "onSelectStation"],

    props: {
        nearbyStations: {
            type: Array,
            default() {
                return [];
            },
        },
        userPosition: {
            type: Array,
        },
    },

    setup(props, { emit }) {
        const { nearbyStations, userPosition } = toRefs(props);
        // * Check if value of mark's lag/lon is actived
        const isActiveMark = (lag, lon) => {
            const floorBy10000 = val => Math.floor(val * 10000);
            if (map.activeMarker) {
                const active = map.activeMarker.latlng;
                return floorBy10000(active.lat) === floorBy10000(lag) && floorBy10000(active.lng) === floorBy10000(lon);
            }
            return false;
        };
        let map = reactive({
            instance: null,
            // * Layers
            markerLayer: null,
            selfLayer: null,
            // * Store active marker info
            activeMarker: null,
            hasSetView: false,
        });
        let zomminTimeout;

        onMounted(() => {
            onInitMap();
        });

        watch(
            () => nearbyStations,
            () => {
                setNearbyMarkers();
            },
            { deep: true, immediate: true }
        );

        watch(
            () => userPosition.value,
            () => {
                setUserPositionMarker();
            }
        );

        watchEffect(() => {
            setViewByUserPositionOnce();
        });

        /** --------------------------
         *  Map Listener
         */
        function mapListener() {
            map.instance.on("moveend", onMoveend);
            map.instance.on("zoomend", onZoomend);
        }

        function onMoveend() {
            onMapMoveZoom();
            emit("onMoveend", toRaw(map.instance));
        }

        function onZoomend() {
            onMapMoveZoom();
        }

        function onMapMoveZoom() {
            clearTimeout(zomminTimeout);
            zomminTimeout = setTimeout(limitZoom, 2000);
        }

        function limitZoom() {
            const limit = 16;
            const currentZoom = map.instance.getZoom();
            if (currentZoom < limit) {
                map.instance.zoomIn(limit - currentZoom);
            }
        }
        // ----------------------------

        function onInitMap() {
            map.instance = initMap();
            emit("onReadyMap", map.instance);
            mapListener();
        }

        function setUserPositionMarker() {
            if (userPosition.value) {
                if (map.selfLayer) map.selfLayer.clearLayers();
                const selfMarker = L.marker(userPosition.value, {
                    icon: icons.self,
                });
                map.selfLayer = L.featureGroup(selfMarker).addTo(map.instance);
            }
        }

        function setNearbyMarkers() {
            if (!nearbyStations) return console.error("Map, nearbyStations is null");
            if (map.markerLayer) map.markerLayer.clearLayers();
            const toRawData = nearbyStations;
            if (!toRawData.value || toRawData.value.length === 0) return;

            const nearbyMarkers = toRawData.value.map(station => {
                const { PositionLat, PositionLon } = station.StationPosition;
                const isActive = isActiveMark(PositionLat, PositionLon);
                const currentMarker = L.marker([PositionLat, PositionLon], {
                    icon: isActive ? icons.active : icons.default,
                    riseOnHover: true,
                    station,
                }).bindPopup(station.StationName.Zh_tw, { closeButton: false });
                return currentMarker;
            });
            map.markerLayer = L.featureGroup(nearbyMarkers)
                .on("mouseover", e => {
                    if (!map.activeMarker || !isActiveMark(map.activeMarker.latlng.lat, map.activeMarker.latlng.lng)) {
                        e.layer.setIcon(icons.outline);
                    }
                })
                .on("mouseout", e => {
                    if (!map.activeMarker || !isActiveMark(map.activeMarker.latlng.lat, map.activeMarker.latlng.lng)) {
                        e.layer.setIcon(icons.default);
                    }
                })
                .on("popupopen", e => {
                    e.layer.setIcon(icons.active);
                    e.layer.setZIndexOffset(1000);
                    map.activeMarker = {
                        station: e.layer.options.station,
                        latlng: e.layer._latlng,
                        layer: e.layer,
                    };
                    emit("onSelectStation", e.layer.options.station);
                })
                .on("popupclose", e => {
                    e.layer.setIcon(icons.default);
                    e.layer.setZIndexOffset(0);
                    map.activeMarker = null;
                    emit("onSelectStation", null);
                })
                .addTo(map.instance);
        }

        function setViewByUserPositionOnce() {
            if (!map.hasSetView && userPosition.value) {
                map.instance.setView(userPosition.value);
                map.hasSetView = true;
            }
        }

        return {
            map,
        };
    },
};
</script>
