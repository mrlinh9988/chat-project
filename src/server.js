import express, { urlencoded } from "express";
import ConnectDB from "./config/connectDB";
import ConfigViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import connectFlash from "connect-flash";
import ConfigSession from "./config/session";
import passport from "passport";

import pem from "pem";
import https from "https";

// Init app
const app = express();

pem.createCertificate({ days: 1, selfSigned: true }, function(err, keys) {
  if (err) {
    throw err;
  }

  // Connect to DB
  ConnectDB();

  // Config session
  ConfigSession(app);

  // View engine
  ConfigViewEngine(app);

  // Enable post data for request
  app.use(express.urlencoded({ extended: true }));

  // Enable flash message
  app.use(connectFlash());

  // Config passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Init all routes
  initRoutes(app);

  https
    .createServer({ key: keys.serviceKey, cert: keys.certificate }, app)
    .listen(process.env.APP_PORT, process.env.APP_HOST, () =>
      console.log(
        `Server start ${process.env.APP_HOST}:${process.env.APP_PORT}/`
      )
    );
});

// // Connect to DB
// ConnectDB();

// // Config session
// ConfigSession(app);

// // View engine
// ConfigViewEngine(app);

// // Enable post data for request
// app.use(express.urlencoded({ extended: true }));

// // Enable flash message
// app.use(connectFlash());

// // Config passport
// app.use(passport.initialize());
// app.use(passport.session());

// // Init all routes
// initRoutes(app);

// app.listen(process.env.APP_PORT, process.env.APP_HOST, () =>
//   console.log(`Server start ${process.env.APP_HOST}:${process.env.APP_PORT}/`)
// );
