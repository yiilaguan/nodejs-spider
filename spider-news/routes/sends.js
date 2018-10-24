var express = require('express');
var email = require("../mod/scienceNewsEmail")
var html = require("../mod/scienceNewsHtml")
var newsFetch = require('../mod/scienceNewsFetch');
var webData = require("../config/scienceNewsWebData.json");
var router = express.Router();
function sendEmail(){
      var data = [];
      var webCount = webData.length;
      new Promise(function (resolve, error) {
        resolve(newsFetch.fetchDataSync());
      }).then(function (proArray) {
        proArray.forEach(function (pro) {
          pro.then(function (sd) {
            data.push(sd);
            if (data.length == webCount) {
              var body = html.bodySync(data);
              email.sendMail(body);
            }
          });
        })
      })
};
/* GET users listing. */
router.get('/', function(req, res, next) {
  sendEmail();
  res.send('发送新闻到邮件完成');
});

module.exports = router;
