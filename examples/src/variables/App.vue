<template>
  <div>
    <div class="tabs">
      <div
        class="tabs__item"
        :class="page === '1' && 'tabs__item--active'"
        data-spec="tab-page-1"
        @click="page = '1'"
      >
        Page 1
      </div>

      <div
        class="tabs__item"
        :class="page === '2' && 'tabs__item--active'"
        data-spec="tab-page-2"
        @click="page = '2'"
      >
        Page 2
      </div>
    </div>

    <div
      class="content"
      data-spec="content"
    >
      <project-list
        v-if="projects"
        :projects="projects"
      />
      <template v-else>
        Select page...
      </template>
    </div>
  </div>
</template>

<script>
import ProjectList from '../components/ProjectList.vue'

const getProjects = ({ page }) => ({ method: 'get', url: '/projects', params: { page } })

export default {
  components: {
    ProjectList,
  },
  data () {
    return {
      page: null,
      projects: null,
    }
  },
  jsonapi: {
    projects: {
      config: getProjects,
      variables () {
        return { page: this.page }
      },
      skip () {
        return !this.page
      },
    },
  },
}
</script>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 1px solid lightgray;
}
.tabs__item {
  padding: 20px;
  cursor: pointer;
  border-bottom: 4px solid transparent;
}
.tabs__item--active {
  border-bottom-color: skyblue;
}
.content {
  padding: 20px;
  font-size: 20px;
}
</style>
