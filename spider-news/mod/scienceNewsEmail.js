'use strict';
var nodeMailer = require("nodemailer");
var mailInfoData = require("../config/scienceNewsEMailData.json");
var account = {
  smtp: {
    // host: "smtp.exmail.qq.com",
    // secure: "true"
    host: "smtp.163.com",
    port: "25",
    secureConnection: false,
  },
  user: "program_log@163.com",
  pass: process.env.epwd
};

let transporter = nodeMailer.createTransport(
    {
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      },
      logger: false,
      debug: false // include SMTP traffic in the logs
    },
    {
      // sender info
      from: account.user,
      headers: {
        // 'X-Laziness-level': 1000 // just an example header, no need to use this
      }
    }
);

let message = mailInfoData;
exports.sendMail = function (htmlBody) {
  if (htmlBody != "") {
    // var bodyHead = "<div><ul>"
    // var bodyEnd = "</ul></div>"
    // mailInfo.html.forEach(function (item, index) {
    //   bodyHead += "<li><a href='" + item.href + "'>"
    //       + item.title
    //       + "</a></li>"
    // })
    // bodyHead += bodyEnd;
    message.html = htmlBody;
  }
  // console.log("send message==============>", message);
  transporter.sendMail(message, function (error, info) {
    if (error) {
      console.log('Error occurred');
      console.log(error.message);
      return process.exit(1);
    }
    // console.log(nodeMailer.getTestMessageUrl(info));
    transporter.close();
    console.log('Message sent successfully!');
  })
};

