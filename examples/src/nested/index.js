import Vue from 'vue'
import Jsonapi, { Cache } from 'vue-jsonapi'
import axios from 'axios'
import App from './App.vue'

const client = axios.create({ baseURL: 'http://localhost:3000/' })
const cache = new Cache()

Vue.use(Jsonapi, { client, cache })

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
})
