import express, { urlencoded } from "express";
import ConnectDB from "./config/connectDB";
import ConfigViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import connectFlash from "connect-flash";
import ConfigSession from "./config/session";

// Init app
const app = express();

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

// Init all routes
initRoutes(app);  



app.listen(process.env.APP_PORT, process.env.APP_HOST, () => console.log(`Server start ${process.env.APP_HOST}:${process.env.APP_PORT}/`));


