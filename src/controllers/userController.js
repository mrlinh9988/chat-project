import multer from "multer";
import { app } from "../config/app";
import { transErrors, transSuccess } from "../../lang/vi";
import { v4 as uuidv4 } from "uuid";
import { user } from "../services/index";
import fsExtra from 'fs-extra'; 

let storageAvatar = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, app.avatar_directory);
  },
  filename: (req, file, cb) => {
    let math = app.avatar_type;
    if (math.indexOf(file.mimetype) === -1) {
      return cb(transErrors.avatar_type, null);
    }

    let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`; // create random unique file name
    cb(null, avatarName);
  }
});

let avatarUploadFile = multer({
  storage: storageAvatar,
  limits: {
    fileSize: app.avatar_limit_size
  }
}).single("avatar");

let updateAvatar =  (req, res) => {
  avatarUploadFile(req, res, async err => {
    if (err) {
      if (err.message) {
        return res.status(500).send(transErrors.avatar_size);
      }
      // An unknown error occurred when uploading.
      return res.status(500).send(err);
    }

    try {
      let updateUserItem = {
        avatar: req.file.filename,
        updatedAt: Date.now()
      };

      // Update user
      let userUpdate = await user.updateUser(req.user._id, updateUserItem);

      // Remove old avatar from /src/public/images/users/
      // Dùng userUpdate.avatar vì dù update dữ liệu mới rồi nhưng hàm findByIdAnUpdate của 
      // Mongoose vẫn trả về giá trị trước khi được update 
      await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);   
      
      let result = {
        message: transSuccess.avatar_updated,
        image: `/images/users/${req.file.filename}`
      }
      
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  });
};

module.exports = {
  updateAvatar
};