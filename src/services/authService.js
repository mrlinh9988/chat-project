import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { transErrors, transSuccess } from "../../lang/vi";
import { reject } from "bluebird";

const saltRounds = 8;

let register = (email, gender, password) => {
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
      username: email.split('@')[0],
      gender,
      local: {
        email,
        password: hashPassword,
        verifyToken: uuidv4()
      }
    }

    let user = await UserModel.createNew(userItem);
    resolve(transSuccess.userCreated(user.local.email));
  })


}

module.exports = {
  register
};

