import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";


import "primeflex/primeflex.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import "./assets/style/style.css";

const app = createApp(App);

app.use(router);
app.use(store);
app.use(PrimeVue);

//components

import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import Image from "primevue/image";
import InputNumber from "primevue/inputnumber";
import Galleria from "primevue/galleria";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import Steps from "primevue/steps";
import BlockUI from "primevue/blockui";
import Slider from "primevue/slider";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";

app.component("InputText", InputText);
app.component("Password", Password);
app.component("Button", Button);
app.component("Avatar", Avatar);
app.component("Image", Image);
app.component("InputNumber", InputNumber);
app.component("Galleria", Galleria);
app.component("Dialog", Dialog);
app.component("Textarea", Textarea);
app.component("Steps", Steps);
app.component("BlockUI", BlockUI);
app.component("Slider", Slider);
app.component("ConfirmDialog", ConfirmDialog);
app.component("Toast", Toast);
app.use(ConfirmationService);
app.use(ToastService);


app.mount("#app");
