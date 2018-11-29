$(function() {

    /**
     * 源文本模板输入框监听
     */
    reTextTemplateListener();

    /**
     * 下载文件
     */
    downloadResultText();

    /**
     * 提交后台获取结果字符串
     */
    submitForm();

    /**
     * 重置模板按钮监听
     */
    resetTempListener();

    /**
     * 生成sql语句按钮监听
     */
    generatorSqlBtnListener();

});

/*========================全局变量=====================================*/
/*****文本格式内容转换相关********/
var reCount = 1;//源文本模板计数
var deCount = 1;//目标文本模板计数
var diffLine = '';//模板与源数据不符行数
var diffFlag = false;//模板与数据是否不同
var params = {};//生成文本时占位符与源数据对应json

/*****生成sql语句相关********/
var name = "#01";//字段名称
var remark = "#02";//字段备注
var type = "#03";//字段类型
var length = "#04";//字段长度

/*========================全局变量=====================================*/

/**
 * 源文本模板输入框监听
 */
function reTextTemplateListener() {

    var lastTxt = "";

    $(".textTemp").keyup(function(event) {
        if(event.keyCode == 13) {
            var inputInfoVal =  $(this).val();
            var resultStr = '';
            console.log(lastTxt);
            console.log(inputInfoVal);
            // 原字符串与新字符串不一样，将不一样的地方替换
            if(lastTxt != inputInfoVal) {
                resultStr = replaceDiff(lastTxt, inputInfoVal, $(this));
                if(!resultStr) {
                    $(this).next().next().html(inputInfoVal);
                    return;
                }
            }
            $(this).val(resultStr);
            printHtml($(this).next(), resultStr);
        }
    });

    $(".textTemp").change(function() {
        var inputInfoVal =  $(this).val();
        if(!inputInfoVal) {
            //重置模板
            resetTemp();
            
            return;
        }
        lastTxt = getSpanHtml($(this).next().html());
        $(this).next().html(inputInfoVal);
        
    }); 
}

/**
 * 将原文本中与目标文本不一致的字符串替换成占位符
 * @param {原文本} reText 
 * @param {目标文本} deText 
 */
function replaceDiff(reText, deText, event) {
    reText = getSpanHtml(reText);
    if(reText === '设置源文本模板') {
        return;
    }
    
    var reLength = reText.length;
    var deLength = deText.length;
    var diffLength = reLength - deLength;

    if(diffLength <= 0) {
        return;
    }
    
    // 获取不同的字符串
    var reTextArr = reText.split('');
    var deTextArr = deText.split('');
    var changeFlag = false;
    for(var i=0; i<reTextArr.length; i++) {
        if(i>0 && reTextArr[i-1] != reTextArr[i]) {
            changeFlag = true;
        }
        // 比较字符是否相等
        if(reTextArr[i] != deTextArr[i] && deTextArr[i] != undefined) {
            changeFlag = true;
            break;
        }
        if(i == deTextArr.length) {
            break;
        }
    }
    // 如果全部相同没有更改
    
    if(!changeFlag && reText.indexOf("#") == -1) {
        error("模板字符全部相同，重新填写源文本");
        return;
    }
    var diffStr = reText.substr(i, diffLength);//需要替换的字符串
    var id = event.attr("id");
    switch(id) {
        case 'reCount': 
            var countStr = reCount < 10 ? '0'+reCount : reCount;
            reCount++;
        break;
        case 'deCount':
            var countStr = deCount < 10 ? '0'+deCount : deCount;
            deCount++;
        break;
        default:
        break;
    }

    console.log("#"+countStr+"==========>"+diffStr);
    var resultStr = reText.substring(0,i) + '#' + countStr + deText.substring(i);

    return resultStr;
}

/**
 * 获取span的html，自动去掉font渲染标签
 * @param {} event 
 */
function getSpanHtml(str) {
    str = str.replaceAll("<font color='red'>", "").replaceAll("</font>", "");
    str = str.replaceAll('<font color="red">', '').replaceAll('</font>', '');
    return str;
}

/**
 * 输出字符串到元素,渲染占位符
 * @param {*} event 
 */
function printHtml(event, content) {
    if(!content) {
        return;
    }
    var contentArr = content.split("");
    var j = 0;
    for(var i=0; i<contentArr.length; i++) {
        if(contentArr[i] == '#') {
            if(j > 0) {
                content = content.substring(0, i+25*j) + "<font color='red'>"
                + content.substring(i+25*j, i+25*j+3) + "</font>"
                + content.substring(i+25*j+3);
            } else {
                content = content.substring(0, i) + "<font color='red'>" 
                + content.substring(i, i+3) + "</font>" 
                + content.substring(i+3);
            }
            j++;
        }
    }
    event.html(content);
}

/**
 * 下载文件
 */
function downloadResultText() {

}

/**
 * 提交后台获取结果字符串
 */
function submitForm() {
    $("#submitFormBtn").click(function() {
        var tempOutTextarea = $("#tempOutTextarea").val();
        var reFileInputId = $("#reFileInputId").val();
        // 校验
        var reCount = $("#reCount").val();
        var deCount = $("#deCount").val();
        if(!reCount) {
            log("源模板不能为空！");
            return;
        }
        if(!deCount) {
            log("目标模板不能为空！");
            return;
        }
        if(!tempOutTextarea && !reFileInputId) {
            log("源文本不能为空！");
            return;
        }
        // 如果存在文件，则访问后台，上传文件
        if(reFileInputId) {
            var url = "";
            // TODO ajax上传表单到后台
            var formData = new FormData();
            // formData.append(name, element);
            formData.append('reFile', $('input[name=reFile]')[0].files[0]); //源文本文件
            formData.append('reStrTemp', $('input[name=reStrTemp]')[0].val()); //源文本模板
            formData.append('deStrTemp', $('input[name=reFile]')[0].val());//目标文本模板

            $.ajax({
                url: url,
                method: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    cache: false,
                    success: function(data) {
                        // TODO 将文本输出到textarea上
                        alert(data + "上传成功");
                    },
                    error: function (jqXHR) {
                        console.log(JSON.stringify(jqXHR));
                    }
                })
                .done(function(data) {
                    console.log('done');
                })
                .fail(function(data) {
                    console.log('fail');
                })
                .always(function(data) {
                    console.log('always');
            });
        } else if(!reFileInputId && tempOutTextarea) {
            // 没有上传文件，并且文本域中有值，则解析文本域中的文本
            var reTemp = $("#reCount").val();
            var deTemp = $("#deCount").val();
            var resultStr = formatText(tempOutTextarea, reTemp, deTemp);
            $("#tempOutTextarea").val(resultStr);
        } else {
            return;
        }
    });

}

/**
 * 更改源模板文本框
 * @param {分隔符} cutStr 
 */
function changeReTempInput(cutStr) {
    // 获取源文本模板文本框的值
    var reTempInput = $("#reCount").val();
    if(!reTempInput) {
        log("源文本框没有值");
        return;
    }
    var c = 1;
    var reTemps = reTempInput.split("\n");
    if(reTemps.length > 0) {
        var result = "";
        for(var i = 0; i<reTemps.length; i++) {
            var cutStrArr = reTemps[i].split(cutStr);
            if(cutStrArr.length == 1) {
                result += reTemps[i] + "\n";
                break;
            }

            for(var j=0; j<cutStrArr.length; j++) {
                reTemps[i] = reTemps[i].replaceAll(cutStrArr[j], c < 10 ? "#0"+c : "#"+c);
                c++;
            }
            reCount = c;
            result += reTemps[i] + "\n";
        }
        return result;
    } else {
        var cutStrArr = reTempInput.split(cutStr);
        if(cutStrArr.length == 1) {
            error("模板不存在此分隔符："+cutStr);
            return reTempInput;
        }

        for(var i=0; i<cutStrArr.length; i++) {
            reTempInput = reTempInput.replaceAll(cutStrArr[i], c < 10 ? "#0"+c : "#"+c);
            c++;
        }
        reCount = c;

        return reTempInput;
    }
}

/**
 * 重置模板按钮监听
 */
function resetTempListener() {
    $("#resetTemp").click(function() {
        resetTemp();
        $("#tempOutTextarea").val("");
    });
}

/**
 * 重置
 */
function resetTemp() {
    reCount = 1;
    deCount = 1;
    lastTxt = '';
    $(".textTempSpan:eq(0)").html("设置源文本模板");
    $(".textTempSpan:eq(1)").html("设置目标文本模板");
    $(".resetInput").val("");

    diffLine = '';
    diffFlag = false;
    params = {};
}

/**
 * 按模板生成字符串
 * @param {内容} msg 
 * @param {源模板} reTemp 
 * @param {目标模板} deTemp 
 */
function formatText(msg, reTemp, deTemp) {
    var msgArr = msg.split("\n");
    var resultStr = "";
    for(var i=0; i<msgArr.length; i++) {
        if(msgArr[i].trim() == "") {
            resultStr += msgArr[i]+"\r\n";
            continue;
        }
        // add 2018/11/28 支持多行替换
        var reTempArr = reTemp.split("\n");
        var deTempArr = deTemp.split("\n");
        var reTempLen = reTempArr.length;//源文本行数，用于循环生成
        var deTempLen = deTempArr.length;//目标文本行数
        replaceStr(reTempArr[i%reTempLen], msgArr[i], i);// 替换对应行
        console.log(params);
        // 替换多行目标文本
        if((i+1)%reTempLen==0) {
            for(var j=0; j<deTempLen; j++) {
                var result = deTempArr[j];
                for(var key in params) {
                    result = result.replaceAll(key, params[key]);
                }
                resultStr += result+"\r\n";
            }
            if(deTemp.endWith("\n")) {
                resultStr += "\r\n";
            }
            // 清空params
            params = {};
        }
    }
    if(diffFlag) {
        resetTemp();
        return msg;
    }
    diffFlag = false;
    success("生成成功");
    return resultStr;
}

/**
 * 生成占位符与实际值对应关系
 * @param {*} reTemp 
 * @param {*} value 
 * @param {*} line
 */
function replaceStr(reTemp, value, line) {

    var firIndex = reTemp.indexOf("#");
    if(firIndex == -1) {
        return;
    }
    var firStr = value.substring(firIndex);// 变量实际值开头 a,b,a,a,c,a,
    var endIdex = reTemp.substring(firIndex+1).indexOf("#");//第二个#变量位置
    // 如果为最后一个变量则没有第二个变量位置，直接取变量末尾值
    var resultValue = "";
    if(endIdex == -1) {
        var endStr = reTemp.substring(firIndex+1).substring(2);// 第一个变量与第二个变量中间位置字符串
        if(!endStr) {
            resultValue = firStr.substring(0);// 第一个变量实际值
        } else {
            if(firStr.indexOf(endStr) == -1) {
                // 记录错误行号
                diffLine += line;
                if(diffLine.split("、").length <= 10) {
                    error("第"+diffLine+"行实际值与源模板格式不符");
                } else {
                    error("实际值与源模板格式不符");
                }
                diffFlag = true;
                diffLine += '、';
                return;
            }
            resultValue = firStr.substring(0, firStr.indexOf(endStr));// 第一个变量实际值
        }
    } else {
        var endStr = reTemp.substring(firIndex+1).substring(2, endIdex);// 第一个变量与第二个变量中间位置字符串
        resultValue = firStr.substring(0, firStr.indexOf(endStr));// 第一个变量实际值
    }
    var resultKey = reTemp.substring(firIndex, firIndex+3);//第一个变量值
    
    params[resultKey] = resultValue;
    replaceStr(reTemp.substring(reTemp.indexOf(resultKey)+resultKey.length), value.substring(value.indexOf(resultValue)+resultValue.length));
}

/**
 * 生成SQL语句按钮监听
 */
function generatorSqlBtnListener() {
    $("#generatorSqlBtn").click(function() {
        var tempOutTextarea = $("#tempOutTextarea").val();
        var sqlFileInputId = $("#sqlFileInputId").val();
        // 校验
        var tableNameInput = $("#tableNameInput").val();
        var reCount = $("#reCount").val();
        if(!tableNameInput) {
            log("表名不能为空！");
            return;
        }
        if(!reCount) {
            log("文件模板不能为空！");
            return;
        }
        if(!tempOutTextarea && !sqlFileInputId) {
            log("源文本不能为空！");
            return;
        }
        // 如果存在文件，则访问后台，上传文件
        if(sqlFileInputId) {
            var url = "";
            // TODO ajax上传表单到后台
            var formData = new FormData();
            // formData.append(name, element);
            formData.append('reFile', $('input[name=reFile]')[0].files[0]); //源文本文件
            formData.append('reStrTemp', $('input[name=reStrTemp]')[0].val()); //源文本模板
            formData.append('deStrTemp', $('input[name=reFile]')[0].val());//目标文本模板

            $.ajax({
                url: url,
                method: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    cache: false,
                    success: function(data) {
                        // TODO 将文本输出到textarea上
                        alert(data + "上传成功");
                    },
                    error: function (jqXHR) {
                        console.log(JSON.stringify(jqXHR));
                    }
                })
                .done(function(data) {
                    console.log('done');
                })
                .fail(function(data) {
                    console.log('fail');
                })
                .always(function(data) {
                    console.log('always');
            });
        } else if(!sqlFileInputId && tempOutTextarea) {
            // 没有上传文件，并且文本域中有值，则解析文本域中的文本
            var resultStr = generatorCreateSqlText(tableNameInput, reCount, tempOutTextarea);
            $("#tempOutTextarea").val(resultStr);
        } else {
            return;
        }
    });
}

/**
 * 根据表名和模板生成创建sql语句
 * @param {表名} tableName 
 * @param {文本模板} tableTemp 
 * @param {文本内容} tempOutTextarea 
 */
function generatorCreateSqlText(tableName, tableTemp, tempOutTextarea) {
    var tableNames;
    tableNames = tableName.split(",");
    if(!tableNames[1]) {
        tableNames = tableName.split("，");
    }
    if(!tableNames[1]) {
        tableNames = tableName.split(":");
    }
    var result1 = "create table "+tableNames[0]+"\r\n(\r\n";
    var result2 = "";
    if(tableNames[1]) {
        result2 = "comment on table "+tableNames[0]+"\r\n  is '"+tableNames[1]+"';\r\n";
    }



    /****************************************** */
    var msgArr = tempOutTextarea.split("\n");
    for(var i=0; i<msgArr.length; i++) {
        if(msgArr[i].trim() == "") {
            continue;
        }
        replaceStr(tableTemp, msgArr[i], i);
        console.log(params);
        //params[name]字段名称
        //params[remark]字段备注
        //params[type]字段类型
        //params[length]字段长度
        if(i == msgArr.length-1) {
            result1 += "  "+params[name]+"          "+params[type]+"("+params[length]+")\r\n";
        } else {
            result1 += "  "+params[name]+"          "+params[type]+"("+params[length]+"),\r\n";
        }
        result2 += "comment on column "+tableNames[0]+"."+params[name]+"\r\n  is '"+params[remark]+"';\r\n";

        // 清空params
        params = {};
    }
    result1 += ");\r\n";
    success("生成成功");
    return result1+result2;




}
