export let pushSocketIdToArray = (clients, userId, socketId) => {
  /**
   * Nếu đã tồn tại key currentUserId tức là user đã đăng nhập trước đó
   */
  if (clients[userId]) {
    // key là userId và giá trị của key là 1 mảng các socket.id
    clients[userId].push(socketId);
  } else {
    /**
     * Nếu chưa có clients[userId] tức user chưa đăng nhập trước đó (đã đăng xuất)
     * thì khởi tạo key userId có giá trị ban đầu là socketId mà người dùng đó vừa đăng nhập
     */
    clients[userId] = [socketId];
  }

  return clients;
};

export let emitNotifyToArray = (clients, userId, io, eventName, data) => {
  clients[userId].forEach(socketId =>
    io.sockets.connected[socketId].emit(eventName, data)
  );
};

export let removeSocketIdFromArray = (clients, userId, socket) => {
  // remove socketId when disconnect
  clients[userId] = clients[userId].filter(
    socketId => socketId !== socket.id
  );

  // Nếu key không còn value nào thì xóa key đó đi
  if (!clients[userId].length) {
    delete clients[userId];
  }

  return clients;
};
