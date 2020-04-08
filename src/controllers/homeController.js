import { notification, contact, message } from "../services/index";
import { bufferToBase64 } from "../helpers/clientHelper";

let getHome = async (req, res) => {
  // Only 10 items one time
  let notifications = await notification.getNotifications(req.user._id);
  // get amount notifications not read
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  // get contacts 10 record one time
  let contacts = await contact.getContacts(req.user._id);

  // get sent contacts 10 record one time
  let sentContacts = await contact.getSentContacts(req.user._id);

  // get received contacts 10 record one time
  let receivedContacts = await contact.getReceivedContacts(req.user._id);

  // count contacts
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllSentContacts = await contact.countAllSentContacts(req.user._id);
  let countAllReceivedContacts = await contact.countAllReceivedContacts(
    req.user._id
  );

  let getAllConversationItems = await message.getAllConversationItems(
    req.user._id
  );
  let allConversations = getAllConversationItems.allConversations;
  let userConversations = getAllConversationItems.userConversations;
  let groupConversations = getAllConversationItems.groupConversations;

  // all messages in a conversation, max 30 messages
  let allConversationsWithMessage =
    getAllConversationItems.allConversationsWithMessage;
  // console.log("allConversationsWithMessage", allConversationsWithMessage[2].messages)

  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications,
    countNotifUnread,
    contacts,
    sentContacts,
    receivedContacts,
    countAllContacts,
    countAllSentContacts,
    countAllReceivedContacts,
    getAllConversationItems,
    allConversations,
    userConversations,
    groupConversations,
    allConversationsWithMessage,
    bufferToBase64,
  });
};

module.exports = { getHome };
