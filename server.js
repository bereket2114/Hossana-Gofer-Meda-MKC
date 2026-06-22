const express = require('express')
const app = express()
const membershipRoute = require('./router/memberRoute')
const mainPageRoute = require('./router/mainRoute')
const connectDB = require('./config/connectDataBase')

require('dotenv').config({path:'./config/.env'})

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/',mainPageRoute )
app.use('/memberList', membershipRoute)

app.listen(process.env.PORT || 3000,()=>{
    console.log(`The server is running on ${process.env.PORT}.`)
})