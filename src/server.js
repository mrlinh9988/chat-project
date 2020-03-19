import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";

const app = express();

// Connect to DB    
ConnectDB();

app.get('/alo', async (req, res) => {
    try {
        const item = {
            userId: '123',
            cotactId: '456'
        }
        let contact = await ContactModel.createNew(item);
        res.json(contact);
    } catch (error) {
        console.log(error);
    }

});

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => console.log(`Server start ${process.env.APP_HOST}:${process.env.APP_PORT}/`));


