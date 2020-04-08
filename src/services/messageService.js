import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import ChatGroupModel from "../models/chatGroupModel";
import _ from "lodash";
import MessageModel from "../models/messageModel";

let LIMIT_CONVERSATIONS_TAKEN = 15;
let LIMIT_MESSAGES_TAKEN = 30;

/**
 * get all conversations
 * @param {string} currentUserId
 */
let getAllConversationItems = async (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(
        currentUserId,
        LIMIT_CONVERSATIONS_TAKEN
      );

      let userConversationsPromise = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.userId
          );

          getUserContact.updatedAt = contact.updatedAt; // Vì là cùng kiểu mongoose document nên có thể gán được
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.contactId
          );

          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });

      // lấy ra tất cả user có trong list friend của current user
      let userConversations = await Promise.all(userConversationsPromise);

      // Lấy ra tất cả các cuộc trò chuyện với điều kiện có bao gồm currentUserId
      let groupConversations = await ChatGroupModel.getChatGroups(
        currentUserId,
        LIMIT_CONVERSATIONS_TAKEN
      );

      // lấy ra tất cả các cuộc trò chuyện bao gồm user friend và group chat
      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) => {
        // sắp xếp theo thứ tự từ lớn -> bé tức updatedAt mới nhất -> cũ hơn,
        // mặc đinh sortBy (+) là sắp xếp từ thấp đến cao, (-) để sắp xếp từ cao xuống thấp
        return -item.updatedAt;
      });

      // get messages to render to screen chat
      let allConversationsWithMessagePromise = allConversations.map(
        async (conversation) => {
          let getMessages = await MessageModel.model.getMessages(
            currentUserId,
            conversation._id, // vì người dùng có thể là 1 người dùng khác hoặc cũng có thể là 1 group nên sử dụng conversation._id,
            LIMIT_MESSAGES_TAKEN
          );

          conversation = conversation.toObject(); // conversation là mongoose document khác với object thuần JS
          conversation.messages = getMessages; // Thêm thuộc tính messages
          return conversation;
        }
      );

      let allConversationsWithMessage = await Promise.all(
        allConversationsWithMessagePromise
      );

      // allConversationsWithMessage vì trước đó là promise.all nên có thể thứ tự có thể thay đổi vì kết quả trả về bất đồng bộ
      // nên cần sort lại
      allConversationsWithMessage = _.sortBy(
        allConversationsWithMessage,
        (item) => {
          return -item.updatedAt;
        }
      );

      console.log("getAllConversationItems -> allConversationsWithMessage", allConversationsWithMessage[2].messages)

      resolve({
        userConversations,
        groupConversations,
        allConversations,
        allConversationsWithMessage,
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
