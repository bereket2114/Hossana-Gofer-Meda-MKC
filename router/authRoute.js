const express = require('express')
const router = express.Router()
const memberAuth = require('../controller/controlAuth') 
const homeAuthController = require('../controller/mainAuthPageController') 


//This route is the landing page of all registration and log in page route
router.get('/', homeAuthController.getIndex)
router.get('/adminSignup', homeAuthController.getAdminSignUp)
router.get('/adminLogin', homeAuthController.getAdminLogIn)
//This route is for the FaithHub Admin post page.

//This is the all church member controller authentication page router
router.get('/login', memberAuth.getLogin)
router.post('/login', memberAuth.postLogin)

router.get('/signup', memberAuth.getSignup)
router.post('/signup', memberAuth.postSignup)

router.get('/logout', memberAuth.logout)



module.exports = router