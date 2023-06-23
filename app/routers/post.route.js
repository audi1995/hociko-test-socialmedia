const router = require("express").Router();
const {create, index, show, update, destroy} = require('../controllers/post.controller')
const {verifyWebToken} = require("../middlewares/jwt")

router.post('/:id',verifyWebToken,create)
router.get('/', verifyWebToken,index)
router.get('/:id', verifyWebToken, show)
router.patch('/:id',verifyWebToken, update)
router.delete('/:id', verifyWebToken, destroy)

module.exports = router;