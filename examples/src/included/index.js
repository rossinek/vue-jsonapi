import { createApp, h } from 'vue'
import Jsonapi from 'vue-jsonapi'
import axios from 'axios'
import '../style.css'
import App from './App.vue'

const client = axios.create({ baseURL: 'http://localhost:3000/' })

window.$jsonapi = new Jsonapi()

const app = createApp({
  render: () => h(App),
})

app.use(Jsonapi, { client })

app.mount('#app')
