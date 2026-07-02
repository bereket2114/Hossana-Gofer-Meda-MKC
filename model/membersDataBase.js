const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    memFullName:{
        type: String,
        required: true,
    },
    memBirthDate:{
        type: Date,
        required: true,
    },
    memSex:{
        type: String,
        required: true,
    },
    memPhone:{
        type: String,
        required: true,
    },
    memSector:{
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true
    },
    completed:{
        type: Boolean,
        required: true,
    }
})

module.exports = mongoose.model('allMember', memberSchema)