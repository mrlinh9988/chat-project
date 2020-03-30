import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";

const LIMIT_NUMBER_TAKEN = 10;

/**
 * Get notifications when f5
 * limit 10 notifications one time
 * @param {string} currentUserId
 */
let getNotifications = async (currentUserId, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notifications = await NotificationModel.model.getByUserAndLimit(
        currentUserId,
        LIMIT_NUMBER_TAKEN
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

/**
 * Readmore notification, max 10 item one time
 * @param {string} currentUserId
 * @param {number} skipNumberNotification
 */
let readMore = (currentUserId, skipNumberNotification) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newNotifications = await NotificationModel.model.readMore(
        currentUserId,
        skipNumberNotification,
        LIMIT_NUMBER_TAKEN
      );

      let getNotifContent = newNotifications.map(async notif => {
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

module.exports = {
  getNotifications,
  countNotifUnread,
  readMore
};
