<template>
    <div class="grid gap-5 home-grid-template w-full h-full pt-6 lg:pt-0">
        <div class="home-grid-map rounded-2xl overflow-hidden">
            <Map />
        </div>
        <div class="home-grid-method">
            <div class="space-y-8">
                <div class="space-y-8">
                    <!-- Alert -->
                    <Alert> 目前僅限桃園、臺中、高雄地區提供動態「預估到站時間」功能，敬請見諒。 </Alert>
                    <div class="space-y-5">
                        <!-- Search -->
                        <Search v-model="search" id="home-search" placeholder="你想去哪裡" />
                        <!-- Buttons -->
                        <div class="flex w-full gap-4">
                            <Button icon="flag" class="flex-grow" disabled> 市區公車路線 </Button>
                            <Button icon="bookmark" class="flex-grow" disabled> 我的收藏 </Button>
                        </div>
                    </div>
                </div>
                <!-- 最近站牌  -->
                <div class="space-y-4">
                    <h2 class="font-bold text-sm sm:text-base">最近站牌</h2>
                    <div class="space-y-2">
                        <div class="flex items-end space-x-3">
                            <h3 class="text-xl">中央大學後門</h3>
                            <p class="text-xs sm:text-sm text-paragraph">255m</p>
                        </div>
                        <div class="flex justify-between">
                            <p class="text-xs sm:text-sm text-paragraph">資料更新時間：2021/11/16 11:32:31（15s）</p>
                            <!-- <button class="p-1">
                                <Icon name="refresh" class="w-3" />
                            </button> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="home-grid-stations relative">
            <ScrollStations class="absolute w-full h-full max-h-full left-0 top-0" />
        </div>
    </div>
</template>

<script>
import Button from "@/components/elements/Button.vue";
import Search from "@/components/elements/form/Search.vue";
import Alert from "@/components/elements/Alert.vue";
import Map from "@/components/Map.vue";
import ScrollStations from "@/components/stations/ScrollStations.vue";

import { ref } from "vue";
export default {
    name: "Home",
    components: {
        Map,
        ScrollStations,
        Alert,
        Search,
        Button,
    },
    setup() {
        const search = ref("");

        return {
            search,
        };
    },
};
</script>

<style scoped>
.home-grid-template {
    grid-template:
        "method" fit-content(600px)
        "map" auto
        "stations" auto;
}
@screen lg {
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
.scroll-bar-hidden::-webkit-scrollbar {
    display: none;
}
</style>
