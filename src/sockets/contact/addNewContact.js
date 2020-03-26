/**
 * @param io from socket.io
 */
let addNewContact = io => {
  io.on("connection", socket => {
    console.log("connected socket.io");
    socket.on("add-new-contact", data => {
      console.log(data);
      console.log(socket.request.user);
    });
  });
};

module.exports = addNewContact;
