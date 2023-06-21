const router = require("express").Router();
const {create, index, show, update, destroy, login} = require('../controllers/user.controller')
const {verifyWebToken} = require("../middlewares/jwt")

router.post('/',create)
router.get('/', verifyWebToken,index)
router.get('/:id', verifyWebToken, show)
router.patch('/:id',verifyWebToken, update)
router.delete('/:id', verifyWebToken, destroy)
router.post('/login', login)

module.exports = router;