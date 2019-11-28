<template>
  <div>
    <ul>
      <li
        v-for="author in authors"
        :key="author.id"
      >
        {{ author.name }}
        <ul>
          <li
            v-for="category in (author.categories || []).filter(Boolean)"
            :key="category.id"
          >
            {{ category.name }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      authors: [],
      categories: [],
    }
  },
  jsonapi: {
    authors: {
      fetchPolicy: 'cache-first',
      config: {
        method: 'get',
        url: '/authors',
      },
    },
    categories: {
      fetchPolicy: 'cache-first',
      config: {
        method: 'get',
        url: '/categories',
      },
    },
  },
}
</script>

<style>
</style>
