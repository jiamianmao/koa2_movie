const router = require('koa-router')()
const movieModel = require('./model/movie')
const userModel = require('./model/user')
const session = require('koa-session')
const _ = require('underscore')

// 路由配置
// index page
router.get('/', async(ctx, next) => {
    try {
        let _user = ctx.session.user
        ctx.state.user = _user
        let result = await movieModel.findAll()
        await ctx.render('index', {
            title: '首页',
            movies: result
        })
    } catch (e) {
        console.log(e)
    }
})

// detail page
router.get('/movie/:id', async(ctx, next) => {
    let id = ctx.params.id
    try {
        let result = await movieModel.findById(id)
        await ctx.render('detail', {
            title: '电影 详情页',
            movie: result
        })
    } catch (e) {
        console.log(e)
    }
})

// admin page
router.get('/admin/movie', async(ctx, next) => {
    await ctx.render('admin', {
        title: '后台电影录入页',
        movie: {
            title: '',
            director: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
})

// update page
router.get('/admin/update/:id', async(ctx, next) => {
    let id = ctx.params.id
    let result = await movieModel.findById(id)
    await ctx.render('admin', {
        title: '电影更新页',
        movie: result
    })
})

// insert page
router.post('/admin/movie/new', async (ctx, next) => {
    // 拿到这条数据的id 在里面设置一个隐藏域
    let id = ctx.request.body.movie._id
    // 判断这个id是否存在，存在了就更新，不存在就添加
    let movieObj = ctx.request.body.movie
    let _movie
    if (id !== 'undefined') {
        let result = await movieModel.findById(id)
        _movie = _.extend(result, movieObj)
        await _movie.save()
        ctx.redirect(`/movie/${result.id}`)
    } else {
        _movie = new movieModel({
            director: movieObj.director,
            title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
        })
        await _movie.save()
        ctx.redirect(`/movie/${result.id}`)
    }
})

// list page
router.get('/admin/list', async(ctx, next) => {
    try {
        let result = await movieModel.findAll()
        await ctx.render('list', {
            title: '电影列表页',
            movies: result
        })
    } catch (e) {
        console.log(e)
    }
})

// list delete movie
router.delete('/admin/list', async(ctx, next) => {
    let id = ctx.query.id
    if (id) {
        try {
            await movieModel.remove({_id: id})
            ctx.body = {
                'success': 1
            }
        } catch (e) {
            console.log(e)
        }
    }
})

// signup (注册)
router.get('/user/signup', async(ctx, next) => {
    await ctx.render('signup')
})

// signup (注册表单处理)
router.post('/user/signup', async(ctx, next) => {
    let _user = ctx.request.body.user

    let user = new userModel(_user)

    // find 返回的是一个Array  findOne返回的null 或者 该条数据
    let one = await userModel.findOne({name: _user.name})
    
    if (one) {
        ctx.redirect('/')
    } else {
        await user.save()
        
        ctx.redirect('/admin/userlist')
    }
})

// signin (登录)
router.get('/user/signin', async(ctx, next) => {
    await ctx.render('signin')
})

// signin (登录表单处理)
router.post('/user/signin', async(ctx, next) => {
    let user = ctx.request.body.user
    let { name } = user
    let { password } = user
    try {
        let one = await userModel.findOne({name: name})
        if (one) {
            let isMatch = await one.comparePassword(password)
            if (isMatch) {
                ctx.session.user = one
                return ctx.redirect('/')
            } else {
                console.log('fail')
            }
        } else {
            return ctx.redirect('/')
        }
    } catch (e) {
        console.log(e)
    }
})

router.get('/user/logout', async(ctx, next) => {
    delete ctx.session.user
    delete ctx.state.user

    return ctx.redirect('/')
})

// userlist page
router.get('/admin/userlist', async(ctx, next) => {
    try {
        let result = await userModel.findAll()
        await ctx.render('userlist', {
            title: '用户列表页',
            users: result
        })
    } catch (e) {
        console.log(e)
    }
})

module.exports = router