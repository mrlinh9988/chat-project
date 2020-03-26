import passportSocketIo from "passport.socketio";

let configSocketIo = (io, cookieParser, sessionStore) => {
  io.use(
    passportSocketIo.authorize({
      cookieParser: cookieParser,
      key: process.env.SESSION_KEY, // phải giống với config/session.js
      secret: process.env.SESSION_SECRET, // phải giống với config/session.js
      store: sessionStore,
      success: (data, accept) => {
        // console.log("User login: ", data.user.logged_in);
        // user not login
        if (!data.user.logged_in) {
          return accept("invalid user", false);
        }

        return accept(null, true);
      },
      fail: (data, message, error, accept) => {
        if (error) {
          console.log("Failed connection to socket.io:", message);
          return accept(new Error(message), false);
        }
      }
    })
  );
};

module.exports = configSocketIo;
