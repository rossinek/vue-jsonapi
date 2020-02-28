<template>
  <div>
    <project-list
      :projects="projects"
    />
    <form
      v-if="projects.length"
      @submit.prevent="writeFirstProject"
    >
      <input
        v-model="newName"
        data-spec="project-name-input"
        placeholder="Name..."
      >
      <button
        data-spec="patch-project-button"
        :disabled="projects.length && newName.length < 2"
        type="submit"
      >
        update first project in cache
      </button>
    </form>
    <p>
      Sort by:
      <select
        v-model="sortBy"
        data-spec="sort-select"
      >
        <option value="id">
          id
        </option>
        <option value="name">
          name
        </option>
        <option value="tagsNumber">
          # tags
        </option>
        <option value="tasksNumber">
          # tasks
        </option>
      </select>

      <button
        data-spec="sort-projects-button"
        @click="sort"
      >
        sort
      </button>
    </p>
    <p>
      Third project tags:
      <label
        v-for="tag in tags"
        :key="tag.id"
      >
        <input
          v-model="tagsModel"
          type="checkbox"
          :value="tag"
          data-spec="tag-checkbox"
        >
        {{ tag.name }}
      </label>
    </p>
    <form
      v-if="tags.length"
      @submit.prevent="writeFirstTag"
    >
      <input
        v-model="newTagName"
        data-spec="tag-name-input"
        placeholder="Name..."
      >
      <button
        data-spec="patch-tag-button"
        :disabled="projects.length && newName.length < 2"
        type="submit"
      >
        update first project in cache
      </button>
    </form>
    <p>
      <button
        data-spec="refetch-button"
        @click="refetch"
      >
        refetch
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
      sortBy: 'id',
      projects: [],
      newName: '',
      newTagName: '',
      tagsModel: [],
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
    tags () {
      return this.projects.flatMap(p => p.tags).filter((tag, index, all) => tag && all.indexOf(tag) === index)
    },
    firstTag () {
      return this.tags.find(t => t.id === '3')
    },
    firstProject () {
      return this.projects.find(p => p.id === '1')
    },
  },
  watch: {
    firstProject (firstProject) {
      this.newName = firstProject.name
    },
    firstTag (firstTag) {
      this.newTagName = firstTag.name
    },
    tagsModel (tagsModel) {
      this.writeThirdProjectTags(tagsModel)
    },
  },
  methods: {
    sort () {
      const config = this.$jsonapi.queries.projects.computeOptions().config
      const data = this.$jsonapi.cache.readRequestData(config)
      if (data) {
        let getValue
        switch (this.sortBy) {
          case 'name':
            getValue = p => p.name.toLowerCase()
            break
          case 'tagsNumber':
            getValue = p => -(p.tags ? p.tags.length : 0)
            break
          case 'tasksNumber':
            getValue = p => -(p.tasks ? p.tasks.length : 0)
            break
          default:
            getValue = p => p.id
            break
        }
        return this.$jsonapi.cache.writeRequestData(config, data.slice().sort((a, b) => getValue(a) < getValue(b) ? -1 : 1))
      }
    },
    async refetch () {
      this.sortBy = 'id'
      this.tagsModel = []
      return this.$jsonapi.queries.projects.refetch()
    },
    writeFirstProject () {
      this.$jsonapi.cache.write({
        ...this.firstProject,
        name: this.newName,
      })
    },
    writeThirdProjectTags (tags) {
      const project = this.projects.find(p => p.id === '3')
      this.$jsonapi.cache.write({ ...project, tags })
    },
    writeFirstTag () {
      this.$jsonapi.cache.write({
        ...this.firstTag,
        name: this.newTagName,
      })
    },
  },
}
</script>
