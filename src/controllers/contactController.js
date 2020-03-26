import { contact } from "../services/index";
import { validationResult } from "express-validator";

let findUsersContact = async (req, res) => {
  let errorArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationResult(req).mapped());

    errors.forEach(element => {
      errorArr.push(element.msg);
    });

    console.log(errorArr);
    return res.status(500).send(errorArr);
  }

  try {
    let keyword = req.params.keyword;
    let currentUserId = req.user._id;

    let users = await contact.findUsersContact(currentUserId, keyword);
    return res.render("main/contact/sections/_findUserContact", { users });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  findUsersContact
};
