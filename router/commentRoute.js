const express = require('express')
const router = express.Router()
const commentController = require('../controller/commentController')

router.get('/:id', commentController.getComment)

router.post('/createComment/:id', commentController.makeComment)

router.put('/likeComment', commentController.likeComment)

module.exports = router
