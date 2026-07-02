const express = require('express')
const router = express.Router()
const youthControl = require('../controller/youthController')
const { ensureAuth } = require('../middleware/ensureAuth')

router.get('/under18', ensureAuth , youthControl.getYouthUnder18)
router.get('/above18', youthControl.getYouthAbove18)
router.get('/searchUnder', youthControl. searchYouthUnder18)
router.get('/searchAbove', youthControl. searchYouthAbove18)
router.post('/addYouthMember', youthControl.addYouth)
router.delete('/removeYouthUnder18', youthControl.deleteUnder18)
router.delete('/removeYouthAbove18', youthControl.deleteAbove18)

module.exports = router