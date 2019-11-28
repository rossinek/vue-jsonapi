// server.js
module.exports.run = ({ db }) => {
  const jsonServer = require('json-server')
  const server = jsonServer.create()
  const router = jsonServer.router(db)
  const middlewares = jsonServer.defaults()

  router.render = (req, res) => {
    res.jsonp({ data: res.locals.data })
  }

  server.use(middlewares)
  server.use(router)
  server.listen(3000, () => {
    console.log('JSON Server is running on port 3000')
  })
}
