import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import ChatGroupModel from "../models/chatGroupModel";
import _ from "lodash";

let LIMIT_CONVERSATION_TAKEN = 15;

/**
 * get all conversations
 * @param {string} currentUserId
 */
let getAllConversationItems = async (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(
        currentUserId,
        LIMIT_CONVERSATION_TAKEN
      );

      let userConversationsPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.userId
          );

          getUserContact.createdAt = contact.createdAt; // Vì là cùng kiểu mongoose document nên có thể gán được
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.contactId
          );

          getUserContact.createdAt = contact.createdAt;
          return getUserContact;
        }
      });

      // lấy ra tất cả user có trong list friend của current user
      let userConversations = await Promise.all(userConversationsPromise);

      // Lấy ra tất cả các cuộc trò chuyện với điều kiện có bao gồm currentUserId
      let groupConversations = await ChatGroupModel.getChatGroups(
        currentUserId,
        LIMIT_CONVERSATION_TAKEN
      );

      // gộp chung tất cả user friend và group chat
      let allConversations = userConversations.concat(groupConversations);
      allConversations = _.sortBy(allConversations, (item) => {
        // sắp xếp theo thứ tự từ lớn -> bé tức createdAt mới nhất -> cũ hơn,
        // mặc đinh sortBy (+) là sắp xếp từ thấp đến cao, (-) để sắp xếp từ cao xuống thấp
        return -item.createdAt;
      });

      resolve({
        userConversations,
        groupConversations,
        allConversations,
      });
    } catch (error) {
      console.log("error", error);
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems,
};
