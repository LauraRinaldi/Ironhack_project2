const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
      email: String,
      password: String,
      fullName: String,
      isOwner: {
        type: Boolean,
        default: false
    }
    },
    {
      timestamps: true
    }
  );

module.exports = model('User', userSchema);