
// const path = require('path')
const BaseController = require('./prototype/BaseController')
const ArticleModal = require('../models/article')
const pagination = require('../helpers/page')

class Test extends BaseController {
  async GetArticleList (ctx) {
    const query = ctx.query
    const searchQuery = {}
    // if (false) {
    //   searchQuery.$and = []
    // }
    // if (false) {
    //   searchQuery.$or = []
    // }
    const list = await ArticleModal
      .find(searchQuery)
      .sort({ updated_at: -1 })

    const data = pagination.getCurrentPageDataWithPagination(
      list.map(item => item.toObject()),
      query.offset + 1,
      query.limit
    )
    ctx.body = {
      ...data
    }
  }

  async test (ctx) {
    ctx.body = {
      'test': 'wori'
    }
  }
}

module.exports = new Test()
