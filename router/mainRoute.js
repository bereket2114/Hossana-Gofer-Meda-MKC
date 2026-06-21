const express = require('express')
const router = express.Router()
const mainController = require('../controller/mainControl')

router.get('/', mainController.getMain)

module.exports = router