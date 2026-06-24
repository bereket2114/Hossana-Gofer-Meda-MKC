const express = require('express')
const router = express.Router()
const youthControl = require('../controller/youthController')

router.get('/', youthControl.getYouthDashboard)
router.get('/search', youthControl.searchYouth)
router.post('/addYouthMember', youthControl.addYouth)
router.delete('/removeYouth', youthControl.deleteOne)

module.exports = router