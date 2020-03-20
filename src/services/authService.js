import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { transErrors, transSuccess, transMail } from "../../lang/vi";
import sendMaiil from "../config/mailer";

const saltRounds = 8;

let register = (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {
    const userByEmail = await UserModel.findByEmail(email);

    if (userByEmail) {
      // Nếu tài khoản đã bị xóa
      if (userByEmail.deteledAt) {
        return reject(transErrors.account_removed);
      }
      // Nếu tài khoản chưa được active
      if (!userByEmail.local.isActive) {
        return reject(transErrors.account_not_active);
      }
      return reject(transErrors.account_in_use);
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt);
    let userItem = {
      username: email.split("@")[0],
      gender,
      local: {
        email,
        password: hashPassword,
        verifyToken: uuidv4()
      }
    };

    let user = await UserModel.createNew(userItem);
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    // send email
    sendMaiil(email, transMail.subject, transMail.template(linkVerify))
      .then(success => {
        resolve(transSuccess.userCreated(user.local.email));
      })
      .catch(async err => {
        // remove user
        // Lưu ý là nhớ cài đặt ứng dụng kém an toàn cho tài khoản google sử dụng gmail ở trên
        // Không thì sẽ ko thể gửi mail băng nodemailer
        // Lỗi: Username and Password not accepted
        await UserModel.removeById(user._id);
        console.log(err);
        reject(transMail.send_failed);
      });
  });
};

const verifyAccount = token => {
  return new Promise(async (resolve, reject) => {
    const userByToken = await UserModel.findByToken(token);

    // Nếu tồn tại user token tức là tài khoản chưa được kích hoạt
    if (!userByToken) {
      return reject(transErrors.token_undefined);
    }

    await UserModel.verify(token);
    resolve(transSuccess.account_actived);
  });
};

module.exports = {
  register,
  verifyAccount
};
