const mongoose = require("mongoose");
const crypto = require('crypto');
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const UserSchema = new Schema(
  {
    id: Number,
    username: String,
    hash: String,
    salt: String
  },
  { timestamps: true }
);

UserSchema.statics.validPassword = (password, salt, hash) => {    
    return hash === crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`); 
}

UserSchema.statics.setPassword = (password) => { 
  this.salt = crypto.randomBytes(16).toString('hex'); 
  this.hash = crypto.pbkdf2Sync(password, this.salt,  
  1000, 64, `sha512`).toString(`hex`);
  return { salt: this.salt, hash: this.hash };
};

module.exports = mongoose.model("users", UserSchema);