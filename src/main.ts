import { createApp } from "vue";
import { createPinia } from "pinia";
import YYUI from "@nimble-ui/vue";
import "@nimble-ui/vue/index.css";
import "@/assets/css/icon.css";

import App from "./App.vue";
import router from "./router";

import YIcon from "@/components/YIcon";
import YMove from "./components/YMove";
import YArea from "./components/YArea";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(YYUI, {
  isDark: true
});

app.component("YIcon", YIcon);
app.component("YMove", YMove);
app.component("YArea", YArea);

app.mount("#app");
