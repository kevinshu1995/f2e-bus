import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/views/Home.vue"),
    },
    {
        path: "/news",
        name: "News",
        component: () => import("@/views/News.vue"),
    },
    {
        path: "/qna",
        name: "Qna",
        component: () => import("@/views/Qna.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/",
    },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
