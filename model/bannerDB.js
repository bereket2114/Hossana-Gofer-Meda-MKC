const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
    Caption: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    Likes: {
        type: Number,
    },
    imageUrl: {
        type: String, 
        required: true
    },
    cloudinaryId: { 
        type: String,
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('casualPost', bannerSchema)