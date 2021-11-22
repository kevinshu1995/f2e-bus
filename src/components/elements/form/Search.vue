<template>
    <div class="relative">
        <label
            :class="[
                'absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none',
                'flex items-center space-x-3 text-paragraph',
                'text-sm sm:text-base',
            ]"
            :for="`form-search-${id}`"
            v-if="!value"
        >
            <Icon name="search" class="w-3" />
            <span>
                {{ placeholder }}
            </span>
        </label>
        <input
            type="search"
            :id="`form-search-${id}`"
            v-model="value"
            v-bind="$attrs"
            :class="[
                padding,
                'text-center text-primary bg-grey-dark ring-transparent focus:ring-primary rounded-xl w-full',
            ]"
            placeholder=""
        />
    </div>
</template>

<script>
export default {
    name: "Search",

    emits: ["update:value"],

    props: {
        id: {
            type: String,
            required: true,
        },
        padding: {
            type: String,
            default: "py-3 px-4",
        },
        value: [String, Number],
        placeholder: String,
    },

    setup() {},
};
</script>

<style scoped>
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
    -webkit-appearance: none;
}
</style>
