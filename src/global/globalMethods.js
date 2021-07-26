import Vue from 'vue'
import { GET, POST } from '../api/axios'
import urls from '../api/urls'

Vue.prototype.$get = GET
Vue.prototype.$post = POST
Vue.prototype.$urls = urls
