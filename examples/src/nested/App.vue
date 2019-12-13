<template>
  <div>
    <project-list
      :projects="projects"
    />
    <p>
      <button
        data-spec="get-updated-task-button"
        @click="getUpdatedTask"
      >
        get updated "task #1"
      </button>
    </p>
  </div>
</template>

<script>
import ProjectList from '../components/ProjectList.vue'

export default {
  components: {
    ProjectList,
  },
  data () {
    return {
      projects: [],
      tags: [],
      tasks: [],
      updatedTask: null,
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
    tasks: {
      fetchPolicy: 'cache-first',
      config: {
        method: 'get',
        url: '/tasks',
      },
    },
  },
  methods: {
    async getUpdatedTask () {
      const { data } = await this.$jsonapi.request({
        config: {
          method: 'get',
          url: '/tasksUpdated/1',
        },
      })
      this.updatedTask = data
    },
  },
}
</script>
