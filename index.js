const Koa = require('koa')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const nunjucks = require('koa-nunjucks-2')
const router = require('./router')
const mongoose = require('mongoose')
const moment = require('moment')
const static = require('koa-static')
const session = require('koa-session')
const PORT = process.env.PORT || 3000
const app = new Koa()

app.keys = ['some secret hurr']
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
}
app.use(session(CONFIG, app))

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