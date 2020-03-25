import UserModel from "../models/userModel";
import { transErrors, transSuccess } from "../../lang/vi";
import bcrypt from "bcrypt";
const saltRounds = 8;
/**
 * Update user info
 * @param {userId} id
 * @param {data update} item
 */
let updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
};
/**
 * Update user's password
 * @param {userId} id
 * @param {data update} dataUpdate
 */
let updatePassword = (id, dataUpdate) => {
  return new Promise(async (resolve, reject) => {
    let currentUser = await UserModel.findUserById(id);

    if (!currentUser) {
      return reject(transErrors.account_undefined);
    }

    let checkCurrentPassword = await currentUser.comparePassword(
      dataUpdate.currentPassword
    );

    if (!checkCurrentPassword) {
      return reject(transErrors.user_current_password_failed);
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    await UserModel.updatePassword(currentUser._id, bcrypt.hashSync(dataUpdate.newPassword, salt));

    resolve(true);
  });
};

module.exports = {
  updateUser,
  updatePassword
};
