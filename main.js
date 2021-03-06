import App from './App'
import Vue from "vue"
import api from "./api/api"
Vue.prototype.$api = api

Vue.prototype.appID = 'wx2b0f1488c6f3405f' // 小程序的原始ID
// Vue.prototype.appID = 'wx073f509b5bd69ba1' // 小程序的原始ID
Vue.prototype.$serviceIDs = ['chPTJc26Z9Rd28dWTbJsExmYj3QltR6uOb7lkJn-pP0']

Vue.config.productionTip = false

App.myType = 'app'

const app = new Vue({
	...App
})
app.$mount()