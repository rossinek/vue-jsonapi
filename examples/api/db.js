const { createRecord } = require('./utils')

const projects = [
  {
    id: '1',
    name: 'First project',
    relationships: {
      tags: {
        data: [
          { type: 'tag', id: '2' },
          { type: 'tag', id: '3' },
        ],
      },
    },
  },
  { id: '2', name: 'Second project' },
  { id: '3', name: 'Last project' },
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
  { id: '1', name: 'home' },
  { id: '2', name: 'office' },
  { id: '3', name: 'morning' },
]

module.exports = {
  projects: projects.map(data => createRecord('project', data)),
  tasks: tasks.map(data => createRecord('task', data)),
  tags: tags.map(data => createRecord('tag', data)),
}
