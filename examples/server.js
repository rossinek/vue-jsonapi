const fs = require('fs')
const path = require('path')
const express = require('express')
const rewrite = require('express-urlrewrite')
const app = express()

const distPath = path.join(__dirname, 'dist')

app.use(express.static(distPath))

app.get('/.server-health', (req, res) => {
  res.status(200).send('Hello World!')
})

fs.readdirSync(distPath).forEach(namespace => {
  if (fs.statSync(path.join(distPath, namespace)).isDirectory()) {
    app.use(rewrite('/' + namespace + '/*', '/' + namespace + '/index.html'))
  }
})

const port = process.env.PORT || 4000
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
