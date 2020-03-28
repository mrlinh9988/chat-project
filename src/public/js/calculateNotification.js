function increaseNumberNotification(className) {
  let currentValue = +$(`.${className}`).text();

  currentValue++;

  // Nếu bằng 0 tức là chưa có lời mời kết bạn nào
  if (currentValue === 0) {
    $(`.${className}`)
      .css("display", "none")
      .html("");
  } else {
    $(`.${className}`)
      .css("display", "block")
      .html(currentValue);
  }
}

function decreaseNumberNotification(className) {
  // Tìm thẻ <b>
  // Có thể chuyển từ String -> Number bằng cách thêm "+" trước 1 String
  // Nếu số không tồn tại thì sẽ mặc định là số 0
  let currentValue = +$(`.${className}`).text();

  currentValue--;

  // Nếu bằng 0 tức là chưa có lời mời kết bạn nào
  if (currentValue === 0) {
    $(`.${className}`)
      .css("display", "none")
      .html("");
  } else {
    $(`.${className}`)
      .css("display", "block")
      .html(currentValue);
  }
}
