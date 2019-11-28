const server = require('../server')
const { createRecord } = require('../api')

const authors = [
  {
    id: '1',
    name: 'William Shakespeare',
    relationships: {
      categories: {
        data: [
          { type: 'category', id: '2' },
          { type: 'category', id: '3' },
        ],
      },
    },
  },
  { id: '2', name: 'Agatha Christie' },
  { id: '3', name: 'Barbara Cartland' },
  { id: '4', name: 'Danielle Steel' },
]

const categories = [
  { id: '1', name: 'whodunits' },
  { id: '2', name: 'plays' },
  { id: '3', name: 'romance' },
]

const db = {
  authors: authors.map(data => createRecord('author', data)),
  categories: categories.map(data => createRecord('category', data)),
}

server.run({ db })
