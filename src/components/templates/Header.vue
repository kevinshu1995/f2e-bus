<template>
    <Container class="w-full h-full">
        <template #left>
            <img class="w-full" src="/assets/Logo-square.svg" alt="Da Bus square Logo" />
        </template>
        <template #main>
            <div class="flex items-center h-full w-full">
                <!-- sm up -->
                <div class="hidden sm:grid grid-cols-6 w-full">
                    <div class="col-span-1 flex items-center">
                        <router-link to="/" class="mx-auto hover:scale-105 transition-all">
                            <img class="max-w-[80px]" src="/assets/Logo.svg" alt="Da Bus horizon Logo" />
                        </router-link>
                    </div>
                    <nav class="col-span-5 md:col-span-4 flex w-full">
                        <ul class="flex space-x-8 mx-auto">
                            <li v-for="(link, i) in navi" :key="`header-navi-${i}`" class="flex">
                                <router-link :to="link.to" class="transition-all py-2 px-4">
                                    {{ link.text }}
                                </router-link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <!-- mobile -->
                <div class="flex sm:hidden justify-between w-full">
                    <div class="-mx-1 flex">
                        <button
                            class="px-1 hover:text-primary hover:scale-110 transition-all"
                            @click="isShaowMobileNavi = true"
                        >
                            <Icon name="menu" class="w-6" />
                        </button>
                    </div>
                    <div class="px-2">
                        <router-link to="/" class="mx-auto px-4 py-2 hover:scale-105 transition-all">
                            <img class="mx-auto max-w-[80px]" src="/assets/Logo.svg" alt="Da Bus horizon Logo" />
                        </router-link>
                    </div>
                    <div class="-mx-2 flex">
                        <button class="px-2 hover:text-primary hover:scale-110 transition-all">
                            <Icon name="bell" class="w-5" />
                        </button>
                    </div>
                </div>
                <!-- mobile Navigaion -->
                <transition enter-from-class="opacity-0" leave-to-class="opacity-0">
                    <div
                        class="fixed w-screen h-screen z-30 top-0 left-0 transition-opacity"
                        v-show="isShaowMobileNavi"
                    >
                        <div class="w-full h-full backdrop-blur flex items-center justify-center relative px-8">
                            <ul class="flex flex-col space-y-4">
                                <li v-for="(link, i) in naviMobile" :key="`header-navi-mobile-${i}`">
                                    <Link
                                        :to="link.to"
                                        :class="[
                                            'py-3 flex space-x-8 tracking-wider',
                                            link.disabled && 'text-gray-600 cursor-default',
                                        ]"
                                        activeClass="text-highlight"
                                        :disabled="link.disabled"
                                    >
                                        <Icon :name="link.icon" class="w-5" />
                                        <span>
                                            {{ link.text }}
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                            <div class="absolute left-0 top-0">
                                <button
                                    class="hover:text-primary hover:scale-105 transition-all m-8 p-4"
                                    @click="isShaowMobileNavi = false"
                                >
                                    <Icon name="close" class="w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </template>
        <template #right></template>
    </Container>
</template>

<script>
import Container from "@/components/templates/Container.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
export default {
    name: "Header",
    components: {
        Container,
    },
    setup() {
        const navi = [
            {
                to: "/",
                text: "主頁",
            },
            {
                to: "/news",
                text: "最新消息",
            },
            {
                to: "/qna",
                text: "常見問題",
            },
        ];
        const naviMobile = [
            {
                to: "/",
                text: "主頁",
                icon: "home",
                disabled: false,
            },
            {
                to: "/news",
                text: "行動支付錢包",
                icon: "wallet",
                disabled: true,
            },
            {
                to: "/qna",
                text: "地圖中查看",
                icon: "compass",
                disabled: true,
            },
        ];

        const isShaowMobileNavi = ref(false);

        const route = useRoute();
        watch(
            () => route.path,
            () => {
                isShaowMobileNavi.value && (isShaowMobileNavi.value = false);
            }
        );

        return {
            navi,
            naviMobile,
            isShaowMobileNavi,
        };
    },
};
</script>
