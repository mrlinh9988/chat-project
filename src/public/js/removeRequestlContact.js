function removeRequestContact() {
  $(".user-remove-request-contact").bind("click", function() {
    let targetId = $(this).data("uid");

    // chỉ sử dụng được $.get và $.post không có delete và put
    $.ajax({
      url: "/contact/remove-request-contact",
      type: "delete",
      data: { uid: targetId },
      success: function(data) {
        console.log(data);
        if (data.success) {
          $("#find-user")
            .find(
              `div.user-remove-request-contact[data-uid = ${targetId}]` // Tìm thẻ div.user-add-new-contact để ẩn đi
            )
            .hide();
          $("#find-user")
            .find(
              `div.user-add-new-contact[data-uid = ${targetId}]` // Tìm thẻ div.user-add-new-contact để ẩn đi
            )
            .css("display", "inline-block");
        }

        decreaseNumberNotityContact("count-request-contact-sent");
      }
    });
  });
}
