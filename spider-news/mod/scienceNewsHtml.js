var htmlSync = function (data) {
  // var arr = newsFetch.fetchDataSync();
  return getBody(data);
};

function getBody(arrayData) {
  var body = "<h1>今天最新科技类新闻</h1></br>";
  arrayData.forEach(function (pitem, index) {
    body += '' + '<h2>' + pitem.name + '</h2>'
        + '<ul class="list-style:none;">';
    var bd = pitem.data;
    bd.forEach(function (citem, j) {
      body +=
          '<li style="font-size:13px;">' +
          '<a  href=' + citem.href + '>' + citem.title + '</a>' + '</li>'
    });
    body += '</ul>';
  });
  // console.log("body..................", body)
  return body;
}

exports.bodySync = htmlSync;
