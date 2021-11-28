<template>
    <div class="bg-grey-dark rounded-2xl py-4 px-6 w-full">
        <div class="space-y-3">
            <h4 class="text-xl text-primary">{{ RouteName }}</h4>
            <div class="flex flex-wrap -mx-4 text-paragraph">
                <div class="px-4 py-1 w-full md:w-1/2">{{ start }}</div>
                <div class="px-4 py-1 w-full md:w-1/2">{{ end }}</div>
                <div class="px-4 py-1 w-full md:w-1/2">{{ time }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "station-card",

    props: {
        RouteName: Array,
        start: Array,
        end: Array,
        time: Array,
    },

    setup() {},
};
</script>
