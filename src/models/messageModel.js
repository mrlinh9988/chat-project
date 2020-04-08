import mongoose, { model, mongo } from "mongoose";

let Schema = mongoose.Schema;

let messageShema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    username: String,
    avatar: String,
  },
  receiver: {
    id: String,
    username: String,
    avatar: String,
  },
  text: String,
  file: { data: Buffer, contentType: String, fileName: String },
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: null },
  deteledAt: { type: Number, default: null },
});

messageShema.statics = {
  /**
   * get message limit one time
   * @param {string} senderId -> currentUserId
   * @param {string} receiverId
   * @param {number} limit
   */
  getMessages(senderId, receiverId, limit) {
    return this.find({
      $or: [
        { $and: [{ senderId }, { receiverId }] },
        { $and: [{ senderId: receiverId }, { receiverId: senderId }] },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(limit)
      .exec();
  },
};

const MESSAGE_CONVERSATION_TYPE = {
  PERSONAL: "persional",
  GROUP: "group",
};

const MESSAGE_TYPE = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
};

module.exports = {
  model: mongoose.model("message", messageShema),
  conversationTypes: MESSAGE_CONVERSATION_TYPE,
  messageTypes: MESSAGE_TYPE,
};








 