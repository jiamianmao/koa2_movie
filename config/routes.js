const router = require('koa-router')()
const Index = require('../app/controllers/index')
const Movie = require('../app/controllers/movie')
const User = require('../app/controllers/user')

// index page
router.get('/', Index.index)

// detail page
router.get('/movie/:id', Movie.detail)
router.get('/admin/movie', Movie.movie)
router.get('/admin/update/:id', Movie.update)
router.post('/admin/movie/new', Movie.new)
router.get('/admin/list', Movie.list)
router.delete('/admin/list', Movie.del)

// User
router.get('/user/signup', User.getSignup)
router.post('/user/signup', User.postsignup)
router.get('/user/signin', User.getsignin)
router.post('/user/signin', User.postsignin)
router.get('/user/logout', User.logout)
router.get('/admin/userlist', User.userlist)

module.exports = router