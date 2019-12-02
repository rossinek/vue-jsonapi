
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

app.get('/projects', (req, res) => {
  res.json({ data: db.projects })
})

app.get('/tags', (req, res) => {
  res.json({ data: db.tags })
})

app.listen(3000, () => {
  console.log('JSON Server is running on port 3000')
})
