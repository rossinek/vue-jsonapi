# DollarJsonapi

This helper is added to all components that uses Vue JSON:API. It can be accessed inside a component with `this.$jsonapi`.
You can also use it outside of a component by creating it manually
for example in vuex store.

::: tip
For more information about usage read [Basic Usage](/guide/basic-usage) chapter.
:::

## Constructor

```js
import Jsonapi from 'vue-jsonapi'

// After plugin is installed
const $jsonapi = new Jsonapi()
// or
const $jsonapi = new Jsonapi(options)
```

Constructor options are optional. If not provided options defaults to parameters used to install vue plugin.

### Available options

- `client?: AxiosInstance` – axios instance like api client.
- `cache?: Cache` – instance of [Cache](./cache).


## Properties

### `cache`
- Type: `Cache`

Cache passed in constructor.

See [Cache](./cache) for more info.

### `client`
- Type: `AxiosInstance`

Axios like api client passed in the constructor.

### `loading`
- Type: `boolean`

Boolean indicator whether any of registered queries is loading.

### `queries`
- Type: `{ [key: string]: SmartQuery }`

All smart queries registered [manually](#addquery-vm-name-options) or declared in [`jsonapi` option](/guide/basic-usage/fetching-data.html) for vue component.

See [SmartQuery](./smart-query) for more info.


## Methods

### `addQuery(vm, name, options)`

Registers smart query for a given component.

See [SmartQuery](./smart-query) for more info about parameters.

### `fetchMore(previousResponse)`

Method calls `next` link from `previousResponse` and appends new data to cached `previousResponse`.

See [Pagination](/guide/basic-usage/fetching-data.html#pagination) section in the guide.

#### Parameters
- `previousResponse` – value returned from `request` or `fetchMore` method.

#### Returns
- `Promise<{ raw: AxiosResponse, data?: NormalizedJsonapiResource}>`


### `request({ config, noCache, noRequestCache })`

Method makes a request using `request` method of [api client](#client).
#### Parameters
- `config: AxiosRequestConfig` – endpoint config for api client.
- `noCache: boolean` – if present then request and resources from response are not cached and are not extended by previously fetched attributes.
- `noRequestCache: boolean` – if present then request is not cached but response is parsed in the context of cache and stored inside it. Is ignored if `noCache` is truthy.


#### Returns
- `Promise<{ raw: AxiosResponse, data?: NormalizedJsonapiResource}>`
