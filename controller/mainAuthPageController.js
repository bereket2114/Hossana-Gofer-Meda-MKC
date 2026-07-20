const path = require('path')

module.exports = {
    getIndex: (req,res)=>{
        res.sendFile(path.join(__dirname, '..', 'views', 'mainAuth.html'))
    },

    getAdminSignUp: (req,res)=>{
        res.render( 'feedAdminSignup' )
    },
    
    getAdminLogIn: (req,res)=>{
        res.render('feedAdminLogin' )
    },
}