import express, { urlencoded } from "express";
import ConnectDB from "./config/connectDB";
import ConfigViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSocketIo from "./config/socketio";
import cors from "cors";

// Init app
const app = express();

// Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

// Connect to DB
ConnectDB();

// Config session
session.config(app);

// View engine
ConfigViewEngine(app);

// cors 
app.use(cors());

// Enable post data for request
app.use(express.urlencoded({ extended: true }));

// Enable flash message
app.use(connectFlash());

// Use cookie parser
app.use(cookieParser());

// Config passport
app.use(passport.initialize());
app.use(passport.session());

// Init all routes
initRoutes(app);

// Config socket.io
configSocketIo(io, cookieParser, session.sessionStore);

// Init all sockets
initSockets(io);

server.listen(process.env.APP_PORT, process.env.APP_HOST, () =>
  console.log(`Server start ${process.env.APP_HOST}:${process.env.APP_PORT}/`)
);

// import pem from "pem";
// import https from "https";

// pem.createCertificate({ days: 1, selfSigned: true }, function(err, keys) {
//   if (err) {
//     throw err;
//   }

//   // Connect to DB
//   ConnectDB();

//   // Config session
//   ConfigSession(app);

//   // View engine
//   ConfigViewEngine(app);

//   // Enable post data for request
//   app.use(express.urlencoded({ extended: true }));

//   // Enable flash message
//   app.use(connectFlash());

//   // Config passport
//   app.use(passport.initialize());
//   app.use(passport.session());

//   // Init all routes
//   initRoutes(app);

//   https
//     .createServer({ key: keys.serviceKey, cert: keys.certificate }, app)
//     .listen(process.env.APP_PORT, process.env.APP_HOST, () =>
//       console.log(
//         `Server start ${process.env.APP_HOST}:${process.env.APP_PORT}/`
//       )
//     );
// });
