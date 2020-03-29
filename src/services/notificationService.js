import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";

/**
 * Get notifications when f5
 * limit 10 notifications one time
 * @param {string} currentUserId
 * @param {number} limit
 */
let getNotifications = async (currentUserId, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notifications = await NotificationModel.model.getByUserAndLimit(
        currentUserId,
        limit
      );
      let getNotifContent = notifications.map(async notif => {
        let sender = await UserModel.findUserById(notif.senderId);
        return NotificationModel.contents.getContent(
          notif.type,
          notif.isRead,
          sender._id,
          sender.username,
          sender.avatar
        );
      });

      resolve(await Promise.all(getNotifContent));
    } catch (error) {
      reject(error);
    }
  });
};
/**
 * Count all notifications unread
 * @param {string} currentUserId
 */
let countNotifUnread = currentUserId => {
  return new Promise(async (resolve, reject) => {
    try {
      let notificationsUnread = await NotificationModel.model.countNotifUnread(
        currentUserId
      );

      resolve(notificationsUnread);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getNotifications,
  countNotifUnread
};
