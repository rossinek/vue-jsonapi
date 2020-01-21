# SmartQuery

There are two ways how you can create smart queries: declaratively through the `jsonapi` option or imperatively with `$jsonapi` helper. The first approach works for most cases.

```vue
<template>
  <div>My component</div>
</template>

<script>
export default {
  data () {
    return {
      // default value for myAwesomeQuery
      myAwesomeQuery: null,
      // default value for myDynamicQuery
      myDynamicQuery: null,
    }
  },
  jsonapi: {
    myAwesomeQuery: {
      // options here
    },
  },
  methods: {
    dynamicallyAddSmartQuery () {
      this.$jsonapi.addQuery(this, 'myDynamicQuery', {
        // options here
      })
    },
  },
}
</script>
```

::: tip
For more information about usage read [Fetching Data](/guide/basic-usage/fetching-data.html) chapter.
:::

## Accessing query

Each query registered in component is accessible in [`$jsonapi.queries` property](/api/dollar-jsonapi.html#queries) under its name, e.g.:

```js
this.$jsonapi.queries.myAwesomeQuery
```

## Options

### `config`
- Type: `AxiosRequestConfig | (variables: any) => AxiosRequestConfig`

Endpoint config for api client.

### `error` (optional)
- Type: `(e: AxiosError) => undefined | { data: any }`

Custom error handling. If object of type `{ data: any }` is returned from this function, its `data` property will be used as a query result. In other case query result won't change. It is called in the context of vue instance so you can access `this` inside.

### `fetchPolicy` (optional)
- Type: `'network-only' | 'cache-and-network' | 'cache-first' | 'cache-only' | 'no-cache'`
- default: `'network-only'`

Check [Fetch Policies](/guide/basic-usage/fetching-data.html#fetch-policies) section for more info.

### `pollInterval` (optional)
- Type: `number`

Poll interval in miliseconds.

Check [Polling](/guide/basic-usage/fetching-data.html#polling) section for more info.


### `skip` (optional)
- Type: `boolean | () => boolean`

Check [Skipping the query](/guide/basic-usage/fetching-data.html#skipping-the-query) section for more info.

### `update` (optional)
- Type: `(data: NormalizedJsonapiResource, req: CacheRequestInfo) => any`

Function used to modify/format data fetched from api before saving in a component data. It has also access to cached request info that contains raw api response.

### `variables` (optional)
- Type: `object | () => object`

Parameters passed to `config`.

Check [Query with parameters](/guide/basic-usage/fetching-data.html#query-with-parameters) section for more info.

## Properties

### `hasMore`
- Type: `boolean`

Indicates whether there is next page to fetch.

See also [`fetchMore` method](#fetchmore) and [Pagination](/guide/basic-usage/fetching-data.html#pagination) section.

### `loading`
- Type: `boolean`

Indicates whether request is in progress.

### `request`
- Type: `CacheRequestInfo`

### `status`
- Type: `'idle' | 'pending' | 'success' | 'error'`

Indicates current status of the request:

- `status === 'idle'`

    Request to API wasn't triggered at all - it can happen if request is skipped or data from cached is preferred according to fetch policy (e.g. `cache-only`).

-  `status === 'pending'`

    Request has been sent, but api has not yet responded.

-  `status === 'success'`

    Request has been sent and api has responded with success.

-  `status === 'error'`

    Request has been sent but ended up with an error.

## Methods

### fetchMore()

Fetches next page according to `next` link from last request response.

See also [`hasMore` property](#hasmore) and [Pagination](/guide/basic-usage/fetching-data.html#pagination) section.


### refetch()

Repeats (or performs) a request if it's not skipped.

Check [Refetching data](/guide/basic-usage/fetching-data.html#refetching-data) section for more info.
