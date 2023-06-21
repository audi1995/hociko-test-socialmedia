module.exports = function (app) {
    app.use('/users', require('./user.route'))
    app.use('/posts', require('./post.route'))
    app.use('/comments', require('./comment.route'))
    app.use('/likes', require('./like.route'))
}