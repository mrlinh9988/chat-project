import ContactModel from "../models/contactModel";
import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";
import _ from "lodash";
// import { remove } from "fs-extra";

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

module.exports = {
  findUsersContact,
  addNew,
  removeRequestContact
};
