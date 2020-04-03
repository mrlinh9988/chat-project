function addContact() {
  $(".user-add-new-contact").bind("click", function() {
    let targetId = $(this).data("uid");

    // ajax method: POST
    $.post("/contact/add-new", { uid: targetId }, function(data) {
      if (data.success) {
        $("#find-user")
          .find(
            `div.user-add-new-contact[data-uid = ${targetId}]` // Tìm thẻ div.user-add-new-contact để ẩn đi
          )
          .hide();
        $("#find-user")
          .find(
            `div.user-remove-request-contact-sent[data-uid = ${targetId}]` // Tìm thẻ div.user-add-new-contact để ẩn đi
          )
          .css("display", "inline-block");

        increaseNumberNotityContact("count-request-contact-sent"); // Thẻ <span class="show-number-contacts count-request-contact-sent">

        let userInfoHtml = $("#find-user")
          .find(`ul li[data-uid = ${targetId}]`)
          .get(0).outerHTML;

        // console.log(userInfoHtml);

        // Thêm ở modal đang chờ xác nhận
        $("#request-contact-sent")
          .find("ul")
          .prepend(userInfoHtml);

        removeRequestContactSent(); // js/removeRequestContactsent

        socket.emit("add-new-contact", { contactId: targetId });
      }
    });
  });
}

socket.on("respone-add-new-contact", function(user) {
  let notify = `<div class="notif-readed-false" data-uid="${user.id}">
                  <img class="avatar-small" src="images/users/${user.avatar}" alt="">
                  <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
  // prepend là đẩy thông báo từ trên xuống dưới (thông báo mới nhất luôn trên cùng), append là đẩy từ dưới lên trên
  $(".noti_content").prepend(notify); // popup notification

  $("ul.list-notifications").prepend(`<li>${notify}</li>`); // modal notification

  increaseNumberNotityContact("count-request-contact-received"); // Yêu cầu kết bạn

  increaseNumberNotification("noti_contact_counter", 1);
  increaseNumberNotification("noti_counter", 1);

  // Thêm ở modal tab yêu cầu kết bạn
  let userInfoHtml = `<li class="_contactList" data-uid="${user.id}">
                        <div class="contactPanel">
                            <div class="user-avatar">
                                <img src="images/users/${user.avatar}" alt="">
                            </div>
                            <div class="user-name">
                                <p>
                                  ${user.username}
                                </p>
                            </div>
                            <br>
                            <div class="user-address">
                                <span>&nbsp ${user.address}</span>
                            </div>
                            <div class="user-acccept-contact-received" data-uid="${user.id}">
                                Chấp nhận
                            </div>
                            <div class="user-reject-request-contact-received action-danger"
                                data-uid="${user.id}">
                                Xóa yêu cầu
                            </div>
                        </div>
                      </li>`;

  $("#request-contact-received")
    .find("ul")
    .prepend(userInfoHtml);
});
