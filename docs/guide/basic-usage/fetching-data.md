# Fetching Data

To make the most of this integration, it's worth to make your requests in declarative way. To declare JSON:API queries in your vue component use special `jsonapi` option.

## Simple query

Let assume that there is an endpoint `GET /hello` that responds with the following resource:

```
GET /hello
```

```json
{
  "data": {
    "id": "1",
    "type": "greeting",
    "attributes": {
      "message": "Hello world!"
    }
  }
}
```

To get this resource in your application declare it in your vue component:

```js
jsonapi: {
  hello: {
    config: { method: 'get', url: '/hello' },
  },
},
```

::: tip
Note that `config` option is just a configuration object for api client (axios syntax). In real life application you'll rather extract such configs to separate file (learn more about [good practices](/guide/good-practices)).
:::


Initialize the property in your vue component's data hook, which will be fed with the normalized response from JSON:API:

```js
data () {
  return {
    hello: null,
  },
},
```

Full example:


```vue
<template>
  <p v-if="hello">
    Message from API: {{ hello.message }}
  </p>
</template>

<script>
export default {
  data () {
    return {
      hello: null,
    },
  },
  jsonapi: {
    hello: {
      config: { method: 'get', url: '/hello' },
    },
  },
}
</script>
```

## Query with parameters

Sometimes a request need to be parametrized. I some cases you might want to reuse the request config in different places, in other cases you might want to adjust the request according to user input. To achieve those goals you can define `config` as a function that gets all needed parameters and returns config object. Use `variables` property to define parameters for a config.

You can pass `variables` as a static object but in most cases you might want to make them dynamic. To make it possible simply define `variables` as a function. It is called in the context of vue instance so you can access `this` inside.

::: warning
To be able to access `this` while computing `variables` make sure that this function is not bound to other context (e.g. don't define it as arrow function).
:::

```vue{3,14,19-29}
<template>
  <div>
    <input v-model.lazy="value" placeholder="What's your name?">
    <p v-if="hello">
      Message from API: {{ hello.message }}
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '',
      hello: null,
    },
  },
  jsonapi: {
    hello: {
      config: ({ name }) => ({
        method: 'get',
        url: `/hello?name=${name}`
      }),
      variables () {
        return {
          name: this.value
        }
      }
    },
  },
}
</script>
```

::: tip
Parameters are reactive. It means that query keep tracks of `variables` changes. Each time parameters are changed, new request is made to the API.
:::

## Loading state

You can easily check if any of queries inside components are pending by `$jsonapi.loading` property:

```vue
<div v-if="$jsonapi.loading">Loading...</div>
```

You can also check each query separately, e.g. `hello` query:

```vue
<div v-if="$jsonapi.queries.hello.loading">Loading...</div>
```


## Skipping the query

There are many cases when you might want to disable the query e.g you don't have all needed parameters yet or you want to implement lazy loading functionality. To make it possible use the `skip` option:

```js{12-15}
jsonapi: {
  hello: {
    config: ({ name }) => ({
      method: 'get',
      url: `/hello?name=${name}`
    }),
    variables () {
      return {
        name: this.value
      }
    }
    // Disable the query if name is shorter than 2 characters
    skip () {
      return this.value.length > 2
    },
  },
},
```

## Fetch policies

This integration uses a cache under the hood. One of its most important role is to limit used memory for responses – each resource is stored once. Besides the resources the cache also stores requests made to api together with information about what was included in the response. We can make use of this information using different *fetch policies*.

### Why should I care?

Thanks to the information from a cache, we can sometimes display to the user what we have already fetched in the past instead of fetching it again. Using proper fetch policy for a given case can magnificently improve experience of your application users. It can also help reduce the amount of requests made to the server.

### What are the options?

#### Cache First

When the query becomes active it will check if any response for the same request is present in the cache. If data is available it will be set as result of the query. In other case data will be fetched from API.

#### Cache And Network

This policy is very similar to "cache first" policy. If there is no such request inside a cache data will be fetched from API. If data is available it will be set as result of the query (like for "cache first" policy) but in addition the request for a fresh data will be made to API. Thanks to that even if the user sees outdated data from cache for a moment, data will be updated a moment later.

#### Network Only

A query with "network only" policy won't show cached data until a server response arrives. This policy is best for the pages that should never show outdated information.

#### Cache Only

The query with such fetch policy never sends any request to API. Result of the query is always set to current cached response or it has default value if there is no such response.

#### No Cache

This policy is similar to "network only" policy. The difference is that its response is not saved to cache and its value won't be extended or updated by other requests.


### How to use it?

Setting fetch policy for a query can be done by providing `fetchPolicy` option. It can be one of the following strings: `network-only`, `cache-and-network`, `cache-first`, `cache-only`, `no-cache`.

```js{4}
jsonapi: {
  hello: {
    config: { method: 'get', url: '/hello' },
    fetchPolicy: 'cache-first',
  },
},
```

## Polling

Polling is a mechanism that allows you to keep sync with the server by executing query periodically at a specified interval. To use it simply pass `pollInterval` option in milliseconds.

## Refetching data

To manually refetch data use `refetch` method of a query:

```vue
<template>
  <div>
    <p v-if="$jsonapi.loading">Loading...</p>
    <p v-else>{{ animal.name }}</p>

    <button @click="$jsonapi.queries.animal.refetch">
      Get other animal!
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      animal: null,
    },
  },
  jsonapi: {
    animal: {
      config: { method: 'get', url: '/random-animal' },
    },
  },
}
</script>
```

## Error handling

Use `error` option to pass handler for api errors.

```js
jsonapi: {
  hello: {
    config: { method: 'get', url: '/not-existing-url' },
    error (e) {
      // do something
    }
  },
}
```

## Pagination

Some of your resources needs to be paginated due to their quantity. You can of course handle it by yourself using `variables` but JSON:API specification suggest to use special links added to response ([read more](https://jsonapi.org/format/#fetching-pagination)). If your api matches this part of the specification you can use `fetchMore` method of query. If there is `next` link, data will be fetched and merged with previous responses. Use `hasMore` property to check if there is next page.

```vue
<template>
  <div>
    <ul>
      <li v-for="animal in animals" :key="animal.id">
        {{ animal.name }}
      </li>
    </ul>

    <loading-spinner v-if="$jsonapi.queries.animals.loading" />
    <button
      v-else-if="$jsonapi.queries.animals.hasMore"
      @click="$jsonapi.queries.animals.fetchMore"
    >
      load more
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      animals: [],
    },
  },
  jsonapi: {
    animals: {
      config: { method: 'get', url: '/animals' },
    },
  },
}
</script>
```

## Manual query

By using `$jsonapi` helper we can make requests manually:

```js
const { data } = await this.$jsonapi.request({
  config: { method: 'get', url: '/hello' }
})
```

## Outside a component

Documentation will be available soon...

## Advanced options

#### Accessing raw response

Documentation will be available soon...

#### Formatting data

Documentation will be available soon...
