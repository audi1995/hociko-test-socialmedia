const router = require("express").Router();
const {create, index, show, update, destroy} = require('../controllers/like.controller')
const {verifyWebToken} = require("../middlewares/jwt")

router.post('/:post',verifyWebToken,create)
router.get('/:post', verifyWebToken,index)
router.get('/:post/:id', verifyWebToken, show)
router.patch('/:post/:id',verifyWebToken, update)
router.delete('/:post/:id', verifyWebToken, destroy)

module.exports = router;