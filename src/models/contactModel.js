import mongoose, { model, mongo } from "mongoose";
import { contact } from "../services";

let Schema = mongoose.Schema;

let contactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: null },
  deteledAt: { type: Number, default: null }
});

contactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  // Tìm tất cả contact của người dùng hiện tại
  findAllByUser(userId) {
    return this.find({
      $or: [{ userId }, { contactId: userId }]
    }).exec();
  },
  /**
   * check contact between 2 user
   * @param {string: } userId
   * @param {string} contactId
   */
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        { $and: [{ userId }, { contactId }] },
        { $and: [{ userId: contactId }, { contactId: userId }] }
      ]
    }).exec();
  },
  /**
   * Remove request contact
   * @param {string} userId
   * @param {string} contactId
   */
  removeRequestContact(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId }, { contactId }]
    }).exec();
  }
};

module.exports = mongoose.model("contact", contactSchema);
