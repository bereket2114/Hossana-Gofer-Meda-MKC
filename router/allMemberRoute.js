const express = require('express')
const router = express.Router()
const memberControl = require('../controller/controlMemberFile')
const { ensureAuth } = require('../middleware/ensureAuth')

router.get('/', ensureAuth ,memberControl.seeMember)
router.get('/search', memberControl.searchAndGetByName)
router.post('/addMember', memberControl.createOne)
//router.put('/updateData', memberControl.changeData)
router.delete('/removeMembers', memberControl.deleteMembers)


module.exports = router