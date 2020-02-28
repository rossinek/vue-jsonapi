import Vue from 'vue'
import Jsonapi from 'vue-jsonapi'
import axios from 'axios'
import '../style.css'
import App from './App.vue'

const client = axios.create({ baseURL: 'http://localhost:3000/' })

Vue.use(Jsonapi, { client })

window.$jsonapi = new Jsonapi()

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
})
