import {
  pushSocketIdToArray,
  emitNotifyToArray,
  removeSocketIdFromArray
} from "../../helpers/socketHelper";

/**
 * @param io from socket.io
 */
let removeRequestContactSent = io => {
  let clients = {};
  io.on("connection", socket => {
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.on("remove-request-contact-sent", data => {
      let currentUser = {
        id: socket.request.user._id
      };

      // Nếu nhận được contactId từ client gửi lên
      // emit chỉ cho riêng thăng mà mình gửi lời mời kết bạn
      if (clients[data.contactId]) {
        emitNotifyToArray(
          clients,
          data.contactId,
          io,
          "respone-remove-request-contact-sent",
          currentUser
        );
      }
    });

    socket.on("disconnect", () => { 
      clients = removeSocketIdFromArray(
        clients,
        socket.request.user._id,
        socket
      );
    });

    // console.log(clients);  
  });
};

module.exports = removeRequestContactSent;
