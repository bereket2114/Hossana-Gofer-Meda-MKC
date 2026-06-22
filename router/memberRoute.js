const express = require('express')
const router = express.Router()
const memberControl = require('../controller/controlMemberFile')

router.get('/',memberControl.seeMember)
router.post('/addMember', memberControl.createOne)
//router.put('/updateData', memberControl.changeData)
router.delete('/removeMembers', memberControl.deleteMembers)

module.exports = router