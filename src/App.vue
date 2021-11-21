<template>
    <div class="grid main-grid-template w-screen h-screen">
        <header>header</header>
        <main>
            <router-view :key="$route.name" />
        </main>
        <footer class="hidden sm:block">footer</footer>
    </div>
</template>

<script>
export default {
    name: "App",
    setup() {},
};
</script>

<style scoped>
.main-grid-template {
    grid-template:
        "head" 64px
        "main" 1fr
        / 1fr;
}
@screen sm {
    .main-grid-template {
        grid-template:
            "head" 64px
            "main" 1fr
            "footer" 64px
            / 1fr;
    }
}

header {
    grid-area: head;
}
main {
    grid-area: main;
}
footer {
    grid-area: footer;
}
</style>
