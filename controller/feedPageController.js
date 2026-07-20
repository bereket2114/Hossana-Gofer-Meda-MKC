const postDB = require('../model/feedDataBase')
const casualDB = require('../model/bannerDB')
const commentDb = require('../model/commentDB')
const path = require('path')
const cloudinary = require("../middleware/cloudinary");
const sharp = require('sharp')
const streamifier = require('streamifier')

module.exports = {
getAdminPage: async (req,res)=>{
        try{
            res.render('adminFeedPage')
        } catch (err){
            console.log(err)
        }
},

getPost: async (req,res) => {
        try{
// iam using both collections in one get method because i am am sending both data in the same page,
//if i use different get method and pass to the same page i won't work it fails because the fetch works for one db logic in one time for the same page.
//also the same ejs file won't receive the two get file logic and can[t render.
            const post = await postDB.find().sort({ createdAt: "desc" }).lean()
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
                        userId:1,
                        cloudinaryId: 1,
                        completed: 1,
                        commentCount: { $size: "$postComments"}   //Count how many items are in the array
                    }
                }, { $sort: {createdAt : -1} }    // Sort by a new first.
            ])

            res.render( 'feedPage' , { 
                posts: post,
                allPost: casualPost,
                User: req.user
            })
        } catch (err){
            console.error(err)
        }
},

getCasualPage: (req,res)=> {
        try{
            res.render('bannerPost', {User: req.User})
        } catch(err){
            console.error(err)
        }
},

createPost: async (req,res) => {
        try{
            const getIpAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            await postDB.create({
                        Monday: req.body.monday,
                        Tuesday: req.body.tuesday,
                        Wednesday: req.body.wednesday,
                        Thursday: req.body.thursday,
                        Friday: req.body.friday,
                        Saturday: req.body.saturday,
                        Sunday: req.body.sunday,
                        userId: req.user.id,
                        likes: req.body.likePost,
                        createdAt: new Date(),  //This property help us to know  in what time the post is created and give to the user the most recent post created by the users.
                        completed: false,
                        ip_address: getIpAddress
            })
            console.log('G/M MKC just create a week program post')
            res.redirect('/feedPage/')  
        } catch (err){
            console.error(err)
        }    
},

createCasualPost: async (req, res) => {
  console.log(req.file);

  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // 1. Compress the image buffer
    const resizedBuffer = await sharp(req.file.buffer)
      .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // 2. Upload the compressed buffer directly to Cloudinary
    const result = await new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        { folder: 'casual_posts' }, // Optional folder name
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(resizedBuffer).pipe(stream);
    });

    console.log(result);

    // 3. Save to database
    await casualDB.create({
      Title: req.body.title,
      Caption: req.body.caption,
      Likes: req.body.likeCasual || 0,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      userId: req.user.id,
      createdAt: new Date(),
      completed: false,
    });

    res.redirect('/feedPage/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
},

removePost : async (req,res) => {

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
           console.log('delete req received for id:' , req.body.deleteCasual)
           const deletedPost =  await casualDB.findOneAndDelete( { _id: req.body.deleteCasual } )

           if(!deletedPost){
            console.log('No post found with that ID')
            return res.status(404).json({ message: 'Post not found'})
           }
           console.log('Successfully deleted post from database:', deletedPost._id)
           
           if( deletedPost.cloudinaryId ) {
            await cloudinary.uploader.destroy(deletedPost.cloudinaryId)
           }

            res.json('casual post deleted successfully')
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message})
        }
},  

likePost : async (req,res) => {
        try{
            await postDB.findOneAndUpdate({_id: req.body.likePost},{ $inc: {likes: 1}},{ upsert: false })
             //  { $set:{ likes: req.body.likePost + 1 } } // this line replaced by increment property {$inc: {likes: 1 } } this increase the kike by one when hear the like req
                
            console.log('User like your post')
            res.json(`${req.user} like the post`)

            } catch(err){
                console.error(err)
        }
},

likeCasual : async (req,res)=> {
        try{
            await casualDB.findOneAndUpdate({_id: req.body.likeCasual},{ $inc: {Likes: 1}},{ upsert: false })
            console.log('User like your casual post')
            res.json( 'User like your casual post' )
        }catch (err){
            console.error(err)
        }
}
}