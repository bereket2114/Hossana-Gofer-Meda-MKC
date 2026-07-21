const express = require('express')
const router = express.Router()
const upload = require("../middleware/multer");
const postController = require('../controller/feedPageController')
const { ensureAuth } = require('../middleware/ensureAuth')


//Set up Admin page and this ensureAuth block the user to not get this route page without signup or login.
//even if the user type this route page by hand(keyboard) , he doesn't get this page.
router.get('/adminPostPage', ensureAuth, postController.getAdminPage)
router.get('/casualPost', ensureAuth , postController.getCasualPage)

// This is my main public feed page route
router.get('/', postController.getPost)


router.post('/post', postController.createPost)
//this middleware help me to upload media file from browser and this "photo" is the name of my input attribute from html file input tag.
router.post('/postCasual', upload.single('photo'), postController.createCasualPost)

router.delete('/remove', postController.removePost)
router.delete('/removeCasual', postController.removeCasual)

router.put('/like', postController.likePost)
router.put('/likeCasual', postController.likeCasual)


module.exports = router
