const path = require('path')

module.exports = {
    getMain: async (req,res)=>{
        console.log('we are sending the main page')
        res.sendFile(path.join(__dirname,'..','view','welcomePage.html'))
    }

}

