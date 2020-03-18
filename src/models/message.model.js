import mongoose, { model, mongo } from "mongoose";

let Schema = mongoose.Schema;

let messageShema = new Schema({
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
  text: String,
  file: { type: Buffer, contentType: String, fileName: String },
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: null },
  deteledAt: { type: Number, default: null }
});

module.exports = mongoose.model('message', messageShema);  
