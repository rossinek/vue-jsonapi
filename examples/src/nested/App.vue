<template>
  <div>
    <ul>
      <li
        v-for="project in projects"
        :key="project.id"
        data-spec="project"
      >
        {{ project.name }}
        <ul>
          <li
            v-for="tag in (project.tags || []).filter(Boolean)"
            :key="tag.id"
          >
            {{ tag.name }}
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
      projects: [],
      tags: [],
    }
  },
  jsonapi: {
    projects: {
      fetchPolicy: 'cache-first',
      config: {
        method: 'get',
        url: '/projects',
      },
    },
    tags: {
      fetchPolicy: 'cache-first',
      config: {
        method: 'get',
        url: '/tags',
      },
    },
  },
}
</script>

<style>
</style>
