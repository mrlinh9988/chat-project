function removeRequestContactReceived() {
  $(".user-remove-request-contact-received")
    .unbind("click")
    .on("click", function () {
      let targetId = $(this).data("uid");

      // chỉ sử dụng được $.get và $.post không có delete và put
      $.ajax({
        url: "/contact/remove-request-contact-received",
        type: "delete",
        data: { uid: targetId },
        success: function (data) {
          if (data.success) {
            /*
              $(".noti_content")
              .find(`div[data-uid = ${user.id}]`)
              .remove(); // xóa thông báo popup

            $("ul.list-notifications")
              .find(`li>div[data-uid = ${user.id}]`)
              .parent()
              .remove(); // xóa thông báo modal

              decreaseNumberNotification("noti_counter", 1); // js/calculateNotification.js
             */

            decreaseNumberNotification("noti_contact_counter", 1); // js/calculateNotification.js

            decreaseNumberNotityContact("count-request-contact-received"); // js/calculateNotifyContact.js

            // Xóa ở modal tab Yêu cầu kết bạn
            $("#request-contact-received")
              .find(`li[data-uid = ${targetId}]`)
              .remove();

            socket.emit("remove-request-contact-received", {
              contactId: targetId,
            });
          }
        },
      });
    });
}

socket.on("respone-remove-request-contact-received", function (user) {
  $("#find-user")
    .find(
      `div.user-remove-request-contact-sent[data-uid = ${user.id}]` // Tìm thẻ div.user-add-new-contact để ẩn đi
    )
    .hide();

  $("#find-user")
    .find(
      `div.user-add-new-contact[data-uid = ${user.id}]` // Tìm thẻ div.user-add-new-contact để ẩn đi
    )
    .css("display", "inline-block");

  // Xóa ở modal tab đang chờ xác nhận
  $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();

  decreaseNumberNotityContact("count-request-contact-sent"); // Yêu cầu kết bạn

  decreaseNumberNotification("noti_contact_counter", 1); // js/calculateNotification.js
});

$(document).ready(function () {
  removeRequestContactReceived(); // js/removeRequestContactsent
});
