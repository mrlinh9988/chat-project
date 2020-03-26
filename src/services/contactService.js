import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import _ from "lodash";

let findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecateUserIds = [];
    let contactByUsers = await ContactModel.findAllByUser(currentUserId);
    contactByUsers.forEach(contact => {
      deprecateUserIds.push(contact.userId);
      deprecateUserIds.push(contact.contactId);
    });

    deprecateUserIds = _.uniqBy(deprecateUserIds);
    let users = await UserModel.findAllForAddContact(deprecateUserIds, keyword);
    // if (!users) {
      
    // }
    resolve(users);
  });
};

module.exports = {
  findUsersContact
};