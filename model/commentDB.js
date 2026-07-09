const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    Comment: {
        type: String,
        required: true
    },
    PostId: {
        type: mongoose.Schema.Types.ObjectId, // am not say string or something, b/c this right here is i try to transfer some property form another DB collection, so i use this always when i try to pass some data and put that data inside of some property.
        ref: 'casualPost',  // i put here whatever the banner database collection name is (the bannerPage database collection name is casualPost)
        required: true
    },
    Likes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
//The double quotes make my data base collection name plural, that means i said my collection name is comment but in data-base its comments
// but when i want to what it is like i write use single quotes  for that 'comment' just like that.
module.exports = mongoose.model('comments', commentSchema)