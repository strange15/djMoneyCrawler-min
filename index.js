var request = require("request");
var fs = require("fs");
var cheerio = require("cheerio");
request({
    url: "http://justdata.yuanta.com.tw/z/zk/zkf/zkResult.asp?A=x@30,a@10;x@50,a@100;x@40,a@10;x@1410,a@10,b@60&B=&C=ID,SO@1&D=1&E=0&G=1&site=",
    method: "GET"
}, function (e, r, b) {
    if (e || !b) { return; }
    var $ = cheerio.load(b);
    var result = [];
    var eachTitles = $(".zkt1L tr");
    var close = $(".zkt1L .zkt2R .zkt2L").next();
    var tenMA = $(".zkt1L .zkt2R .zkt2r");
    var sixtyMA = $(".zkt1L .zkt2R .zkt2r").next();

    for (var i = 0; i < eachTitles.length; i++) {
        var regResult = $(eachTitles[i]).find('td').eq(0).find('a').text().slice(0, 4);
        if (regResult != "" && regResult != "\n\n") {
            var countRisk = $(close[i]).text() / $(tenMA[i]).text();
            if (countRisk > 1.05 && countRisk < 1.15) {
                countRisk = (countRisk - 1) * 100;
                countRisk = countRisk.toFixed(2);

                // console.log(countRisk + "%")
                result.push(regResult + " Risk:" + countRisk + "%");
            }

        }
        // console.log(regResult);
    }

    fs.writeFileSync("result.json", JSON.stringify(result));
});
