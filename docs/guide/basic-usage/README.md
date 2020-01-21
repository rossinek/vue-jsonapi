# Introduction

There are two main ways to use JSON:API: declaratively through the `jsonapi` option or imperatively with `$jsonapi` helper. While the first approach is ideal for fetching data, the second approach is more suitable for creating, updating or deleting data.

To declare JSON:API queries in your Vue component, add the `jsonapi` object in the component options:

```vue
<template>
  <div>My component</div>
</template>

<script>
export default {
  jsonapi: {
    // JSON:API queries
  },
  methods: {
    makeSomeRequest () {
      this.$jsonapi.request(/* ... */)
    }
  }
}
</script>
```
