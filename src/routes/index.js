const compose = require('koa-compose')
const uploadRoutes = require('./upload')

const router = compose([
  uploadRoutes.routes(),
  uploadRoutes.allowedMethods()
])

module.exports = router
