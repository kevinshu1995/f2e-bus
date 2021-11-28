<template>
    <div class="relative z-30">
        <div>
            <Search id="home-search-fake" placeholder="你想去哪裡..." @click="openModal" />
            <Modal :hasConfirmBtn="false" ref="searchBusModal" maxWidth="max-w-3xl">
                <template #body="{ setIsOpen }">
                    <div class="space-y-8 py-4 !mt-0">
                        <div class="flex w-full">
                            <div class="">
                                <select
                                    v-model="search.city"
                                    @change="onSearch"
                                    class="bg-grey-dark cursor-pointer focus:ring-highlight h-full rounded-xl"
                                >
                                    <option
                                        :value="city.en"
                                        :disabled="city.disabled"
                                        v-for="(city, i) in cityList"
                                        :key="`city-list-${i}`"
                                    >
                                        {{ city.zh }}
                                    </option>
                                </select>
                            </div>
                            <div class="ml-3 flex-grow">
                                <Search
                                    v-model="search.input"
                                    id="home-search"
                                    placeholder="輸入公車路線..."
                                    @input="onSearch"
                                />
                            </div>
                        </div>
                        <p v-if="search.formMsg" class="text-center">{{ search.formMsg }}</p>
                        <ul class="max-h-[500px] overflow-y-auto divide-y">
                            <li v-if="search.targetBus">
                                <div class="flex flex-wrap space-y-2 md:space-y-0">
                                    <h3 class="text-3xl text-highlight w-full md:w-1/4 flex items-center">
                                        {{ search.targetBus.RouteName.Zh_tw }}
                                    </h3>
                                    <div class="w-full md:w-3/4 flex flex-wrap">
                                        <p class="w-full sm:w-1/2">
                                            起點站:
                                            {{ search.targetBus.DepartureStopNameZh }}
                                        </p>
                                        <p class="w-full sm:w-1/2">
                                            折返站: {{ search.targetBus.DestinationStopNameZh }}
                                        </p>
                                        <p class="w-full sm:w-1/2">
                                            票價資訊: {{ search.targetBus.TicketPriceDescriptionZh }}
                                        </p>
                                    </div>
                                </div>
                                <div class="w-full mt-4 max-h-[300px] overflow-y-auto">
                                    <p>站牌順序:</p>
                                    <ul>
                                        <li
                                            v-for="(stop, i) in search.targetBus.Stops"
                                            :key="`station-stop-${i}`"
                                            class=""
                                        >
                                            {{ `第 ${i + 1} 站 - ${stop.StopName.Zh_tw}` }}
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li
                                v-else
                                v-for="(bus, i) in search.result"
                                :key="`search-result-${i}`"
                                class="py-4 cursor-pointer hover:bg-grey-dark"
                                @click="selectBus(bus)"
                            >
                                <div class="flex flex-wrap space-y-2 md:space-y-0">
                                    <h3 class="text-2xl w-full md:w-1/4 flex items-center">
                                        {{ bus.RouteName.Zh_tw }}
                                    </h3>
                                    <div class="w-full md:w-3/4 flex flex-wrap">
                                        <p class="w-full sm:w-1/2">
                                            起點站:
                                            {{ bus.DepartureStopNameZh }}
                                        </p>
                                        <p class="w-full sm:w-1/2">折返站: {{ bus.DestinationStopNameZh }}</p>
                                        <p class="w-full sm:w-1/2">票價資訊: {{ bus.TicketPriceDescriptionZh }}</p>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <Button @click="setIsOpen(false)" padding="py-2 px-8" class="mx-auto">關閉</Button>
                    </div>
                </template>
            </Modal>
        </div>
    </div>
</template>

<script>
import Button from "@/components/elements/Button.vue";
import Search from "@/components/elements/form/Search.vue";
import Modal from "@/components/templates/Modal.vue";
import { onMounted, reactive, ref } from "vue";
import { getCities, GET_busShape, GET_busRouteInfo, GET_StopOfRoute } from "@/apis/bus/index.js";

export default {
    components: {
        Search,
        Button,
        Modal,
    },
    setup(props, { emit }) {
        const search = reactive({
            input: "",
            city: "",
            result: [],
            formMsg: "",
            targetBus: null,
        });
        const searchBusModal = ref(null);
        const cityList = ref([]);

        onMounted(() => {
            // searchBusModal.value.setIsOpen(true);
            bindSelect();
        });

        async function bindSelect() {
            const cities = await getCities();
            cityList.value = [...cities, { zh: "請選擇城市", en: "", disabled: true }];
        }

        async function getBusShapeList() {
            if (!search.city) {
                search.formMsg = "未選擇城市";
                return;
            } else if (!search.input) {
                search.formMsg = "請輸入搜尋內容";
                return;
            } else {
                search.formMsg = "";
                search.targetBus = null;
            }
            const params = {
                $filter: `contains(RouteName/Zh_tw,'${search.input}')`,
            };
            // const busShapeList = await GET_busShape(search.city, params);
            const busInfo = await GET_busRouteInfo(search.city, params);
            search.result = busInfo;
            // search.result = busShapeList.map(eachBusShap => {
            //     const info = busInfo.find(eachBusInfo => eachBusShap.RouteUID === eachBusInfo.RouteUID);
            //     return { ...info, ...eachBusShap };
            // });
        }

        async function selectBus(bus) {
            try {
                const busInfo = await GET_StopOfRoute(search.city, bus.RouteName.Zh_tw, {
                    $filter: `contains(RouteUID, '${bus.RouteUID}') and Direction eq 0`,
                });
                search.targetBus = { ...bus, ...busInfo[0] };
            } catch (error) {
                console.error(error);
            }
        }

        function onSearch() {
            getBusShapeList();
        }

        function openModal() {
            searchBusModal.value.setIsOpen(true);
        }

        return {
            search,
            onSearch,
            searchBusModal,
            openModal,
            cityList,
            getBusShapeList,
            selectBus,
        };
    },
};
</script>
