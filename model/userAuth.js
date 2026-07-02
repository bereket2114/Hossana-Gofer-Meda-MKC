const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userName: { 
        type: String, 
        unique: true 
    },

    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    role:{
      type: String,
      required: true,
      enum: ['general', 'youth'],
      default: 'general',//This automatically add the old data in general role that had not the role or this update(if there is any document added before this role property update idea)
    }
},

//instead of having to manually writing code like user.createdAt = Date.now() every time member registered mongoose handle it behind the scenes.
// This show me when(the time) the user is register along there name and password document.
{
      timestamps: true 
})

// Password hash middleware.
 
 UserSchema.pre('save', async function () {
  const user = this
// only hash the password if it has been modified or new
  if (!user.isModified('password')) { 
    return;
  }

 try{
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)

// Override the plain text password with the hashed one(encrypted one)
      user.password = hash
    } catch (err) {
      throw err;
    }
})


// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch)
  })
}


module.exports = mongoose.models.User || mongoose.model('User', UserSchema)