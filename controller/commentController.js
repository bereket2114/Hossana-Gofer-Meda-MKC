const mongoose = require('mongoose')
const commentDb = require('../model/commentDB')
const path = require('path')

module.exports = {
    getComment: async (req,res) => {
        try{
    // Get the post id from the url parameters
            const currentPostId = req.params.id
            const Comment = await commentDb.find({PostId: currentPostId }).sort({createdAt: "desc"}).lean()
            res.render(path.join(__dirname, '..', 'view', 'commentPage.ejs'), { 
                Comments: Comment,
                postIds: currentPostId,
             })
        } catch (err){
            console.error(err)
        }
    },

    makeComment: async (req,res) => {
        try{
            const currentPostId = req.params.id
            await commentDb.create({
                        Comment: req.body.comment,
                        PostId: new mongoose.Types.ObjectId(currentPostId),
                        Likes: req.body.likeComment,
            })
            console.log(req.body, req.ip)
            console.log('member post a comment')
            res.redirect('/comment/' + currentPostId)  // this redirect me to the comment main page and to the specific exact post comment
        } catch (err){
            console.error(err)
        }    
    },

    likeComment: async (req,res) => {
        try{
            console.log(req.body.likeComment)
         const updateDoc=   await commentDb.findOneAndUpdate({_id: req.body.likeComment},{ $inc: { Likes: 1 }},{ new: true, runValidators:true, upsert: false })
             //  { $set:{ likes: req.body.likePost + 1 } } // this line replaced by increment property {$inc: {likes: 1 } } this increase the kike by one when hear the like req
                console.log(updateDoc)
            
            if(!updateDoc){
                console.log('No document matched that ID.')
                return res.status(404).json({ error: 'comment not found.'})
            } 
            console.log('User like your comment')
            res.json({ message:'Member likes your comment' })

            } catch(err){
                console.error(err)
        }
    }  
}