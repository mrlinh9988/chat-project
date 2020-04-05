import mongoose, { model, mongo } from "mongoose";

let Schema = mongoose.Schema;

let contactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: null },
  deteledAt: { type: Number, default: null },
});

contactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  // Tìm tất cả contact của người dùng hiện tại
  findAllByUser(userId) {
    return this.find({
      $or: [{ userId }, { contactId: userId }],
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
        { $and: [{ userId: contactId }, { contactId: userId }] },
      ],
    }).exec();
  },

  /**
   * Remove request contact sent
   * @param {string} userId
   * @param {string} contactId
   */
  removeRequestContactSent(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId }, { contactId }, { status: false }],
    }).exec();
  },

  /**
   * Remove request contact received
   * @param {string} userId
   * @param {string} contactId
   */
  removeRequestContactReceived(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId: contactId }, { contactId: userId }, { status: false }],
    }).exec();
  },

  /**
   * Remove contact
   * @param {string} userId
   * @param {string} contactId
   */
  removeContact(userId, contactId) {
    return this.deleteOne({
      $or: [
        { $and: [{ userId }, { contactId }, { status: true }] },
        { $and: [{ userId: contactId }, { contactId: userId }, { status: true }] },
      ],
    }).exec();
  },
  /**
   * Approve request contact
   * @param {string} userId
   * @param {string} contactId
   */
  approveRequestContactReceived(userId, contactId) {
    return this.updateOne(
      {
        $and: [{ userId: contactId }, { contactId: userId }, { status: false }],
      },
      { status: true, updatedAt: Date.now() }
    ).exec();
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
        { status: true },
      ],
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
      $and: [{ userId }, { status: false }],
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
      $and: [{ contactId: userId }, { status: false }],
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
        { status: true },
      ],
    });
  },

  /**
   * count all sent contacts by userId
   * @param {string} userId
   */
  countAllSentContacts(userId) {
    return this.countDocuments({
      $and: [{ userId }, { status: false }],
    });
  },

  /**
   * count all received contacts by userId
   * @param {string} userId
   */
  countAllReceivedContacts(userId) {
    return this.countDocuments({
      $and: [{ contactId: userId }, { status: false }],
    });
  },
  /**
   * Read more contact tab Danh bạ
   * @param {String} userId
   * @param {Number} skip
   * @param {Number} limit
   */
  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },
  /**
   * Read more contact sent tab Đang chờ xác nhận, max 10 item one time
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   */
  readMoreContactsSent(userId, skip, limit) {
    return this.find({
      $and: [{ userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  /**
   * Read more contact received tab Yêu cầu kết bạn, max 10 item one time
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   */
  readMoreContactsReceived(userId, skip, limit) {
    return this.find({
      $and: [{ contactId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
};

module.exports = mongoose.model("contact", contactSchema);
