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
            `div.user-remove-request-contact[data-uid = ${targetId}]` // Tìm thẻ div.user-add-new-contact để ẩn đi
          )
          .css("display", "inline-block");

        increaseNumberNotityContact("count-request-contact-sent"); // Thẻ <span class="show-number-contacts count-request-contact-sent">
        socket.emit("add-new-contact", { contactId: targetId });
      }
    });
  });
}
