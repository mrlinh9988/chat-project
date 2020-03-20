export const transValidation = {
  email_incorrect: 'Email phải có dạng example@gmail.com',
  gender_incorrect: 'Xảy ra lỗi tại trường giới tính',
  password_incorrect: 'Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ thường, chữ hoa, chữ số và ký tự đặc biệt',
  password_confirmation_incorrect: 'Mật khẩu không khớp vui lòng nhập lại'
} 


export const transErrors = {
  account_in_use: 'Tài khoản này đã được sử dụng!',
  account_removed: 'Tài khoản này đã bị xóa khỏi hệ thống. Nếu thông tin này là hiểu nhầm, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi',
  account_not_active: 'Tài khoản đã được đăng ký nhưng chưa được active. Vui lòng kiểm tra email của bạn'
}

export const transSuccess = {
  userCreated(userEmail) {
    return `Tài khoản <strong>${userEmail}<strong> đã được tạo. Vui lòng kiểm tra email của bạn để active tài khoản`;
  }
}
