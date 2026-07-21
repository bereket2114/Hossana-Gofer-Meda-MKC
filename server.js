const express = require('express')
const app = express()
const path = require('path')
const connectDB = require('./config/connectDataBase')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const { MongoStore } = require('connect-mongo')
const flash = require('express-flash')
const logger = require('morgan')
const membershipRoute = require('./router/allMemberRoute')
const mainPageRoute = require('./router/mainRoute')
const youthPageRoute = require('./router/youthRoute')
const registerRoute = require('./router/authRoute')
const postPage = require('./router/postRoute')
const commentRoute = require('./router/commentRoute')

require('dotenv').config({path:'./config/.env'})

// Passport config
require('./config/passport')(passport)



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true, limit: '50mb'})) //I am limiting the image file size that the user should upload.can't take more than 50mb
app.use(express.json({limit: '50mb'})) //now i am using buffer in the controller that means the server takes whatever file size and compress it into small jpeg file.
app.use(logger('dev'))

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60* 60* 24, // session dead after 24 hour and ask new login
        httpOnly: true, //avoid client-side JS messing with cookies
        sameSite: 'lax'  // avoid CSRF issues

      },
      store: MongoStore.create({ mongoUrl: process.env.DB_String }),
    })
  )

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
  

app.use('/',mainPageRoute )
app.use('/register', registerRoute)
app.use('/memberList', membershipRoute)
app.use('/youth', youthPageRoute)
// feed page base router
app.use('/feedPage', postPage)   // i use this ('/feedPage') when i merge this page to mkc web page
app.use('/comment', commentRoute)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.listen(process.env.PORT || 3000,()=>{
    console.log(`The server is running on ${process.env.PORT}.`)
})
