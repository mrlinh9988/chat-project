import mongoose, { model, mongo } from "mongoose";
import bcrypt from "bcrypt";
import passport from "passport";

let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: null },
  deteledAt: { type: Number, default: null }
});

userSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },
  removeById(userId) {
    return this.findByIdAndRemove(userId).exec();
  },
  findByToken(token) {
    return this.findOne({
      'local.verifyToken': token
    }).exec();
  },
  verify(token) {
    return this.findOneAndUpdate(
      { "local.verifyToken": token },
      { "local.isActive": true, "local.verifyToken": null }
    ).exec();
  },
  findUserById(userId) {
    return this.findById({ _id: userId }).exec();
  }, 
  findByFacebookId(uid) {
    return this.findOne({ 'facebook.uid': uid }).exec();
  },
  findByGoogleId(uid) {
    return this.findOne({ 'google.uid': uid }).exec();
  },
  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec();
  }
};

userSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  }
}

module.exports = mongoose.model("user", userSchema);
