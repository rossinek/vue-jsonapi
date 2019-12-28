# Vue integration with JSON:API

Many patterns and usage may seem familiar to you, as this solution is strongly inspired by `vue-apollo`.

**[Documentation](./src/README.md)**

## Installation

1. Install package:
    ```
    npm install --save vue-jsonapi
    ```
    or:

    ```
    yarn add vue-jsonapi
    ```

2. Install the plugin into Vue:
    ```js
    import Vue from 'vue'
    import Jsonapi from 'vue-jsonapi'

    const client = axios.create()

    Vue.use(Jsonapi, { client })
    ```
