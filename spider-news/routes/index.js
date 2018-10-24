var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var superagent = require('superagent');
var charset = require('superagent-charset');
var email = require("../mod/scienceNewsEmail");
var newsFetch = require('../mod/scienceNewsFetch');
var fs = require('fs');

/**
 * @param url
 * @param dfn process the response Data
 */
function parseUrl(parentsel, subsel, url, dfn) {
  var resultData = [];
  superagent = charset(superagent);
  superagent.get(url)
  .end(function (err, res) {//页面获取到的数据
    if (err) {
      console.error("failed get news from url:", url);
      return;
    }
    console.log("res-text.................................................",
        res.text);
    var $ = cheerio.load(res.text);//用cheerio解析页面数据
    $(parentsel).children('li').each(
        function (index, element) {//下面类似于jquery的操作，前端的小伙伴们肯定很熟悉啦
          var $eleItem = $(element).find(subsel);
          resultData.push(
              {
                title: $eleItem.text(),
                href: $eleItem.attr('href')
              }
          );
        });
    dfn(resultData);
    var mailInfo = {
      html: resultData
    }
    // email.sendMail(mailInfo);
  });
}

function parseJsonData(dfn) {
  var resultData = [];
  superagent.get(
      "https://www.toutiao.com/api/pc/feed/?category=internet&utm_source=toutiao&widen=1&max_behot_time=0&max_behot_time_tmp=0&tadrequire=true&as=A1A54BC68A1C8AB&cp=5B6AAC089AAB8E1&_signature=e3vI9wAAIBK1yqChyeLZ4Xt7yO")
  .withCredentials()
  .set(
      "cookie", "tt_webid=6587288223550490125; WEATHER_CITY=%E5%8C%97%E4%BA%AC; tt_webid=6587288223550490125; UM_distinctid=16518fcfe9259c-0769af31402e11-1e2e130c-1fa400"
      + "-16518fcfe9340e; CNZZDATA1259612802=439670000-1533722242-https%253A%252F%252Fwww.baidu.com%252F%7C1533722242; __tasessionId=5r5924khk1533722558230; "
      + "csrftoken=ca5108f1a3edaa2d9486cf846aaf19df; uuid=\"w:d7a96df9e0e7444fab5a732aa4c23628\"")
  .set("accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8")
  .set("user-agent",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36")
  .end(function (err, res) {//页面获取到的数据
    if (err) {
      console.error("failed get news from url:", url);
      return;
    }
    console.log("res-text.................................................",
        res.text);
    var data = JSON.parse(res.text);
    data.data.forEach(function (element, i) {
   	resultData.push(
          {
            title: element.title,
            href: "https://www.toutiao.com" + element.source_url
          }
      );
    });
    dfn(resultData);
  });
}

/**
 *riot.mount('feedBox', {
    type: 1,
    category: 'internet',
    widen: 1,
    abType: 0,
    serviceType: true
  });
 "url": "https://www.toutiao.com/ch/internet/",
 "name": "今日头条",
 "rowSize": 5,
 "parentSelector": ".feedBox .wcommonFeed ul",
 "childSelector": ".title-box a"
 */
/* GET home page. */
router.get('/', function (req, res, next) {
  parseJsonData(function (data) {
        res.send(data);
      }
  )
  // parseUrl('.feedBox .wcommonFeed ul', '.title-box a',
  //     "https://www.toutiao.com/ch/internet/",
  //     function (data) {
  //       res.send(data);
  //     }
  // )
  // var data = newsFetch.fetchAllData;
  // res.send(data);
});

module.exports = router;
