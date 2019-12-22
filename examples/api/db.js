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
  { id: '1', name: 'task #1' },
  { id: '2', name: 'task #2' },
  { id: '3', name: 'task #3' },
  { id: '4', name: 'task #4' },
  { id: '5', name: 'task #5' },
  { id: '6', name: 'task #6' },
  { id: '7', name: 'task #7' },
  { id: '8', name: 'task #8' },
  { id: '8', name: 'task #9' },
  { id: '10', name: 'task #10' },
]

const tags = [
  { id: '1', name: 'personal' },
  { id: '2', name: 'work' },
  { id: '3', name: 'programming' },
]

module.exports = {
  projects: projects.map(data => createRecord('project', data)),
  projects2: projects2.map(data => createRecord('project', data)),
  tags: tags.map(data => createRecord('tag', data)),
  tasks: tasks.map(data => createRecord('task', data)),
  tasksUpdated: tasks.map(data => createRecord('task', { ...data, name: `${data.name} – UPDATED` })),
}
