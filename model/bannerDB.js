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
    },
    ip_address:{
        type: Buffer // maps directly to mongoDb BinData
    } } , { timestamps: true })
// Before a post is removed, delete all comments linked to it
    bannerSchema.pre('findOneAndDelete', async function () {
        try{
//get the id of the post being deleted directly from the query filter.
            const postsIdWithComments = this.getQuery()._id;
            if (postsIdWithComments) {
            // Delete all comments that reference this post's ID
                await mongoose.model('comments').deleteMany({ PostId: postsIdWithComments });
            }
        }catch (err){
            console.error(err)
        }
    })


module.exports = mongoose.model('casualPost', bannerSchema)