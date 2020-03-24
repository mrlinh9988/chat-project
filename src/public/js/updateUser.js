let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};

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
    console.log("change");
    let username = $(this).val();
    // let regexUsername = new RegExp(
    //   "^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$"
    // );

    // if (
    //   !regexUsername.test(username) ||
    //   address.length < 3 ||
    //   address.length > 17
    // ) {
    //   alertify.notify(
    //     "Username chứa 3-17 ký tự và không chứa ký tự đặc biệt",
    //     "error",
    //     7
    //   );
    //   $(this).val(originUserInfo.username);
    //   delete userInfo.username;
    //   return false;
    // }
    userInfo.username = username;
  });

  $("#input-change-gender-male").bind("click", function() {
    let gender = $(this).val();

    // if (gender !== "male") {
    //   alertify.notify("Dữ liệu giới tính có vấn đề", "error", 7);
    //   $(this).val(originUserInfo.gender);
    //   delete userInfo.gender;
    //   return false;
    // }

    userInfo.gender = gender;
  });

  $("#input-change-gender-female").bind("click", function() {
    let gender = $(this).val();

    // if (gender !== "female") {
    //   alertify.notify("Dữ liệu giới tính có vấn đề", "error", 7);
    //   $(this).val(originUserInfo.gender);
    //   delete userInfo.gender;
    //   return false;
    // }

    userInfo.gender = gender;
  });

  $("#input-change-address").bind("change", function() {
    let address = $(this).val();

    // if (address.length < 3 || address.length > 30) {
    //   alertify.notify("Địa chỉ giới hạn trong khoảng 3-30 ký tự", "error", 7);
    //   $(this).val(originUserInfo.address);
    //   delete userInfo.address;
    //   return false;
    // }

    userInfo.address = address;
  });

  $("#input-change-phone").bind("change", function() {
    let phone = $(this).val();
    // let regexPhone = new RegExp("^(0)[0-9]{9,10}$");

    // if (!regexPhone.test(phone)) {
    //   alertify.notify("Số điện thoại Việt Nam (+84), 10-11 số", "error", 7);
    //   $(this).val(originUserInfo.phone);
    //   delete userInfo.phone;
    //   return false;
    // }

    userInfo.phone = phone;
  });
}

// Function ajax avatar
function callAjaxUpdateAvatar() {
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
}

function callAjaxUpdateInfo() {
  $.ajax({
    url: "/user/update-info",
    type: "put",
    data: userInfo,
    success: function(result) {
      console.log("message: ", result.message);
      $(".user-modal-alert-success")
        .find("span")
        .text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      // Update thông tin mới (khi thành công backend send data)
      originUserInfo = Object.assign(originUserInfo, userInfo);

      // Update username at navbar
      $("#navbar-username").text(originUserInfo.username);

      // reset all
      $("#input-btn-cancel-update-user").click();
    },
    error: function(error) {
      console.log(error);

      JSON.parse(error.responseText).forEach(item => {
        // console.log(item);
        alertify.notify(item, "error", 7);
      });

      // $(".user-modal-alert-error")
      //   .find("span")
      //   .text(error.responseText);
      // $(".user-modal-alert-error").css("display", "block");

      // reset all
      $("#input-btn-cancel-update-user").click(); // Tự động click khi có lỗi xảy ra khi uplaod avatar
    }
  });
}

$(document).ready(function() {
  // Lấy đường dẫn src của img thời điểm hiện tại
  originAvatarSrc = $("#user-modal-avatar").attr("src");
  originUserInfo = {
    username: $("#input-change-username").val(),
    gender: $("#input-change-gender-male").is("checked")
      ? $("#input-change-gender-male").val()
      : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val()
  };

  // update user info after change value to update
  updateUserInfo();

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

    if (userAvatar) {
      // call ajax update avatar
      callAjaxUpdateAvatar();
    }

    if (!$.isEmptyObject(userInfo)) {
      // call ajax update user info
      callAjaxUpdateInfo();
    }
  });

  // Khi click vào nút Hủy bỏ thì cho về rỗng hết
  $("#input-btn-cancel-update-user").bind("click", function() {
    userAvatar = null;
    userInfo = {};
    $("#input-change-avatar").val(null);
    // Khi click vào nút Hủy bỏ sẽ cho src của img về giá trị trước đó
    originAvatarSrc = $("#user-modal-avatar").attr("src", originAvatarSrc);

    $("#input-change-username").val(originUserInfo.username);
    originUserInfo.gender === "male"
      ? $("#input-change-gender-male").click()
      : $("#input-change-gender-female").click();
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);
  });
});
