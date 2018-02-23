var request = require("request");
var fs = require("fs");
var cheerio = require("cheerio");
request({
    // 1.	近一交易日股價大於10元
    // 2.	近一交易日股價小於100元
    // 3.	近一交易日股價大於10日MA
    // 4.	10日MA大於60日MA
    url: "http://justdata.yuanta.com.tw/z/zk/zkf/zkResult.asp?D=1&A=x@30,a@10;x@50,a@100;x@40,a@10;x@1410,a@10,b@60&site=",
    method: "GET"
}, function (e, r, b) {
    if (e || !b) { return; }
    var $ = cheerio.load(b);
    var result = [];
    var eachTitles = $(".zkt1L .zkt2R a");
    var eachTitlesEven = $(".zkt1L .zkt2R_rev a");
    var close = $(".zkt1L .zkt2R .zkt2L").next();
    var closeEven = $(".zkt1L .zkt2R_rev .zkt2L_rev").next();
    var sixtyMA = $(".zkt1L .zkt2R .zkt2r").next();
    var counter = 0;

    fuck(eachTitles, close, ".zkt2R", ".zkt2r");
    fuck(eachTitlesEven, closeEven, ".zkt2R_rev", ".zkt2r_rev");
    result.push("total: " + counter);
    fs.writeFileSync("result.json", JSON.stringify(result));

    function fuck(titles, closeNum, topRoot, tenMATd) {
        for (var i = 0; i < titles.length; i++) {

            var regResult = $(titles[i]).text().slice(0, 4);
            var tenMA = $(titles[i]).closest(topRoot).find(tenMATd).eq(0);
            // console.log(regResult + " 10MA:" + $(tenMA).text())
            if (regResult != "" && regResult != "\n\n") {
                var countRisk = $(closeNum[i]).text() / $(tenMA).text();
                // console.log(regResult + " K:" + $(closeNum[i]).text() + ", 10MA:" + $(tenMA).text())
                if (countRisk > 1.05 && countRisk < 1.15) {
                    countRisk = (countRisk - 1) * 100;
                    countRisk = countRisk.toFixed(2);
                    counter++;
                    result.push(regResult + " K:" + $(closeNum[i]).text() + ", 10MA:" + $(tenMA).text() + ", Risk:" + countRisk + "%");
                }

            }
        }


    }
});