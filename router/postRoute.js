const express = require('express')
const router = express.Router()
const upload = require("../middleware/multer");
const postController = require('../controller/feedPageController')
const { ensureAuth } = require('../middleware/ensureAuth')


//Set up Admin page 
router.get('/adminPostPage', ensureAuth, postController.getAdminPage)

// now i am creating my page route
router.get('/', postController.getPost)
router.get('/casualPost', postController.getCasualPage)

router.post('/post', postController.createPost)
//this middleware help me to upload media file from browser and this "photo" is the name of my input attribute from html file input tag.
router.post('/postCasual', upload.single('photo'), postController.createCasualPost)

router.delete('/remove', postController.removePost)
router.delete('/removeCasual', postController.removeCasual)

router.put('/like', postController.likePost)
router.put('/likeCasual', postController.likeCasual)


module.exports = router
