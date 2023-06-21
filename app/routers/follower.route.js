const router = require("express").Router();
const {create, index, show, update, destroy} = require('../controllers/follower.controller')
const {verifyWebToken} = require("../middlewares/jwt")

router.post('/',verifyWebToken,create)
router.get('/', verifyWebToken,index)
// router.get('/:id', verifyWebToken, show)
router.patch('/:id',verifyWebToken, update)
router.delete('/:id', verifyWebToken, destroy)

module.exports = router;