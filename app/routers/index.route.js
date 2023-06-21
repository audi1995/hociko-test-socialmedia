module.exports = function (app) {
    app.use('/users', require('./user.route'))
    app.use('/posts', require('./post.route'))

}