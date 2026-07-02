const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../model/userAuth')

module.exports = async function (passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try{
      const user = await User.findOne({ email: email.toLowerCase() })
      if (!user) {
        return done(null, false, { msg: `Email ${email} not found.` })
      }
      if (!user.password) {
        return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' })
      }

  // Wrap password comparison logic
      user.comparePassword(password, (err, isMatch) => {
        if (err) { return done(err) }
        if (isMatch) {
          return done(null, user)
        }
        return done(null, false, { msg: 'Invalid email or password.' })
      })

    } catch (err) {
      return done(err)
    }
    
  }))
  
//serialization doesn't make database calls, but simplify it to pass just the ID
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

//Deserialization makes a database call, so make it ASYNC function because it require internet access
  passport.deserializeUser( async function(id, done){
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }

  })

}