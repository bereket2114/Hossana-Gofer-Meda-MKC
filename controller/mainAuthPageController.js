const path = require('path')

module.exports = {
    getIndex: (req,res)=>{
        res.render( 'mainAuth')
    },

    getAdminSignUp: (req,res)=>{
        res.render( 'feedAdminSignup' )
    },
    
    getAdminLogIn: (req,res)=>{
        res.render('feedAdminLogin' )
    },
}