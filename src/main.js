import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import apolloProvider from "./graphql";
import { Vuetify } from "vuetify/es5/components";
import colors from "vuetify/es5/util/colors";

Vue.config.productionTip = false;
Vue.use(Vuetify, {
	theme: {
		primary: "#f6416c",
		accent: "#f6416c",
		secondary: colors.grey.darken3,
		info: colors.blue.base,
		warning: colors.amber.base,
		error: colors.red.accent2,
		success: colors.green.base
	}
});

/* eslint-disable no-new */
new Vue({
	el: "#app",
	router,
	store,
	apolloProvider,
	render: h => h(App)
});
