const mongoose = require('mongoose')

const youthSchema = new mongoose.Schema({
    youthFullName:{
        type: String,
        required: true,
    },
    youthBirthDate:{
        type: Date,
        required: true,
    },
    youthGender:{
        type: String,
        required: true,
    },
    youthPhone:{
        type: String,
        required: true,
    },
    completed:{
        type: Boolean,
        required: true,
    }
})

module.exports = mongoose.model('youthDataBase' , youthSchema)