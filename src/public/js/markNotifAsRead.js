function markNotificationsAsRead(targetUsers) {
  $.ajax({
    url: "/notification/mark-all-as-read",
    type: "put",
    data: { targetUsers },
    success: function(result) {
      if (result) {
        console.log('result: ', result);
        targetUsers.forEach(function(uid) {
          // popup notification
          $(".noti_content")
            .find(`div[data-uid = ${uid}]`)
            .removeClass("notif-readed-false");

          // modal notification
          $("ul.list-notifications")
            .find(`li>div[data-uid = ${uid}]`)
            .removeClass("notif-readed-false");
        });

        decreaseNumberNotification("noti_counter", targetUsers.length);
      }
    }
  });
}

$(document).ready(function() {
  // link at popup notifications
  $("#popup-mark-notif-as-read").bind("click", function() {
    let targetUsers = [];

    $(".noti_content")
      .find("div.notif-readed-false")
      .each(function(index, notification) {
        // each là thuộc Jquery, forEach là của JS thuần
        targetUsers.push($(notification).data("uid"));
      });

    if (!targetUsers.length) {
      alertify.notify("Không còn thông báo chưa đọc", "error", 7);
      return false;
    }

    markNotificationsAsRead(targetUsers);
  });

  // link at modal notifications
  $("#modal-mark-notif-as-read").bind("click", function() {
    let targetUsers = [];

    $("ul.list-notifications")
      .find("li>div.notif-readed-false")
      .each(function(index, notification) {
        // each là thuộc Jquery, forEach là của JS thuần
        targetUsers.push($(notification).data("uid"));
      });

    if (!targetUsers.length) {
      alertify.notify("Không còn thông báo chưa đọc", "error", 7);
      return false;
    }

    markNotificationsAsRead(targetUsers);
  });
});
