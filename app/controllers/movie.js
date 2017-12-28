const movieModel = require('../model/movie')
const _ = require('underscore')

exports.detail = async(ctx, next) => {
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
}

// admin page
exports.movie = async(ctx, next) => {
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
}

// update page
exports.update = async(ctx, next) => {
    let id = ctx.params.id
    let result = await movieModel.findById(id)
    await ctx.render('admin', {
        title: '电影更新页',
        movie: result
    })
}

// insert page
exports.new = async (ctx, next) => {
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
}

// list page
exports.list = async(ctx, next) => {
    try {
        let result = await movieModel.findAll()
        await ctx.render('list', {
            title: '电影列表页',
            movies: result
        })
    } catch (e) {
        console.log(e)
    }
}

// list delete movie
exports.del = async(ctx, next) => {
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
}