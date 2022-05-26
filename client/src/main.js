import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import axios from 'axios'
import Vue from 'vue'

import router from "./router/router";
import store from "../vuex/store";
import App from './App.vue'

// Bootstrap Vue
import BootstrapVue from 'bootstrap-vue'

// Custom components
import BaseLayoutModifier from '@/components/BaseLayoutModifier'
import BaseBlock from '@/components/BaseBlock'
import BaseBackground from '@/components/BaseBackground'
import BasePageHeading from '@/components/BasePageHeading'
import BaseNavigation from '@/components/BaseNavigation'

// Custom directives
import clickRipple from '@/directives/clickRipple'
import toggleClass from '@/directives/toggleClass'

// Register global plugins
Vue.use(BootstrapVue)

// Register global components
Vue.component(BaseLayoutModifier.name, BaseLayoutModifier)
Vue.component(BaseBlock.name, BaseBlock)
Vue.component(BaseBackground.name, BaseBackground)
Vue.component(BasePageHeading.name, BasePageHeading)
Vue.component(BaseNavigation.name, BaseNavigation)

// Register global directives
Vue.directive('click-ripple', clickRipple)
Vue.directive('toggle-class', toggleClass)

// Disable tip shown in dev console when in development mode
Vue.config.productionTip = false

// Add Axios
Vue.prototype.$http = axios;
Vue.config.productionTip = false

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:9001/';
// axios.defaults.baseURL = 'http://159.223.42.191:4000/';

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

