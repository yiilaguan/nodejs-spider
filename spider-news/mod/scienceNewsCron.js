var CronJob = require('cron').CronJob;
var email = require("./scienceNewsEmail")
var html = require("./scienceNewsHtml")
var newsFetch = require('../mod/scienceNewsFetch');
var webData = require("../config/scienceNewsWebData.json");
var timeZone = "Asia/Shanghai";
var cronTime = "0 30 8,10,14,16,18,20 * * *";
// var cronTime = "* 0/1 * * * * *";
console.log("=>=>=> cron   fetch science news  is started at ", cronTime);
var job = new CronJob(cronTime, function () {
      /**
       * 8:00 AM everyDay
       * 0 0 8 * * * *
       */
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
      // .then(function (data) {
      // });
      // html.body(function (data) {
      //   email.sendMail(data);
      // })
    }, function () {
      /* stop the job  function */
    },
    true, /* Start the job right now */
    timeZone /* Time zone of this job. */
);
