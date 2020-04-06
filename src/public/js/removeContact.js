function removeContact() {
  $(".user-remove-contact")
    .unbind("click")
    .on("click", function () {
      let targetId = $(this).data("uid");
      let username = $(this).parent().find("div.user-name p").text();

      Swal.fire({
        title: `Bạn có chắc chắn muốn hủy kết bạn với ${username}`,
        text: "Bạn không thể hoàn tác hành động này",
        type: "warning",
        icon: "warning",
        showCancelButton: true,
        width: "40rem",
        padding: "2rem",
        confirmButtonColor: "#2ECC71",
        cancelButtonColor: "#ff7675",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
      }).then((result) => {
        // Nếu ấn nút hủy bỏ
        if (!result.value) {
          return false;
        }

        // Nếu ấn nút Đồng ý
        $.ajax({
          url: "/contact/remove-contact",
          type: "delete",
          data: { uid: targetId },
          success: function (data) {
            if (data.success) {
              $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();

              decreaseNumberNotityContact("count-contacts");

              socket.emit("remove-contact", {
                contactId: targetId,
              });
            }
          },
        });
      });
    });
}

socket.on("respone-remove-contact", function (user) {
  decreaseNumberNotityContact("count-contacts");
  $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
});

$(document).ready(function () {
  removeContact(); // js/removeContact.js
});
