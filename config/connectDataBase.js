const mongoose = require('mongoose')

//I am open a global variable here
let isConnected 

const connectDB  = async()=>{
    if(isConnected){
        console.log('Using existing database connection')
        return;
    }
    try{
        const conn = await mongoose.connect(process.env.DB_String)
//This prevents reconnecting the database on every request
//when we using the app and do some things in that require DB and once we are connecting DB it doesn't require to reconnect again and again every time
        isConnected = conn.connections[0].readyState
        console.log(`MongoDB connected: ${conn.connection.host}`)
    }
    catch(error){
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB