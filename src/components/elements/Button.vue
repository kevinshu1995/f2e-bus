<template>
    <button
        :class="[
            padding,
            themeColor,
            'rounded-xl transition-all space-x-3 flex items-center justify-center',
            'text-sm sm:text-base border',
        ]"
        @click="onClick"
    >
        <Icon v-if="icon" :name="icon" class="w-3" />
        <span class="relative -top-px">
            <slot></slot>
        </span>
    </button>
</template>

<script>
import { computed } from "vue";
export default {
    name: "Button",

    props: {
        icon: String,
        padding: {
            type: String,
            default: "py-3 sm:py-2.5 px-4",
        },
        theme: {
            type: String,
            default: "secondary",
            validator(value) {
                return ["secondary"].includes(value);
            },
        },
        disabled: Boolean,
    },

    setup({ theme, disabled }, { emit }) {
        const themeColor = computed(() => {
            switch (theme) {
                case "secondary":
                default:
                    return [
                        "border-primary text-primary bg-dark",
                        !disabled ? "hover:bg-grey-dark" : "border-opacity-50 text-opacity-50 cursor-not-allowed",
                    ].join(" ");
            }
        });

        function onClick() {
            emit("click");
        }

        return {
            themeColor,
            onClick,
        };
    },
};
</script>
