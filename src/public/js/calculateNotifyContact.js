function increaseNumberNotityContact(className) {
  // Tìm thẻ <b>
  // Có thể chuyển từ String -> Number bằng cách thêm "+" trước 1 String
  // Nếu số không tồn tại thì sẽ mặc định là số 0
  let currentValue = +$(`.${className}`)
    .find("b")
    .text();

  currentValue++;

  // Nếu bằng 0 tức là chưa có lời mời kết bạn nào
  if (currentValue === 0) {
    $(`.${className}`).html("");
  } else {
    $(`.${className}`).html(`(<b>${currentValue}</b>)`);
  }
}

function decreaseNumberNotityContact(className) {
  // Tìm thẻ <b>
  // Có thể chuyển từ String -> Number bằng cách thêm "+" trước 1 String
  // Nếu số không tồn tại thì sẽ mặc định là số 0
  let currentValue = +$(`.${className}`)
    .find("b")
    .text();

  currentValue--;

  // Nếu bằng 0 tức là chưa có lời mời kết bạn nào
  if (currentValue === 0) {
    $(`.${className}`).html("");
  } else {
    $(`.${className}`).html(`(<b>${currentValue}</b>)`);
  }
}
