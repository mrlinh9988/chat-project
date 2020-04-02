import { notification, contact } from "../services/index";

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
  let countAllReceivedContacts = await contact.countAllReceivedContacts(req.user._id);

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
    countAllReceivedContacts
  });
};

module.exports = { getHome };
