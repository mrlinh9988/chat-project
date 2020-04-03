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

let addNew = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let newContact = await contact.addNew(currentUserId, contactId);
    // console.log(newContact);
    // console.log(!!newContact);

    return res.status(200).send({
      success: !!newContact // true
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeRequestContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContact(
      currentUserId,
      contactId
    );

    return res.status(200).send({
      success: !!removeReq
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContacts = async (req, res) => {
  try {
    let skipNumberContact = +req.query.skipNumber; // === parseInt(req.query.skipNumber)

    // Get more item
    let newContactUsers = await contact.readMoreContacts(
      req.user._id,
      skipNumberContact
    );

    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContactsSent = async (req, res) => {
  try {
    let skipNumberContact = +req.query.skipNumber; // === parseInt(req.query.skipNumber)

    // Get more item
    let newContactUsers = await contact.readMoreContactsSent(
      req.user._id,
      skipNumberContact
    );

    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContactsReceived = async (req, res) => {
  try {
    let skipNumberContact = +req.query.skipNumber; // === parseInt(req.query.skipNumber)

    // Get more item
    let newContactUsers = await contact.readMoreContactsReceived(
      req.user._id,
      skipNumberContact
    );

    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  findUsersContact,
  addNew,
  removeRequestContact,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived
};
