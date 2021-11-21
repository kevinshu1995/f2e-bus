<template>
    <div class="grid app-grid-template w-screen h-screen bg-dark text-grey-light">
        <header>
            <Header />
        </header>
        <main>
            <router-view :key="$route.name" />
        </main>
        <footer class="hidden sm:block">
            <Footer />
        </footer>
    </div>
</template>

<script>
import Header from "@/components/templates/Header.vue";
import Footer from "@/components/templates/Footer.vue";
export default {
    name: "App",
    components: {
        Header,
        Footer,
    },
    setup() {},
};
</script>

<style scoped>
.app-grid-template {
    grid-template:
        "head" 64px
        "main" 1fr
        / 1fr;
}
@screen sm {
    .app-grid-template {
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
