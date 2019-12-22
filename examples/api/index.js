
const express = require('express')
const db = require('./db')

const app = express()
app.use(express.json())

const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

app.use(cors)

app.use((req, res, next) => {
  const delay = +req.query.delay
  if (delay && delay > 0) setTimeout(next, delay)
  else next()
})

app.get('/projects', (req, res) => {
  const page = Math.min(+req.query.page || 1)
  switch (page) {
    case 1:
      res.json({
        data: db.projects,
        links: {
          prev: null,
          next: '/projects?page=2',
        },
      })
      break
    case 2:
      res.json({
        data: db.projects2,
        links: {
          prev: '/projects?page=1',
          next: null,
        },
      })
      break
    default:
      res.sendStatus(404)
  }
})

app.get('/tags', (req, res) => {
  res.json({ data: db.tags })
})

app.get('/tasks', (req, res) => {
  res.json({ data: db.tasks })
})

app.get('/tasks/:taskId', (req, res) => {
  res.json({ data: db.tasks.find(t => t.id === req.params.taskId) })
})

app.get('/tasksUpdated', (req, res) => {
  res.json({ data: db.tasksUpdated })
})

app.get('/tasksUpdated/:taskId', (req, res) => {
  res.json({ data: db.tasksUpdated.find(t => t.id === req.params.taskId) })
})

app.listen(3000, () => {
  console.log('JSON Server is running on port 3000')
})
