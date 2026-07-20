const passport = require('passport')
const validator = require('validator')
const User = require('../model/userAuth')
const path = require('path')


module.exports = {

getLogin :(req, res) => {
// If the user is already logged in redirect him to the next page (skip the login form, but this will work for one hour then the session expired and ask log in again.)
    if (req.user) {
      if (req.user.role === 'youth') {
        return res.redirect('/youth/under18')
      } else if(req.user.role === 'general') {
        return res.redirect('/memberList/')
      } else if(req.user.role === 'admin'){
        return res.redirect('/feedPage/adminPostPage')
      }
    }
// If the user is new or come after one hour latter send the login page and log in again
    res.render( 'login' , {
        actionUrl: '/register/login',
        title: 'Member Login'
    })
  },

//This route is happening after sending the login page and  during in the middle of login process and click login button.
// Or if there something wrong with login process send those message to the user.
postLogin : (req, res, next) => {
    const validationErrors = []  
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      return res.redirect('/register/login')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

    passport.authenticate('local', (err, user, info) => {
      if (err) { 
        return next(err)
      }
      if (!user) {  // if the user is not there or logged out redirect him to the login page
        req.flash('errors', info)
        return res.redirect('/register/login')
      }
      console.log('the authenticated user is:', user)

//Else if this role is exist and the user was registered for this page redirect him to the next page
      req.logIn(user, (err) => {
        if (err) { 
          return next(err) 
        }
// Now 'user' exists! check the role here if this kind of role is exist in the user DB collection send him back
     if(user.role === 'youth'){
        req.flash('success', { msg: 'Success! You are logged in.' })
        return res.redirect('/youth/under18')
      } else if(user.role === 'general'){
        req.flash('success', { msg: 'Success! You are logged in.' })
        return res.redirect('/memberList/')
      }else if(user.role === 'admin'){
        req.flash('success', { msg: 'Success! You are logged in.' })
        return res.redirect('/feedPage/adminPostPage')
      }
      else {
        req.flash('error', {msg: 'This account role is not recognized'})
        return res.redirect('/register/login')
      }
  // else the user is logged in redirect him to the next page.
      //  req.flash('success', { msg: 'Success! You are logged in.' })
      //  res.redirect(/* req.session.returnTo || */ '/memberList/')
      })
    })(req, res, next) 

  },
  
// If the user ask a log out req redirect him to the register main page and destroy his session and cookies.
logout: (req, res, next) => {
// 1. Check user role BEFORE logging out / destroying session
    const userRole = req.user ? req.user.role : null;

// 2. Log out the user from Passport
    req.logout(function (err) {
        if (err) { return next(err); }
        console.log('User has logged out.');

        // 3. Destroy session
        req.session.destroy((err) => {
            if (err) {
                console.log('Error : Failed to destroy the session during logout.', err);
            }

      // 4. Clear cookie
            res.clearCookie('connect.sid');

      // 5. Redirect based on role saved before session destruction
            if (userRole === 'admin') {
                return res.redirect('/register/adminLogin'); // Adjust route path if needed
            } else {
                return res.redirect('/register/login');
            }
        });
    });
},

getSignup : (req, res) => {
// If already logged in, send them to their correct dashboard instead of the signup page
  if (req.user) {
    if (req.user.role === 'youth') {
      return res.redirect('/youth/under18');
    } else if(req.user.role === 'general') {
      return res.redirect('/memberList/');
    } else if(req.user.role === 'admin') {
      return res.redirect('/feedPage/adminPostPage')
    }
  }
//If the user new and ask to register send to him a register page
  res.render( 'register' , {
    actionUrl: '/register/signup',
    title: 'Create Account'
  });
},
 
//This route is happening during in the middle of register or after click the register button. if there is any error or mistake send those messages
postSignup : async (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
  
    if (validationErrors.length) {
        req.flash('errors', validationErrors)
//This redirect the user to the page where he was from(if he was in the admin registration form this redirect him to that page).
//(if its not redirect him to member registration form)
        if( req.path.includes('admin') || req.body.role === 'admin' ){
          return res.redirect('/register/adminSignup')
        } {
          return res.redirect('/register/signup') // redirect to the sign up page
        }
        
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })

  try{
    req.body.email = validator.normalizeEmail(req.body.email, {gmail_remove_dot: false})
    const email = req.body.email.toLowerCase().trim()
    const username = req.body.userName.trim()

    const role = req.body.role
    const adminCount = await User.countDocuments({ role: 'admin' })
    const generalCount = await User.countDocuments({ role : 'general' })
    const youthCount = await User.countDocuments({ role: 'youth' })
    const adminAmount = parseInt( process.env.Max_AdminUser,10) || 1
    const youthAmount = parseInt( process.env.Max_YouthUser,10) || 1
    const generalAmount = parseInt( process.env.Max_GeneralUser,10) || 1

// Check if the user is already Exist or not
    const existingUser = await User.findOne({
      $or: [
        {email: email},
        {userName: username}
      ]
    })

    if (existingUser) {
        req.flash('errors', { msg: 'Account with that email address or username already exists.' })

        if( req.path.includes('admin') || req.body.role === 'admin' ){
          return res.redirect('/register/adminSignup')
        } {
          return res.redirect('/register/signup')
        }
        
    }

    
//Enforce user limit and by doing this i control the login user in my web app
    if( role === 'general' && generalCount >= generalAmount ){
          req.flash('errors', { msg: 'Registration closed: Maximum General users reached' } )
          return res.redirect('/register/signup')    
    }
    if( role === 'youth' && youthCount >= youthAmount ){
          req.flash('errors', { msg: 'Registration closed: Maximum Youth users reached' } )
          return res.redirect('/register/signup')    
    }
    
    if( role === 'admin' && adminCount >= adminAmount ){
          req.flash('errors', { msg: 'Registration closed: Maximum Admin users reached' } )
          return res.redirect('/register/adminSignup')
    }
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role //since we are using the same DB,tag this name to tell the DB to give you the general church member authenticated user only
    })
// use await to save the user
    await user.save()

  // log the user in via passport after successful registration
        req.logIn(user, (err) => {
          if (err) {
            return next(err)
          }
          if (user.role === 'youth'){
            return res.redirect('/youth/under18')
          } else if( user.role === 'general'){
            return res.redirect('/memberList/')
          }else if( user.role === 'admin'){
            return res.redirect('/feedPage/adminPostPage')
          }
        })
  } catch(err){    // This catch any data-base connection errors
    return next(err)
  }
}
kcknkcnsakvnksv
}