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
                    <div class="bg-grey-dark rounded-2xl py-4 px-6 w-full">
                        <div class="space-y-3">
                            <h4 class="text-xl text-primary">132</h4>
                            <div class="flex flex-wrap -mx-4 text-paragraph">
                                <div class="px-4 py-1 w-full sm:w-1/2">出發</div>
                                <div class="px-4 py-1 w-full sm:w-1/2">返回</div>
                                <div class="px-4 py-1 w-full sm:w-1/2">時間</div>
                            </div>
                        </div>
                    </div>
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
                    <div class="bg-grey-dark rounded-2xl py-4 px-6 w-full">
                        <div class="space-y-3">
                            <h4 class="text-xl text-primary">132</h4>
                            <div class="flex flex-wrap -mx-4 text-paragraph">
                                <div class="px-4 py-1 w-full sm:w-1/2">出發</div>
                                <div class="px-4 py-1 w-full sm:w-1/2">返回</div>
                                <div class="px-4 py-1 w-full sm:w-1/2">時間</div>
                            </div>
                        </div>
                    </div>
                </li>
            </Flicking>
        </div>
    </div>
</template>

<script>
import Flicking from "@egjs/vue3-flicking";
import "@egjs/vue3-flicking/dist/flicking.css";
import { reactive, nextTick } from "vue";
export default {
    name: "Scroll-stations",
    components: {
        Flicking,
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
