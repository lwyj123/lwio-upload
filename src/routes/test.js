const KoaRouter = require('koa-router')

const testController = require('../controllers/test')

const router = new KoaRouter({ prefix: '/api' })

router
  .get('/test', testController.test)

module.exports = router
