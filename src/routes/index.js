const compose = require('koa-compose')
const testRoutes = require('./test')

const router = compose([
  testRoutes.routes(),
  testRoutes.allowedMethods(),
])

module.exports = router
