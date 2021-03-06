import Vue from 'vue'
import App from './App'
import Util from './common/js/util.js'
Vue.config.productionTip = false
Vue.prototype.$util = Util
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
