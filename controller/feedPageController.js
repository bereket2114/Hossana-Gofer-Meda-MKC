const postDB = require('../model/feedDataBase')
const casualDB = require('../model/bannerDB')
const commentDb = require('../model/commentDB')
const path = require('path')
const cloudinary = require("../middleware/cloudinary");

module.exports = {
    getPost: async (req,res) => {
        try{
// iam using both collections in one get method because i am am sending both data in the same page,
//if i use different get method and pass to the same page i won't work it fails because the fetch works for one db logic in one time for the same page.
//also the same ejs file won't receive the two get file logic and can[t render.

            const post = await await postDB.find().sort({createdAt: "desc"}).lean()
            const casualPost = await casualDB.aggregate([
                {
                    $lookup:{
                        from: "comments",   //The name of my comment collection in mongoDb.
                        localField: "_id",
                        foreignField: "PostId",   //The field must match my schema or property on commentDB schema.
                        as: "postComments"      //Temporary array name for the joined comments
                    }
                }, {
                    $project: {
                    //keep my original schema properties here
                        Title: 1, 
                        Caption: 1,
                        imageUrl: 1,
                        Likes: 1,
                        createdAt: 1,
                        cloudinaryId: 1,
                        completed: 1,
                        commentCount: { $size: "$postComments"}   //Count how many items are in the array
                    }
                }, { $sort: {createdAt : -1} }    // Sort by a new first.
            ])
            res.render(path.join(__dirname, '..', 'view', 'feedPage.ejs'), { 
                posts: post,
                allPost: casualPost,
            })
        } catch (err){
            console.error(err)
        }
    },

    getCasualPage: (req,res)=> {
        try{
            res.render(path.join(__dirname, '..', 'view', 'bannerPost.ejs'))
        } catch(err){
            console.error(err)
        }
    },

    createPost: async (req,res) => {
        try{
            await postDB.create({
                        Monday: req.body.monday,
                        Tuesday: req.body.tuesday,
                        Wednesday: req.body.wednesday,
                        Thursday: req.body.thursday,
                        Friday: req.body.friday,
                        Saturday: req.body.saturday,
                        Sunday: req.body.sunday,
                        likes: req.body.likePost,
                        createdAt: new Date(),  //This property help us to know  in what time the post is created and give to the user the most recent post created by the users.
                        completed: false
            })
            console.log(req.body, req.ip)
            console.log('G/M MKC just create a week program post')
            res.redirect('/feedPage/')  
        } catch (err){
            console.error(err)
        }    
    },

    createCasualPost: async (req,res) => {
        try{
            console.log(req.body)
            if (!req.file) {
                return res.status(400).send('No file uploaded.');
            }
        // Upload image to cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            await casualDB.create({
                Title: req.body.title,
                Caption: req.body.caption,
                Likes: req.body.likeCasual,  // this name is not from input name this came from client JS json body for this like logic increment.
//This is my uploaded img exact address where it could be found, so i store that url in my DB to simply access and return to browser to display.
                imageUrl: result.secure_url,
//This id is the cloudinary id for every uploaded img and i want this because i called it when i need to delete the image from cloudinary specific img with image id.  
                cloudinaryId: result.public_id, 
                createdAt: new Date(),
                completed: false
            })
            console.log(req.body, req.ip)
            console.log('MKC added general post.')
            res.redirect('/feedPage/')
        } catch (err){
            console.error(err)
        }
    },

   removePost: async (req,res) => {
        try{
            await postDB.findOneAndDelete({_id: req.body.deletePost})
            console.log('POST is removed from database')
            res.json('Post deleted successfully')
        } catch (err){
            console.error(err)
        }
    },

    removeCasual: async (req,res) => {
        try{
            await casualDB.findOneAndDelete({_id: req.body.deleteCasual})
            res.json('casual post deleted successfully')
        } catch (err) {
            console.error(err)
        }
    },

    likePost: async (req,res) => {
        try{
            await postDB.findOneAndUpdate({_id: req.body.likePost},{ $inc: {likes: 1}},{ upsert: false })
             //  { $set:{ likes: req.body.likePost + 1 } } // this line replaced by increment property {$inc: {likes: 1 } } this increase the kike by one when hear the like req
                
            console.log('User like your post')
            res.json(`${req.user} like the post`)

            } catch(err){
                console.error(err)
        }
    },

    likeCasual: async (req,res)=> {
        try{
            await casualDB.findOneAndUpdate({_id: req.body.likeCasual},{ $inc: {Likes: 1}},{ upsert: false })
            console.log('User like your casual post')
            res.json( 'User like your casual post' )
        }catch (err){
            console.error(err)
        }
    }
}