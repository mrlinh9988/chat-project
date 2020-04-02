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
  },

  /**
   * get contacts by userId and limit
   * @param {string} userId
   * @param {number} limit
   */
  getContacts(userId, limit) {
    return this.find({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * get sent contacts by userId and limit
   * @param {string} userId
   * @param {number} limit
   */
  getSentContacts(userId, limit) {
    return this.find({
      $and: [{ userId }, { status: false }]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * get received contacts by userId and limit
   * @param {string} userId
   * @param {number} limit
   */
  getReceivedContacts(userId, limit) {
    return this.find({
      $and: [{ contactId: userId }, { status: false }]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },
  /**
   * count all contacts by userId
   * @param {string} userId
   */
  countAllContacts(userId) {
    return this.countDocuments({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true }
      ]
    });
  },

  /**
   * count all sent contacts by userId
   * @param {string} userId
   */
  countAllSentContacts(userId) {
    return this.countDocuments({
      $and: [{ userId }, { status: false }]
    });
  },

  /**
   * count all received contacts by userId
   * @param {string} userId
   */
  countAllReceivedContacts(userId) {
    return this.countDocuments({
      $and: [{ contactId: userId }, { status: false }]
    });
  }
};

module.exports = mongoose.model("contact", contactSchema);
