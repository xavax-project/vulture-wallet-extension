import { createApp } from "vue";
import App from "./App.vue";


//NOTE: VERY IMPORTANT! Please COMMENT this when building to a distro, this is only meant for serving, thx :)
navigator.serviceWorker.register('./vulture_worker-bundle.js');

const app = createApp(App)
app.mount("#app");
