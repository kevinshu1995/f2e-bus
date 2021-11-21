<template>
    <div class="text-center">
        <h1>hello</h1>
        <router-view :key="$route.name" />
    </div>
</template>

<script>
export default {
    name: "App",
    setup() {},
};
</script>
