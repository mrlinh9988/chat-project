import nodemailer from "nodemailer";

let adminEmail = process.env.MAIL_USER;
let adminPassword = process.env.MAIL_PASSWORD;
let mailHost = process.env.MAIL_HOST;
let mailPort = process.env.MAIL_PORT;

const sendMail = (to, subject, htmlContent) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: mailHost,
    port: mailPort,
    secure: false, // use SSL - TLS
    auth: {
      user: adminEmail,
      pass: adminPassword
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  let options = {
    from: adminEmail,
    to,
    subject,
    html: htmlContent,
  };

  return transporter.sendMail(options); // This return default a promise 
};

module.exports = sendMail;
