<template>
    <div class="flex items-center sm:grid container-grid-template px-5 sm:px-0">
        <div class="container-grid-left hidden sm:block">
            <slot name="left" />
        </div>
        <div class="container-grid-center w-full h-full">
            <slot name="main" />
        </div>
        <div class="container-grid-right hidden sm:block">
            <slot name="right" />
        </div>
    </div>
</template>

<script>
export default {
    name: "Container",
};
</script>

<style scoped>
@screen sm {
    .container-grid-template {
        grid-template: "left center right" 1fr / 64px 1fr 64px;
    }
}
.container-grid-left {
    grid-area: left;
}
.container-grid-center {
    grid-area: center;
}
.container-grid-right {
    grid-area: right;
}
</style>
