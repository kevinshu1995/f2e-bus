<template>
    <div class="h-full overflow-hidden">
        <div class="vertical !h-full not-sr-only lg:sr-only">
            <Flicking
                class="w-full h-full"
                :options="{ ...flickingOptions, horizontal: true }"
                :viewportTag="'div'"
                :cameraTag="'ul'"
                @after-resize="afterResize"
            >
                <li class="">
                    <StationCard />
                </li>
            </Flicking>
        </div>
        <div class="vertical !h-full sr-only lg:not-sr-only">
            <Flicking
                class="w-full h-full"
                :options="{ ...flickingOptions, horizontal: false }"
                :viewportTag="'div'"
                :cameraTag="'ul'"
                @after-resize="afterResize"
            >
                <li class="">
                    <StationCard />
                </li>
            </Flicking>
        </div>
    </div>
</template>

<script>
import Flicking from "@egjs/vue3-flicking";
import "@egjs/vue3-flicking/dist/flicking.css";
import StationCard from "@/components/stations/Card.vue";

import { reactive, nextTick } from "vue";
export default {
    name: "Scroll-stations",
    components: {
        Flicking,
        StationCard,
    },
    setup() {
        const flickingOptions = reactive({
            align: "prev",
            moveType: "snap",
            bound: false,
        });

        async function afterResize({ currentTarget }) {
            await nextTick();
            currentTarget.init();
        }

        return {
            flickingOptions,
            afterResize,
        };
    },
};
</script>
