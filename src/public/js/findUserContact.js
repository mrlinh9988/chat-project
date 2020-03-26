function callFindUser(element) {
  // Sự kiện ấn phím Enter hoặc click vào button Tìm kiếm
  if (element.which === 13 || element.type === "click") {
    let keyword = $("#input-find-user-contact").val();
    let regexKeyword = new RegExp(
      /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    );

    if (!keyword.length) {
      alertify.notify("Vui lòng nhập nội dung tìm kiếm", "error", 7);
      return false;
    }

    if (!regexKeyword.test(keyword)) {
      alertify.notify(
        "Từ khóa không hợp lệ. Chỉ cho phép chữ cái, số và khoảng trắng",
        "error",
        7
      );
      return false;
    }

    // Gửi ajax /contact/find-users/${keyword} - method : GET
    $.get(`/contact/find-users/${keyword}`, function(data) {
      console.log(data);
      $("#find-user ul").html(data);
    });
  }
}

$(document).ready(function() {
  $("#input-find-user-contact").bind("keypress", callFindUser);
  $("#btn-find-user-contact").bind("click", callFindUser);
});
