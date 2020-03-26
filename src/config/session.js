import session from "express-session";
import connectMongo from "connect-mongo";

let MongoStore = connectMongo(session);

/*
 * This variable is where save sesssion, in this case is mongodb
 */
let sessionStore = new MongoStore({
  url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect: true
  // autoRemove: 'native'  // mặc định giá trị là native, Khi session hết hạn sẽ tự động được xóa khỏi mongo để tránh làm đầy đữ liệu
});

// config session for app
const config = app => {
  app.use(
    session({
      key: process.env.SESSION_KEY,
      secret: process.env.SESSION_SECRET,
      store: sessionStore,
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 days
      }
    })
  );
};

module.exports = { config, sessionStore };
