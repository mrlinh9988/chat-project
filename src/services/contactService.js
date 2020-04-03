import ContactModel from "../models/contactModel";
import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";
import _ from "lodash";
// import { remove } from "fs-extra";

const LIMIT_NUMBER_TAKEN = 10;

let findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecateUserIds = [currentUserId];
    let contactByUsers = await ContactModel.findAllByUser(currentUserId);
    contactByUsers.forEach(contact => {
      deprecateUserIds.push(contact.userId);
      deprecateUserIds.push(contact.contactId);
    });

    deprecateUserIds = _.uniqBy(deprecateUserIds);
    let users = await UserModel.findAllForAddContact(deprecateUserIds, keyword);

    resolve(users);
  });
};

let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExist = await ContactModel.checkExists(currentUserId, contactId);

    if (contactExist) {
      return reject(false);
    }
    // create contact
    let newContactItem = {
      userId: currentUserId,
      contactId
    };
    let newContact = await ContactModel.createNew(newContactItem);

    // create notification
    let nofiticationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.type.ADD_CONTACT
    };
    await NotificationModel.model.createNew(nofiticationItem);

    resolve(newContact);
  });
};

let removeRequestContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContact(
      currentUserId,
      contactId
    );

    console.log(removeReq);
    if (removeReq.n === 0) {
      return reject(false);
    }

    // remove notification
    await NotificationModel.model.removeRequestContactNotification(
      currentUserId,
      contactId,
      NotificationModel.type.ADD_CONTACT
    );

    resolve(true);
  });
};

let getContacts = currentUserId => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(
        currentUserId,
        LIMIT_NUMBER_TAKEN
      );

      let users = contacts.map(async contact => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      });

      resolve(await Promise.all(users));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let getSentContacts = currentUserId => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getSentContacts(
        currentUserId,
        LIMIT_NUMBER_TAKEN
      );

      let users = contacts.map(async contact => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let countAllContacts = currentUserId => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContacts(currentUserId);
      resolve(count);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let countAllSentContacts = currentUserId => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllSentContacts(currentUserId);
      resolve(count);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let countAllReceivedContacts = currentUserId => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllReceivedContacts(currentUserId);
      resolve(count);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

let getReceivedContacts = currentUserId => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getReceivedContacts(
        currentUserId,
        LIMIT_NUMBER_TAKEN
      );

      let users = contacts.map(async contact => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

/**
 * Read more contact tab Danh bạ
 * @param {String} currentUserId
 * @param {Number} skipNumberContact
 */
let readMoreContacts = (currentUserId, skipNumberContact) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContacts(
        currentUserId,
        skipNumberContact,
        LIMIT_NUMBER_TAKEN
      );

      let users = newContacts.map(async contact => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};
/**
 * Read more contact sent tab Đang chờ xác nhận, max 10 item one time
 * @param {string} currentUserId
 * @param {number} skipNumberContact
 */
let readMoreContactsSent = (currentUserId, skipNumberContact) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContactsSent(
        currentUserId,
        skipNumberContact,
        LIMIT_NUMBER_TAKEN
      );

      let users = newContacts.map(async contact => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Read more contact received tab Yêu cầu kết bạn, max 10 item one time
 * @param {string} currentUserId
 * @param {number} skipNumberContact
 */
let readMoreContactsReceived = (currentUserId, skipNumberContact) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContactsReceived(
        currentUserId,
        skipNumberContact,
        LIMIT_NUMBER_TAKEN
      );

      let users = newContacts.map(async contact => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  findUsersContact,
  addNew,
  removeRequestContact,
  getContacts,
  getSentContacts,
  getReceivedContacts,
  countAllContacts,
  countAllSentContacts,
  countAllReceivedContacts,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived
};
