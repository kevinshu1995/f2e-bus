import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import { router } from "./routes.js";

import Icon from "./components/templates/Icon.vue";

const app = createApp(App).use(router);

app.component("Icon", Icon);

app.mount("#app");
