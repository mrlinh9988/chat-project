import mongoose, { model, mongo } from "mongoose";

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
  }
};

module.exports = mongoose.model("contact", contactSchema);
