<template>
  <div>
    <project-list
      :projects="projects"
    />
    <p v-if="hasMoreProjects">
      <button
        data-spec="fetch-more-button"
        @click="fetchMoreProjects"
      >
        fetch more
      </button>
    </p>
    <form
      v-if="projects.length"
      @submit.prevent="renameTaskTag"
    >
      <input
        v-model="newName"
        data-spec="tag-name-input"
        placeholder="Name..."
      >
      <button
        data-spec="patch-tag-button"
        :disabled="newName.length < 2"
        type="submit"
        @click="renameTaskTag"
      >
        rename task tag
      </button>
    </form>
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
      newName: '',
    }
  },
  jsonapi: {
    projects: {
      fetchPolicy: 'cache-first',
      config: {
        method: 'get',
        url: '/projects?include=tags,tasks',
      },
    },
  },
  computed: {
    hasMoreProjects () {
      return this.$jsonapi.queries.projects.hasMore
    },
  },
  methods: {
    async fetchMoreProjects () {
      return this.$jsonapi.queries.projects.fetchMore()
    },
    async renameTaskTag () {
      await this.$jsonapi.request({
        config: {
          method: 'patch',
          url: '/tags/3',
          data: {
            id: '3',
            type: 'tag',
            attributes: {
              name: this.newName,
            },
          },
        },
      })
    },
  },
}
</script>
