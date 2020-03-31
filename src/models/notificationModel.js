import mongoose, { model, mongo } from "mongoose";
import { user } from "../services";

let Schema = mongoose.Schema;

let notificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now() }
});

notificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeRequestContactNotification(senderId, receiverId, type) {
    return this.deleteOne({
      $and: [{ senderId }, { receiverId }, { type }]
    });
  },
  /**
   * Get by userId and limit
   * @param {string} userId
   * @param {number} limit
   */
  getByUserAndLimit(userId, limit) {
    return this.find({
      receiverId: userId
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  },
  /**
   *  Count all notifications unread
   * @param {string} userId
   */
  countNotifUnread(userId) {
    return this.countDocuments({
      $and: [{ receiverId: userId }, { isRead: false }]
    });
  },
  /**
   * Read more notification
   * @param {string} userId
   * @param {string} skip
   * @param {string} limit
   */
  readMore(userId, skip, limit) {
    return this.find({
      receiverId: userId
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },
  /**
   * Mark notification as readed
   * @param {string} userId
   * @param {array} targetUsers
   */
  markAllAsRead(userId, targetUsers) {
    return this.updateMany(
      {
        $and: [{ receiverId: userId }, { senderId: { $in: targetUsers } }] // $in nghĩa là phần tử thuộc mảng targetUsers
      },
      { isRead: true }
    );
  }
};

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact"
};

const NOTIFICATION_CONTENT = {
  getContent(notificationType, isRead, userId, username, userAvatar) {
    if (notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
      if (!isRead) {
        return `<div class="notif-readed-false" data-uid="${userId}">
                  <img class="avatar-small" src="images/users/${userAvatar}" alt="">
                  <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
      }
      return `<div data-uid="${userId}">
                <img class="avatar-small" src="images/users/${userAvatar}" alt="">
                <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
              </div>`;
    }
    return "No matching with any notification type";
  }
};

module.exports = {
  model: mongoose.model("notification", notificationSchema),
  type: NOTIFICATION_TYPES,
  contents: NOTIFICATION_CONTENT
};
