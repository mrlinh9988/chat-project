let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;

function updateUserInfo() {
  $("#input-change-avatar").bind("change", function() {
    let fileData = $(this).prop("files")[0];
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 5 * 1048576; // 1048576 byte = 1MB

    // Kiểm tra file ảnh có đúng định dạng png, jpg, jpeg không
    // Nếu không đúng định dạng ảnh
    if ($.inArray(fileData.type, math) === -1) {
      alertify.notify(
        "Kiểu file không hợp lệ. Chỉ chấp nhận định dạng png, jpg hoặc jpeg",
        "error",
        7
      );
      // Cho giá trị của thẻ input bằng null
      $(this).val(null);
      return false;
    }

    if (fileData.size > limit) {
      alertify.notify("Kích thước ảnh tối đa là 5MB", "error", 7);
      $(this).val(null);
      return false;
    }

    if (typeof FileReader != "undefined") {
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty();

      let fileReader = new FileReader();
      fileReader.onload = function(element) {
        $("<img>", {
          src: element.target.result,
          class: "avatar img-circle",
          id: "user-modal-avatar",
          alt: "avatar"
        }).appendTo(imagePreview); // append ảnh mới được upload vào khung ảnh
      };
      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formData = new FormData();
      formData.append("avatar", fileData); // input name="avatar" (thẻ input chọn file)

      userAvatar = formData;
    } else {
      alertify.notify(
        "Trình duyệt của bạn không hỗ trợ FileReader",
        "error",
        7
      );
    }
  });

  $("#input-change-username").bind("change", function() {
    userInfo.username = $(this).val();
  });

  $("#input-change-gender-male").bind("click", function() {
    userInfo.gender = $(this).val();
  });

  $("#input-change-gender-female").bind("click", function() {
    userInfo.gender = $(this).val();
  });

  $("#input-change-address").bind("change", function() {
    userInfo.address = $(this).val();
  });

  $("#input-change-phone").bind("change", function() {
    userInfo.phone = $(this).val();
  });
}

$(document).ready(function() {
  updateUserInfo();

  // Lấy đường dẫn src của img thời điểm hiện tại
  originAvatarSrc = $("#user-modal-avatar").attr("src");

  // Khi click vào nút lưu lại
  $("#input-btn-update-user").bind("click", function() {
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify(
        "Vui lòng nhập thông tin cần thay đối trước khi lưu",
        "error",
        7
      );
      return false;
    }

    $.ajax({
      url: "/user/update-avatar",
      type: "put",
      cache: false,
      contentType: false,
      processData: false,
      data: userAvatar,
      success: function(result) {
        $(".user-modal-alert-success")
          .find("span")
          .text(result.message);
        $(".user-modal-alert-success").css("display", "block");

        // Update varbar avatar
        $("#navbar-avatar").attr("src", result.image);

        // update origin avatar
        originAvatarSrc = result.image;

        // reset all
        $("#input-btn-cancel-update-user").click();
      },
      error: function(error) {
        console.log(error);
        $(".user-modal-alert-error")
          .find("span")
          .text(error.responseText);
        $(".user-modal-alert-error").css("display", "block");

        // reset all
        $("#input-btn-cancel-update-user").click(); // Tự động click khi có lỗi xảy ra khi uplaod avatar
      }
    });

    // console.log(userAvatar);
    // console.log(userInfo);
  });

  // Khi click vào nút Hủy bỏ thì cho về rỗng hết
  $("#input-btn-cancel-update-user").bind("click", function() {
    userAvatar = null;
    userInfo = {};
    $('#input-change-avatar').val(null);
    // Khi click vào nút Hủy bỏ sẽ cho src của img về giá trị trước đó
    originAvatarSrc = $("#user-modal-avatar").attr("src", originAvatarSrc);
  });
});
