var webData = require("../config/scienceNewsWebData.json");
var cheerio = require('cheerio');
var superagent = require('superagent');
var charset = require('superagent-charset');

var requestGet = async function (url, name, rowSize, parentSel, selElement,
    childFind) {
  var result;
  if (name == '腾讯新闻') {
    superagent = charset(superagent);
    result = await superagent.get(url).charset("gbk").set('User-Agent',
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36');
  } else if (name == "今日头条") {
    result = await superagent.get(
        "https://www.toutiao.com/api/pc/feed/?category=internet&utm_source=toutiao&widen=1&max_behot_time=0&max_behot_time_tmp=0&tadrequire=true&as=A1A54BC68A1C8AB&cp=5B6AAC089AAB8E1&_signature=e3vI9wAAIBK1yqChyeLZ4Xt7yO")
    .withCredentials()
    .set(
        "cookie", "tt_webid=6587288223550490125; WEATHER_CITY=%E5%8C%97%E4%BA%AC; tt_webid=6587288223550490125; UM_distinctid=16518fcfe9259c-0769af31402e11-1e2e130c-1fa400"
        + "-16518fcfe9340e; CNZZDATA1259612802=439670000-1533722242-https%253A%252F%252Fwww.baidu.com%252F%7C1533722242; __tasessionId=5r5924khk1533722558230; "
        + "csrftoken=ca5108f1a3edaa2d9486cf846aaf19df; uuid=\"w:d7a96df9e0e7444fab5a732aa4c23628\"")
    .set("accept",
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8")
    .set("user-agent",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36");
  } else {
    result = await  superagent.get(url)//请求页面地址
  }
  return getInfo(name, rowSize, parentSel, selElement, childFind, result);
};

var getInfo = function (name, rowSize, parentSel, selElement, childFind,
    result) {
  var tmpData = [];
  if (name == "今日头条") {
    var data = JSON.parse(result.text);
    data.data.forEach(function (element, index) {
      if (index >= rowSize) {
        return;
      }
      tmpData.push(
          {
            title: element.title,
            href: "https://www.toutiao.com" + element.source_url
          }
      );
    });
  } else {
    var $ = cheerio.load(result.text);//用cheerio解析页面数据
    var childSel = "li";
    if (childFind != undefined) {
      childSel = childFind;
    }
    $(parentSel).children(childSel).each(
        function (index, element) {//下面类似于jquery的操作，前端的小伙伴们肯定很熟悉啦
          var $eleItem = $(element).find(selElement);
          if (index >= rowSize) {
            return;
          }
          tmpData.push(
              {
                title: $eleItem.text(),
                href: $eleItem.attr('href')
              }
          );
        });
  }
  var pageData = {name: name, data: tmpData};
  return pageData;
}

function fetchDataSync() {
  var rdata = [];
  webData.forEach(function (item, index) {
    var url = item.url;
    var name = item.name;
    var rowSize = item.rowSize;
    var parentSel = item.parentSelector;
    var selElement = item.childSelector;
    var childFind = item.childFind;
    console.log("fetching data from ", item.name);
    var rnda = requestGet(url, name, rowSize, parentSel, selElement, childFind);
    rdata.push(rnda);
  });
  return rdata;
}

exports.fetchAllData = function () {

};

exports.fetchDataSync = fetchDataSync;
