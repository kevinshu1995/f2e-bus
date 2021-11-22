<template>
    <transition enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div
            :class="[
                themeSet.container,
                padding,
                'text-sm sm:text-base',
                'rounded-2xl transition-opacity duration-100',
            ]"
            v-if="isShow"
        >
            <div class="flex items-center justify-between space-x-4">
                <div class="p-1 flex items-center">
                    <Icon :name="themeSet.icon" class="w-6" />
                </div>
                <p class="">
                    <slot></slot>
                </p>
                <button class="p-1 hover:scale-105 transition-all" @click="isShow = false">
                    <Icon name="close" class="w-3" />
                </button>
            </div>
        </div>
    </transition>
</template>

<script>
import { ref, computed } from "vue";
export default {
    name: "Alert",

    props: {
        theme: {
            type: String,
            default: "warning",
            validator(value) {
                return ["warning"].includes(value);
            },
        },
        padding: {
            type: String,
            default: "p-4",
        },
    },

    setup({ theme }) {
        const isShow = ref(true);
        const themeSet = computed(() => {
            switch (theme) {
                case "warning":
                    return {
                        container: "bg-highlight text-grey-dark",
                        icon: "info",
                    };
            }
        });

        return {
            themeSet,
            isShow,
        };
    },
};
</script>
