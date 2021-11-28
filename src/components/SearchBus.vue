<template>
    <div>
        <Search v-model="search" id="home-search" placeholder="你想去哪裡" />
    </div>
</template>

<script>
import Search from "@/components/elements/form/Search.vue";
import { ref } from "vue";

export default {
    components: {
        Search,
    },
    setup() {
        const search = ref("");

        return {
            search,
        };
    },
};
</script>
