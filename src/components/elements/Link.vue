<template>
    <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
        <slot />
    </a>
    <router-link v-else v-bind="$props" custom v-slot="{ isActive, href, navigate }">
        <a
            v-bind="$attrs"
            :href="href"
            @click="navigate"
            :class="isActive ? activeClass : inactiveClass"
            v-if="!disabled"
        >
            <slot />
        </a>
        <span v-else v-bind="$attrs">
            <slot />
        </span>
    </router-link>
</template>

<script>
import { computed } from "vue";
import { RouterLink } from "vue-router";

export default {
    name: "Link",

    props: {
        ...RouterLink.props,
        inactiveClass: String,
        disabled: Boolean,
    },

    setup(props) {
        const isExternalLink = computed(() => {
            return typeof props.to === "string" && props.to.startsWith("http");
        });

        return { isExternalLink };
    },
};
</script>
