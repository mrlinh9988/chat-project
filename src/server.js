import express from "express";
import ConnectDB from "./config/connectDB";
import ConfigViewEngine from "./config/viewEngine";

// Init app
const app = express();

// Connect to DB    
ConnectDB();

// view engine
ConfigViewEngine(app);

app.get('/', (req, res) => {
  return res.render('main/master');
});

app.get('/login-register', (req, res) => {
  return res.render('auth/loginRegister');
});

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => console.log(`Server start ${process.env.APP_HOST}:${process.env.APP_PORT}/`));


