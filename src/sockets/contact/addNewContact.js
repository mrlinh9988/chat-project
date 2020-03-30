import {
  pushSocketIdToArray,
  emitNotifyToArray,
  removeSocketIdFromArray
} from "../../helpers/socketHelper";

/**
 * @param io from socket.io
 */
let addNewContact = io => {
  let clients = {};
  io.on("connection", socket => {
    clients = pushSocketIdToArray(
      clients,
      socket.request.user._id,
      socket.id
    );

    socket.on("add-new-contact", data => {
      let currentUser = {
        id: socket.request.user._id,
        avatar: socket.request.user.avatar,
        username: socket.request.user.username
      };

      // Nếu nhận được contactId từ client gửi lên
      // emit chỉ cho riêng thăng mà mình gửi lời mời kết bạn
      if (clients[data.contactId]) {
        emitNotifyToArray(
          clients,
          data.contactId,
          io,
          "respone-add-new-contact",
          currentUser
        );
      }
    });

    socket.on("disconnect", () => {
      removeSocketIdFromArray(clients, socket.request.user._id, socket);
    });

    // console.log(clients);
  });
};

module.exports = addNewContact;
