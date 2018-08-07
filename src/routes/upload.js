const KoaRouter = require('koa-router')

const uploadController = require('../controllers/upload')

const router = new KoaRouter({ prefix: '/' })

router
  .post('/', uploadController.Upload)

module.exports = router
