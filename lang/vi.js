export const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com",
  gender_incorrect: "Xảy ra lỗi tại trường giới tính",
  password_incorrect:
    "Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ thường, chữ hoa, chữ số và ký tự đặc biệt",
  password_confirmation_incorrect: "Mật khẩu không khớp vui lòng nhập lại",
  update_username: "Username chứ 3-17 ký tự và không chứa ký tự đặc biệt",
  update_gender: "Dữ liệu giới tính có vấn đề",
  update_address: "Địa chỉ giới hạn trong khoảng 3-30 ký tự",
  update_phone: "Số điện thoại Việt Nam (+84), 10-11 số"
};

export const transErrors = {
  account_in_use: "Tài khoản này đã được sử dụng!",
  account_removed:
    "Tài khoản này đã bị xóa khỏi hệ thống. Nếu thông tin này là hiểu nhầm, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi",
  account_not_active:
    "Tài khoản đã được đăng ký nhưng chưa được active. Vui lòng kiểm tra email của bạn",
  token_undefined: "Token không tồn tại. Tài khoản này đã được kích hoạt",
  login_failed: "Sai tài khoản hoặc mật khẩu",
  server_error: "Lỗi server. Vui lòng thông báo với quản trị viên",
  avatar_type:
    "Kiểu file không hợp lệ. Chỉ chấp nhận định dạng png, jpg hoặc jpeg",
  avatar_size: "Kích thước ảnh tối đa là 5MB"
};

export const transSuccess = {
  userCreated(userEmail) {
    return `Tài khoản <strong>${userEmail}<strong> đã được tạo. Vui lòng kiểm tra email của bạn để active tài khoản`;
  },
  account_actived:
    "Kích hoạt tài khoản thành công, bạn đã có thể đăng nhập vào ứng dụng",
  loginSuccess(username) {
    return `Chào mừng ${username} đến với ứng dụng Linh Chat`;
  },
  logout_success: "Đăng xuất tài khoản thành công",
  user_info_updated: "Cập nhật thông tin người dùng thành công"
};

export const transMail = {
  subject: "mrLinh: Xác nhận kích hoạt tài khoản",
  template(linkVerify) {
    return `
      <h2>Email này được gửi từ ứng dụng Linh Chat</h2>
      <h3>Vui lòng xác nhận email cho tài khoản cho ứng dụng Linh Chat</h3>
      <a href="${linkVerify}" target="blank">${linkVerify}</a>
    `;
  },
  send_failed: "Có lỗi trong quá trình gửi email"
};

// export
