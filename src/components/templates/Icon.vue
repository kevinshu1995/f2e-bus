<template>
    <span class="flex" v-html="icon" />
</template>

<script>
import * as icons from "@/assets/icons/index.js";
import { computed } from "vue";

export default {
    name: "Icon",
    props: {
        name: String,
    },

    setup({ name }) {
        const icon = computed(() => icons[name]);

        return {
            icon,
        };
    },
};
</script>
