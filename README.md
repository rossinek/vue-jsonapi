<p align="center">
  <a href="https://rossinek.github.io/vue-jsonapi/" target="_blank">
    <img width="300" src="https://github.com/rossinek/vue-jsonapi/raw/master/docs/.vuepress/public/logo.png" alt="logo">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vue-jsonapi"><img src="https://img.shields.io/npm/v/vue-jsonapi.svg" alt="Version"></a>
  <a href="https://github.com/rossinek/vue-jsonapi/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/vue-jsonapi.svg" alt="License"></a>
</p>


# Vue JSON:API

Vue JSON:API is meant to be a painless integration with well formatted APIs. It is designed to facilitate work with api, help maintain a clean, consistent and readable code base, and speed up development. Some features will be helpful in providing a good experience for users.

Many patterns and usage may seem familiar to you, as this solution is strongly inspired by [VueApollo](https://github.com/vuejs/vue-apollo).

## Documentation

Docs are available at https://rossinek.github.io/vue-jsonapi/

## Features

### Data normalization

Instead of accessing raw JSON:API responses you will use simple normalized data objects.

See [Normalized Data](https://rossinek.github.io/vue-jsonapi/guide/normalization.html) chapter.

### Declarative data fetching

Declare in component what resources you need and don't worry about all the things related to the call.

### Auto updates

Resources are shared and reused so any record changes are propagated to all places where given record is used. You can forget about updating the UI or refetching the queries.

### Fetch policies

Make use of already fetched data using fetch policies. Easily specify how you want your component to interact with the cache.

### And much more...

While reading this Guide and API Reference, you will certainly discover many other interesting features of this integration. Have fun!
