const userModel = require('../model/user')
const session = require('koa-session')

exports.getSignup = async(ctx, next) => {
    await ctx.render('signup')
}

// signup (注册表单处理)
exports.postsignup = async(ctx, next) => {
    let _user = ctx.request.body.user

    let user = new userModel(_user)

    // find 返回的是一个Array  findOne返回的null 或者 该条数据
    let one = await userModel.findOne({name: _user.name})
    
    if (one) {
        ctx.redirect('/user/signin')
    } else {
        await user.save()
        
        ctx.redirect('/')
    }
}

// signin (登录)
exports.getsignin = async(ctx, next) => {
    await ctx.render('signin')
}

// signin (登录表单处理)
exports.postsignin = async(ctx, next) => {
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
                ctx.redirect('/user/signin')
            }
        } else {
            return ctx.redirect('/user/signup')
        }
    } catch (e) {
        console.log(e)
    }
}

exports.logout =  async(ctx, next) => {
    delete ctx.session.user
    delete ctx.state.user

    return ctx.redirect('/')
}

exports.userlist = async(ctx, next) => {
    try {
        let result = await userModel.findAll()
        await ctx.render('userlist', {
            title: '用户列表页',
            users: result
        })
    } catch (e) {
        console.log(e)
    }
}