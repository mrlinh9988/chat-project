import mongoose, { model, mongo } from "mongoose";

let Schema = mongoose.Schema;

let notificationSchema = new Schema({
  sender: {
    id: String,
    username: String,
    avatar: String
  },
  receiver: {
    id: String,
    username: String,
    avatar: String
  },
  type: String,
  content: String,
  isRead: { type: Boolean, default: false }, 
  createdAt: { type: Number, default: Date.now() }
});

module.exports = mongoose.model('notification', notificationSchema);  
