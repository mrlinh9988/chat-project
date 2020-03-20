import { validationResult } from "express-validator";
import { auth } from "../services/index";
import { transSuccess } from "../../lang/vi"; 

let getLoginRegister = (req, res) => {
  return res.render('auth/master', {
    errors: req.flash('errors'),
    success: req.flash('success')
  });
}

let postRegister = async (req, res) => {
  /*
    * Hàm validationResult(req).mapped() trả về kết quả là 1 object chứa các property có các value là các object con chứa lỗi

    * Sử dụng Object.values(validationResult(req).mapped()) để lấy tất cả các giá trị của các property lỗi 
    truyền vào 1 mảng errors. 
    * Object.values trả về 1 mảng
  */
  let errorArr = [];
  let successArr = [];
  let validationErrors = validationResult(req);

  // .isEmty() trả về true/false, xem mảng errors có trống hay không,
  // nếu trống tức true là không có lỗi, nếu có phần tử tức là có lỗi
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationResult(req).mapped());

    errors.forEach(element => {
      errorArr.push(element.msg);
    })
    req.flash('errors', errorArr);
    return res.redirect('/login-register');
  }

  try {
    const createUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password);
    successArr.push(createUserSuccess);
    req.flash('success', successArr);
    return res.redirect('/login-register');

  } catch (error) {

    errorArr.push(error);
    req.flash('errors', errorArr);
    return res.redirect('/login-register');
  }
}

module.exports = { getLoginRegister, postRegister };

