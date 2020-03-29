import { notification } from "../services/index";

let getHome = async (req, res) => {
  // Only 10 items one time
  let notifications = await notification.getNotifications(req.user._id);
  // get amount notifications not read
  let countNotifUnread = await notification.countNotifUnread(req.user._id);
  console.log(countNotifUnread);

  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications,
    countNotifUnread
  });
};

module.exports = { getHome };
