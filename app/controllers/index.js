const movieModel = require('../model/movie')

exports.index = async (ctx, next) => {
    try {
        let result = await movieModel.findAll()
        await ctx.render('index', {
            title: '首页',
            movies: result
        })
    } catch (e) {
        console.log(e)
    }
}