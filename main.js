import App from './App'
import Vue from "vue"
import api from "./api/api"
Vue.prototype.$api = api

Vue.prototype.appID = 'wx33240310b869d285' // 小程序的原始ID
// Vue.prototype.appID = 'wx073f509b5bd69ba1' // 小程序的原始ID
Vue.prototype.$serviceIDs = ['61Gkt3cSe2WmxZwETv2OTtdF0x-71Wj9GKacncPWchA']

Vue.config.productionTip = false

import share from '@/static/js/share.js';
Vue.mixin(share)

App.myType = 'app'

const app = new Vue({
	...App
})
app.$mount()