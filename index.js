const Koa = require('koa')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const nunjucks = require('koa-nunjucks-2')
const router = require('./router')
const mongoose = require('mongoose')
const moment = require('moment')
const static = require('koa-static')
const PORT = process.env.PORT || 3000
const app = new Koa()

// mongoose 配置
mongoose.Promise = global.Promise
const DB_URL = 'mongodb://localhost:27017/test'
mongoose.connect(DB_URL, {
    useMongoClient: true
})
mongoose.connection.on('connected', () => {
    console.log('mongoose is started')
})

// 静态文件
app.use(static(path.join(__dirname, 'public')))

// 类似express的 app.local
app.use(async(ctx, next) => {
    ctx.state = {
        moment
    }
    await next()
})

// bodyparser 配置
app.use(bodyParser())

// nunjucks 配置
app.use(nunjucks({
    ext: 'html',
    path: path.join(__dirname, 'views'),
    nunjucksConfig: {
        trimBlocks: true // 开启转义 防止xss
    }
}))

// 路由配置
app.use(router.routes()).use(router.allowedMethods())

// 端口配置
app.listen(PORT, () => {
    console.log(`This project is started at ${PORT}!`)
})