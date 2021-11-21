<template>
    <div id="map" class="h-full w-full"></div>
</template>

<script>
import { initMap } from "@/plugins/leaflet.js";
import { reactive, onMounted } from "vue";

export default {
    name: "Map",
    setup() {
        let map = reactive({
            instance: null,
        });

        onMounted(() => {
            map.instance = initMap();
        });

        function mapListener() {
            // map.instance.on("moveend", setNearbyMarkers);
            // map.instance.on("zoomend", setNearbyMarkers);
        }

        function flyTo(latLng = [25, 121]) {
            map.instance.flyTo(latLng);
        }

        return {};
    },
};
</script>
