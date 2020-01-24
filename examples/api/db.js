const { createRecord } = require('./utils')

const projects = [
  {
    id: '1',
    name: 'First project',
    relationships: {
      tags: {
        data: [
          { type: 'tag', id: '2' },
        ],
      },
    },
  },
  {
    id: '2',
    name: 'Second project',
    relationships: {
      tags: {
        data: [
          { type: 'tag', id: '1' },
          { type: 'tag', id: '3' },
        ],
      },
      tasks: {
        data: [
          { type: 'task', id: '1' },
          { type: 'task', id: '2' },
        ],
      },
    },
  },
  {
    id: '3',
    name: 'Third project',
    relationships: {
      tasks: {
        data: [
          { type: 'task', id: '3' },
          { type: 'task', id: '4' },
        ],
      },
    },
  },
]

const projects2 = [
  {
    id: '4',
    name: 'Next project',
    relationships: {
      tags: {
        data: [
          { type: 'tag', id: '3' },
        ],
      },
    },
  },
]

const tasks = [
  { id: '1', name: 'task #1', relationships: { tags: { data: [{ type: 'tag', id: '3' }] } } },
  { id: '2', name: 'task #2', relationships: { tags: { data: [] } } },
  { id: '3', name: 'task #3', relationships: { tags: { data: [] } } },
  { id: '4', name: 'task #4', relationships: { tags: { data: [] } } },
  { id: '5', name: 'task #5', relationships: { tags: { data: [] } } },
  { id: '6', name: 'task #6', relationships: { tags: { data: [] } } },
  { id: '7', name: 'task #7', relationships: { tags: { data: [] } } },
  { id: '8', name: 'task #8', relationships: { tags: { data: [] } } },
  { id: '8', name: 'task #9', relationships: { tags: { data: [{ type: 'tag', id: '1' }] } } },
  { id: '10', name: 'task #10', relationships: { tags: { data: [] } } },
]

const tags = [
  { id: '1', name: 'personal' },
  { id: '2', name: 'work' },
  { id: '3', name: 'programming' },
]

const getProjectsTasks = ps => ps
  .reduce((acc, p) => acc.concat((p.relationships.tasks && p.relationships.tasks.data) || []), [])
  .map(({ id }) => tasks.find(t => t.id === id))
  .map(data => createRecord('task', data))

module.exports = {
  projects: projects.map(data => createRecord('project', data)),
  projectsTasks: getProjectsTasks(projects),
  projectsTags: tags.map(data => createRecord('tag', data)),
  projects2: projects2.map(data => createRecord('project', data)),
  projects2Tasks: getProjectsTasks(projects2),
  projects2Tags: tags.map(data => createRecord('tag', data)),
  tags: tags.map(data => createRecord('tag', data)),
  tasks: tasks.map(data => createRecord('task', data)),
  tasksUpdated: tasks.map(data => createRecord('task', { ...data, name: `${data.name} – UPDATED` })),
}
