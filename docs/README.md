---
home: true
heroImage: /logo.png
actionText: Get Started →
actionLink: /guide/
features:
- title: Data normalization
  details: Forget about accessing raw api responses and use simple normalized data objects.
- title: Declarative data fetching
  details: Declare in component what resources you need and don't worry about all the things related to the call.
- title: Auto updates
  details: Resources are shared and reused so any record changes are propagated to all places where given record is used.

footer: MIT Licensed | Copyright © 2019-present Artur Rosa
---

### Setup
Install package with your favourite package manager

```sh
yarn add vue-jsonapi
# OR npm install --save vue-jsonapi
```

Install the plugin into Vue

```js
import Vue from 'vue'
import Jsonapi from 'vue-jsonapi'

Vue.use(Jsonapi, {
  client: axios.create()
})
```
