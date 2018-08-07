
// const path = require('path')
const BaseController = require('./prototype/BaseController')
const ArticleModal = require('../models/article')
const pagination = require('../helpers/page')

const formidable = require('formidable')
const path = require('path')
const fs = require('fs')

class UploadController extends BaseController {
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

  async Upload (ctx) {
    const bucket = 'blackhole'
    const accessPromise = async (targetDir) => {
      return new Promise((resolve, reject) => {
        fs.access(targetDir, function (err) {
          if (err) {
            reject(err)
          }
          resolve()
        })
      })
    }
    var form = new formidable.IncomingForm()
    form.uploadDir = '/tmp' // 文件保存在系统临时目录
    form.maxFieldsSize = 20 * 1024 * 1024 // 上传文件大小限制为最大20M
    form.keepExtensions = true // 使用文件的原扩展名
    form.encoding = 'utf-8'

    var targetDir = path.join(__dirname, '/home/storeroom')

    // 检查目标目录，不存在则创建
    try {
      await accessPromise(targetDir)
    } catch (e) {
      fs.mkdirSync(targetDir)
    }

    try {
      const parsed = await _fileParse(ctx.req)
    } catch (e) {
      console.log(e)
    }

    ctx.status = 200
    ctx.body = {
      bucket: bucket,
      key: parsed.fileName
    }
    // 文件解析与保存
    function _fileParse (req) {
      return new Promise((resolve, reject) => {
        form.parse(req, function (err, fields, files) {
          if (err) throw err
          var filesUrl = []
          var keys = Object.keys(files)
          keys.forEach(function (key) {
            var filePath = files[key].path
            var fileExt = filePath.substring(filePath.lastIndexOf('.'))
            // 以当前时间戳对上传文件进行重命名
            var fileName = new Date().getTime() + fileExt
            var targetFile = path.join(targetDir, fileName)
            // 移动文件
            fs.renameSync(filePath, targetFile)
            // 文件的Url（相对路径）
            filesUrl.push('/home/storeroom/' + fileName)
          })
          resolve({
            fileName,
            files,
            filesUrl
          })
        })
      })
    }
  }
}

module.exports = new UploadController()
