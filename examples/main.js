import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
Vue.prototype.axios = axios;
import search_input from '../packages/search_input'

Vue.component('search_input',search_input);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
