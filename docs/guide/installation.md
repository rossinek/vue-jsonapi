# Installation

Install package with your favourite package manager

```sh
yarn add vue-jsonapi
# OR npm install --save vue-jsonapi
```

Create your api client

```js
import axios from 'axios'

export default axios.create({
  // URL to your JSON:API
  baseURL: 'http://localhost:3000/jsonapi',
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json',
  }
  // ...
})

```

Install the plugin into Vue

```js
import Vue from 'vue'
import Jsonapi from 'vue-jsonapi'

import apiClient from './api-client.js'

Vue.use(Jsonapi, {
  client: apiClient,
})
```
