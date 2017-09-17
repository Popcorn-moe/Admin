import Vue from 'vue'
import { Vuetify, VTextField, VIcon, VChip, VBtn, VMenu } from 'vuetify/src/components'
import VEditDialog from 'vuetify/src/components/VDataTable/VEditDialog'
import App from './App'
import router from './router'
import store from './store'
import apolloProvider from './graphql'

VTextField.components = {
  VIcon
}

VChip.components = {
  VIcon
}

VEditDialog.components = {
  VMenu,
  VBtn
}

Vue.config.productionTip = false
Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  apolloProvider,
  render: h => h(App)
})
