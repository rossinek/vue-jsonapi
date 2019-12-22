# Usage in vue components

All components can use JSON:API through the `jsonapi` special option.

## `jsonapi` options
To declare JSON:API queries in your vue component, add the `jsonapi` object in the component options:
```html
<template>
  <div>My component</div>
</template>

<script>
export default {
  jsonapi: {
    // JSON:API options
  }
}
</script>
```

## `$jsonapi`

All the components have an `$jsonapi` helper available. See `DolarJsonapi` class for details.

# Fetching data

In the `jsonapi` object, add an attribute for each property you want to feed with the result of an JSON:API request.

## In vue components
```html
<template>
  <div>
    <h1>Item</h1>
    <p>{{ myItem }}<p>

    <h1>List</h1>
    <ul>
      <li v-for="(item, index) in myList" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
const api = {
  myList: { method: 'get', url: '/list' }
  myItem: ({ id }) => ({ method: 'get', url: `/list/${id}` })
}

export default {
  data () {
    return {
      myList: [],
      myItem: null,
    }
  },
  jsonapi: {
    // Simple query that will update the `myList` vue data property
    myList: {
      config: api.myList,
    },
    // Simple query with variables that will update the `myItem` vue data property
    myItem: {
      config: api.myItem,
      variables () {
        return { id: this.$route.params.itemId }
      }
    }
  },
}
</script>
```

Other query options:
```ts
type QueryOptions = {
  config: AxiosRequestConfig | (variables) => AxiosRequestConfig,
  // default is 'network-only'
  fetchPolicy?: 'network-only' | 'cache-and-network' | 'cache-first' | 'cache-only' | 'no-cache',
  // variables passed to `config` if it is a function
  // query reacts to variables change
  variables?: any || () => any,
  // if this function returns true then request is skipped
  skip?: () => boolean,
  // transform data before stored in vue component data
  update?: (data) => any,
  // called when there are errors
  error?: (error) => void,
  // set refetching interval
  pollInterval: number
}
```

Sometimes we need to know if request is in progress. Especially when we serve data from cache but request for fresh data is in progress ('cache-and-network' policy), by showing a spinner, we want to inform user that data can be outdated:

```html
<template>
  <!-- show content if `myItem` is fetched or it was found in cache -->
  <div v-if="myItem">
    <!-- show spinner if `myItem` is served from cache and fetching is in progress -->
    <h2>{{ myItem.name }} <fancy-spinner v-if="$jsonapi.queries.myItem.loading" /><h2>
    <p>{{ myItem.description }}<p>
  </div>
  <content-placeholder v-else />
</template>

<script>
const api = {
  myItem: ({ id }) => ({ method: 'get', url: `/list/${id}` })
}

export default {
  data () {
    return {
      myItem: null,
    }
  },
  jsonapi: {
    myItem: {
      fetchPolicy: 'cache-and-network',
      config: api.myItem,
      variables () {
        return { id: this.$route.params.itemId }
      },
    },
  },
}
</script>
```

## Through `$jsonapi`

By using `$jsonapi` helper we can manually make requests:

```js
const api = {
  myList: { method: 'get', url: '/list' }
  myItem: ({ id }) => ({ method: 'get', url: `/list/${id}` })
}

const listRes = await this.$jsonapi.request({
  config: api.myList
})

const itemRes = await this.$jsonapi.request({
  config: api.myItem({ id: 1 })
})
```

Other `$jsonapi.request`:

```ts
type QueryOptions = {
  config: AxiosRequestConfig,
  // if true then response won't be persisted in cache
  // and it will consist only from data included in response
  noCache?: boolean
}
```

# Creating, Updating, Deleting data

In the same way as fetching data through `$jsonapi` you can use `$jsonapi.request` to make any request to JSON:API.

```js
const api = {
  deleteItem: ({ id }) => ({ method: 'delete', url: `/list/${id}` })
}

this.$jsonapi.request({
  config: api.deleteItem({ id: 1 }),
})
```

# TODO:

1. Pagination, sorting, filtering should not be a variables.
2. Records should be marked with parent request and if there is no request pointing to record it should be removed
3. Config params should be a part of request id
4. Remove nulls from cache
5. Documentation how to update a request (query)
6. Requests that are pending should be reused if requested multiple times in short period (especially for `cache-first` policy)
7. Make GET default method
8. Allow uppercase method
