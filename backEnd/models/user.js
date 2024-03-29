const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')//验证唯一性

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 1
  },
  name: String,
  passwordHash: {
    type: String,
    minlength: 3
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})
userSchema.plugin(uniqueValidator)
//格式化返回的对象，删除掉没用的信息
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User