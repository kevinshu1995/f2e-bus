<template>
    <div class="grid gap-5 home-grid-template w-full h-full">
        <div class="home-grid-map rounded-3xl overflow-hidden">
            <Map />
        </div>
        <div class="home-grid-method">Methods</div>
        <div class="home-grid-stations">Stations</div>
    </div>
</template>

<script>
import Map from "@/components/Map.vue";
export default {
    name: "Home",
    components: {
        Map,
    },
    setup() {},
};
</script>

<style scoped>
.home-grid-template {
    grid-template:
        "method" auto
        "map" auto
        "Stations" auto;
}
@screen sm {
    .home-grid-template {
        grid-template:
            "map method" fit-content(400px)
            "map stations" 1fr
            / auto fit-content(400px);
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
</style>
