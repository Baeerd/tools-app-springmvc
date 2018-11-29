/**
 * 获取json数据
 * @param data
 */
function getJsonData(data) {
    var url = "data/" + data + ".json";
    $.getJSON(url,function (json) {
        console.log("json:" + json);
        return json;
    });
}

/**
 * 将代码转换成名称
 * @param name
 */
function translateCode(name) {
    switch (name) {
        case "name" : return "名称";
        case "score" : return "匹配程度";
        case "probability" : return "匹配程度";
        case "keyword" : return "关键字";
        case "root" : return "所属类型";
        case "calorie" : return "卡路里";
        case "year" : return "年份";
        default : return;
    }
}