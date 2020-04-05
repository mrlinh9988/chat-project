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
      "local.verifyToken": token
    }).exec();
  },
  verify(token) {
    return this.findOneAndUpdate(
      { "local.verifyToken": token },
      { "local.isActive": true, "local.verifyToken": null }
    ).exec();
  },
  findUserById(userId) {
    return this.findById(userId).exec();
  },
  findByFacebookId(uid) {
    return this.findOne({ "facebook.uid": uid }).exec();
  },
  findByGoogleId(uid) {
    return this.findOne({ "google.uid": uid }).exec();
  },
  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec();
  },
  updatePassword(id, hashedPassword) {
    return this.findByIdAndUpdate(id, {
      "local.password": hashedPassword
    }).exec();
  },
  /**
   * find all users to add contact
   * @param {array: deprecated userId} deprecateUserIds
   * @param {string: keyword search} keyword
   */
  findAllForAddContact(deprecateUserIds, keyword) {
    return this.find(
      {
        $and: [
          { _id: { $nin: deprecateUserIds } }, // những id không nằm trong deprecateUserIds
          { "local.isActive": true },
          {
            $or: [
              { username: { $regex: new RegExp(keyword, "i") } }, // gần giống với keyword, không cần giống 100%
              { "local.email": { $regex: new RegExp(keyword, "i") } },
              { "facebook.email": { $regex: new RegExp(keyword, "i") } },
              { "google.email": { $regex: new RegExp(keyword, "i") } }
            ]
          }
        ]
      },
      { _id: 1, username: 1, address: 1, avatar: 1 } // chỉ lấy ra những trường muốn lấy
    ).exec();
  },
  getNormalUserDataById(userId) {
    return this.findById(userId, {
      _id: 1,
      username: 1,
      address: 1,
      avatar: 1,
    }); // chỉ lấy ra những trường muốn lấy)
  }
};

userSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  }
};

module.exports = mongoose.model("user", userSchema);
