const express = require('express')
const router = express.Router()
const memberAuth = require('../controller/controlAuth') 
const homeAuthController = require('../controller/mainAuthPageController') 
//const youthAuthPage = require('../controller/youthControlAuth')
const { ensureAuth, ensureGuest } = require('../middleware/ensureAuth')

//This route is the landing page of all registration and log in page route
router.get('/', homeAuthController.getIndex)

//This is the all church member controller authentication page router
router.get('/login', memberAuth.getLogin)
router.post('/login', memberAuth.postLogin)

router.get('/signup', memberAuth.getSignup)
router.post('/signup', memberAuth.postSignup)

router.get('/logout', memberAuth.logout)
/*
// This is the youth controller authentication page router
router.get('/youth/login', youthAuthPage.youthGetLogin)
router.post('/youth/login', youthAuthPage.youthPostLogin)
router.get('/youth/logout', youthAuthPage.youthLogout)
router.get('/youth/signup', youthAuthPage.youthGetSignup)
router.post('/youth/signup', youthAuthPage.youthPostSignup)
*/

module.exports = router