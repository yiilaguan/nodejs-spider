function ScienceNewsDataStatus() {
  var scienceNews = {
    status: "not", //ok or not
    data: []
  };
  var vo = {
    setStatus: function (status) {
      scienceNews.status = status;
    },
    setData: function (data) {
      scienceNews.data = data;
    },
    getStatus: function () {
      return scienceNews.status;
    },
    getData: function () {
      return scienceNews.data;
    },
    putData: function (pdata) {
      scienceNews.data.push(pdata);
    }
  };
  return vo;
}

module.exports = ScienceNewsDataStatus;
