const express= require('express');
const router = express.Router()
const checkToken = require('../middleware/checkToken')
const {
    signup, signin, signout, isAuth
} = require('../controllers/authController')

router.post('/user/register', signup);
router.post('/user/login', signin);
router.get('/user/is-auth', checkToken, isAuth);
router.post('/user/logout', signout)

module.exports = router;