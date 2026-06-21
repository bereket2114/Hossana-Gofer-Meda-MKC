const mongoose = require('mongoose')

const connectDB  = async()=>{
    try{
        const conn = await mongoose.connect(process.env.DB_String)
        console.log(`The server is connected to the data-base ${conn.connection.host}`)
    }
    catch(error){
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB