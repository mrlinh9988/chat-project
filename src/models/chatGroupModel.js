import mongoose, { model, mongo } from "mongoose";

let Schema = mongoose.Schema;

let chatGroupSchema = new Schema({
  name: String,
  userAmount: { type: Number, min: 3, max: 200 },
  messageAmount: { type: Number, default: 0 },
  userId: String,
  members: [{ userId: String }],
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: null },
  deteledAt: { type: Number, default: null },
});

chatGroupSchema.statics = {
  /**
   * get chat-group items by userId and limit
   * @param {string} userId -> currentUserId
   * @param {number} limit
   * duyệt qua tất cả record group-chat
   * check điều kiện userId tryền vào xem có trong mảng members của các record không
   * Nếu có userId trong mảng thì trả về object group-chat thỏa mãn điều kiện
   */
  getChatGroups(userId, limit) {
    return this.find({
      members: { $elemMatch: { userId } },
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  },
};

module.exports = mongoose.model("chat-group", chatGroupSchema);
