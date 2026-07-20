const mongoose = require('mongoose')

const feedSchema = new mongoose.Schema({
        Monday:{
        type: String,
        required: false
    },
    Tuesday:{
        type: String,
        required: false
    },
    Wednesday:{
        type: String,
        required: false
    },
    Thursday:{
        type: String,
        required: false
    },
    Friday:{
        type: String,
        required: false
    },
    Saturday:{
        type: String,
        required: false
    },
    Sunday:{
        type: String,
        required: false
    },
    likes:{
        type: Number,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    completed:{
        type: Boolean,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    ip_address:{
        type: Buffer // maps directly to mongoDb BinData
    }
    

})

module.exports = mongoose.model('Post', feedSchema)