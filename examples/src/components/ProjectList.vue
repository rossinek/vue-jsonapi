<template>
  <div>
    <ul>
      <li
        v-for="project in projects"
        :key="project.id"
        data-spec="project"
      >
        {{ project.name }}
        <ul class="tags-list">
          <li
            v-for="(tag, index) in (project.tags || [])"
            :key="tag ? tag.id : index"
          >
            <span
              v-if="tag"
              class="tag"
              data-spec="tag"
              v-text="tag.name"
            />
            <span
              v-else
              class="tag tag--placeholder"
              data-spec="tag-placeholder"
            />
          </li>
        </ul>
        <ul class="project__tasks">
          <li
            v-for="(task, index) in (project.tasks || [])"
            :key="task ? task.id : index"
          >
            <span
              v-if="task"
              class="task"
              data-spec="task"
              v-text="task.name"
            />
            <span
              v-else
              class="task task--placeholder"
              data-spec="task-placeholder"
            />

            <ul
              v-if="task"
              class="tags-list"
            >
              <li
                v-for="(tag) in (task.tags || [])"
                :key="tag.id"
              >
                <span
                  v-if="tag"
                  class="tag"
                  data-spec="tag"
                  v-text="tag.name"
                />
                <span
                  v-else
                  class="tag tag--placeholder"
                  data-spec="tag-placeholder"
                />
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    projects: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.tags-list {
  display: inline-flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.tag {
  display: inline-block;
  background-color: tan;
  color: white;
  text-transform: uppercase;
  font-size: 12px;
  margin: 0 5px;
  padding: 0 4px;
  border-radius: 3px;
  height: 1.5em;
  line-height: 1.5em;
  white-space: nowrap;
}
.tag--placeholder {
  width: 80px;
  background-color: #eee;
}
.task--placeholder::before {
  content: '...';
}
</style>
