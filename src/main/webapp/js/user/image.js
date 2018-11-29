$(function() {
    /**
     * 监听图片文本框
     */
    imageAreaListener();
    /**
     * 监听文字文本框
     */
    wordAreaListener();
    /**
     * 监听下拉框改变
     */
    imageTypeChange();
    /**
     * 监听重置按钮
     */
    resetBtnListener();
});

/*****************************全局变量***************************************************/
let globalImageType = "1";
let globalWordType = "1";
/*****************************全局变量***************************************************/

/**
 * 监听下拉框改变
 */
function imageTypeChange() {
    $(".imageType").click(function () {
        let imageType = $(this).html();
        $("#imageTypeBtn").html(imageType + " <span class=\"caret\"></span>");
        globalImageType = getImageTypeCode(imageType);
    });

    $(".wordType").click(function () {
        let wordType = $(this).html();
        $("#wordTypeBtn").html(wordType + " <span class=\"caret\"></span>");
        globalWordType = getWordTypeCode(wordType);
    });
}

/**
 * 获取图片类型代码
 */
function getImageTypeCode(imageType) {
    switch (imageType) {
        case "通用物体识别" : return "1";
        case "菜品识别" : return "2";
        case "车型识别" : return "3";
        case "logo商标识别" : return "4";
        case "动物识别" : return "5";
        case "植物识别" : return "6";
        default : return "";
    }
}

/**
 * 获取文字识别类型代码
 */
function getWordTypeCode(imageType) {
    switch (imageType) {
        case "通用文字识别" : return "1";
        case "通用文字识别（高精度版）" : return "2";
        case "网络图片文字识别" : return "3";
        case "银行卡识别" : return "4";
        case "表格文字识别" : return "5";
        default : return "";
    }
}

/**
 * 监听图片文本框
 */
function imageAreaListener() {
    $("#imageAreaImg").on("paste", "#imageArea1", function () {
        // 如果下拉框没选择，则不发送请求
        if(globalImageType == null || globalImageType === "") {
            alert("图片类型不能为空");
            return false;
        }
        console.log(event);
        let isChrome = false;
        if ( event.clipboardData || event.originalEvent ) {
            //not for ie11  某些chrome版本使用的是event.originalEvent
            let clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
            if ( clipboardData.items ) {
                // for chrome
                let items = clipboardData.items,
                    len = items.length,
                    blob = null;
                isChrome = true;

                //阻止默认行为即不让剪贴板内容在div中显示出来
                event.preventDefault();

                //在items里找粘贴的image,据上面分析,需要循环
                for (var i = 0; i < len; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        blob = items[i].getAsFile();
                    }
                }
                if ( blob !== null ) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        // event.target.result 即为图片的Base64编码字符串
                        var base64_str = event.target.result;
                        //可以在这里写上传逻辑 直接将base64编码的字符串上传（可以尝试传入blob对象，看看后台程序能否解析）
                        uploadImgFromPaste(base64_str, 'paste', isChrome, globalImageType, "image");
                    }
                    reader.readAsDataURL(blob);
                }
            } else {
                //for firefox
                setTimeout(function () {
                    //设置setTimeout的原因是为了保证图片先插入到div里，然后去获取值
                    var imgList = document.querySelectorAll('#tar_box img'),
                        len = imgList.length,
                        src_str = '',
                        i;
                    for ( i = 0; i < len; i ++ ) {
                        if ( imgList[i].className !== 'my_img' ) {
                            //如果是截图那么src_str就是base64 如果是复制的其他网页图片那么src_str就是此图片在别人服务器的地址
                            src_str = imgList[i].src;
                        }
                    }
                    uploadImgFromPaste(src_str, 'paste', isChrome, globalImageType, "image");
                }, 1);
            }
        } else {
            //for ie11
            setTimeout(function () {
                var imgList = document.querySelectorAll('#tar_box img'),
                    len = imgList.length,
                    src_str = '',
                    i;
                for ( i = 0; i < len; i ++ ) {
                    if ( imgList[i].className !== 'my_img' ) {
                        src_str = imgList[i].src;
                    }
                }
                uploadImgFromPaste(src_str, 'paste', isChrome, globalImageType, "image");
            }, 1);
        }
    });
}

/**
 * 监听文字文本框
 */
function wordAreaListener() {
    $("#wordAreaImg").on("paste", "#wordArea1", function () {
        // 如果下拉框没选择，则不发送请求
        if(globalWordType == null || globalWordType === "") {
            alert("图片类型不能为空");
            return false;
        }
        console.log(event);
        let isChrome = false;
        if ( event.clipboardData || event.originalEvent ) {
            //not for ie11  某些chrome版本使用的是event.originalEvent
            let clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
            if ( clipboardData.items ) {
                // for chrome
                let items = clipboardData.items,
                    len = items.length,
                    blob = null;
                isChrome = true;

                //阻止默认行为即不让剪贴板内容在div中显示出来
                event.preventDefault();

                //在items里找粘贴的image,据上面分析,需要循环
                for (var i = 0; i < len; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        blob = items[i].getAsFile();
                    }
                }
                if ( blob !== null ) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        // event.target.result 即为图片的Base64编码字符串
                        var base64_str = event.target.result;
                        //可以在这里写上传逻辑 直接将base64编码的字符串上传（可以尝试传入blob对象，看看后台程序能否解析）
                        uploadImgFromPaste(base64_str, 'paste', isChrome, globalWordType, "word");
                    }
                    reader.readAsDataURL(blob);
                }
            } else {
                //for firefox
                setTimeout(function () {
                    //设置setTimeout的原因是为了保证图片先插入到div里，然后去获取值
                    var imgList = document.querySelectorAll('#tar_box img'),
                        len = imgList.length,
                        src_str = '',
                        i;
                    for ( i = 0; i < len; i ++ ) {
                        if ( imgList[i].className !== 'my_img' ) {
                            //如果是截图那么src_str就是base64 如果是复制的其他网页图片那么src_str就是此图片在别人服务器的地址
                            src_str = imgList[i].src;
                        }
                    }
                    uploadImgFromPaste(src_str, 'paste', isChrome, globalWordType, "word");
                }, 1);
            }
        } else {
            //for ie11
            setTimeout(function () {
                var imgList = document.querySelectorAll('#tar_box img'),
                    len = imgList.length,
                    src_str = '',
                    i;
                for ( i = 0; i < len; i ++ ) {
                    if ( imgList[i].className !== 'my_img' ) {
                        src_str = imgList[i].src;
                    }
                }
                uploadImgFromPaste(src_str, 'paste', isChrome, globalWordType, "word");
            }, 1);
        }
    });
}

function uploadImgFromPaste (file, type, isChrome, uploadType, requestType) {
    var formData = new FormData();
    formData.append('image', file);
    formData.append("type", uploadType);
    formData.append('submission-type', type);

    wait("正在处理中......");

    var xhr = new XMLHttpRequest();
    if(requestType === "image") {
        xhr.open('POST', resoveImage);
    } else if(requestType === "word"){
        xhr.open('POST', resoveWord);
    }
    xhr.onload = function () {
        if ( xhr.readyState === 4 ) {
            if ( xhr.status === 200 ) {
                hideWait();
                // 处理返回结果
                resoveResult(file,xhr.responseText);
            } else {
                hideWait();
                alert(xhr.responseText);
            }
        };
    };
    xhr.onerror = function (e) {
        alert(xhr.responseText);
    }
    xhr.send(formData);
}

/**
 * 处理返回结果
 */
function resoveResult(file,data) {
    let result;
    console.log(data);
    // 展示结果
    var resultEntity = eval("(" + data + ")");
    if(resultEntity.code === '200') {
        if(resultEntity.type === 'image') { // 图片识别
            // 显示粘贴的图片
            $("#imageAreaImg").html("<img src=\""+file+"\">");
            result = eval("(" + resultEntity.data + ")");
            let i = 0;
            for (let d of result) {
                // 根据返回的json，按格式生成展示结果
                let resultText = generatorResult(d);
                if(i===0) {
                    $("#imageArea2").val(resultText);
                } else if(0<i<4) {
                    $("#imageResult"+i).html(resultText);
                } else if(i>=4) {
                    return;
                }
                i++;
            }
        } else if(resultEntity.type === 'word') { // 文字识别
            // 显示粘贴的图片
            $("#wordAreaImg").html("<img src=\""+file+"\">");
            result = eval("(" + resultEntity.data + ")");
            let i = 0;
            let msg = "";
            for(var key in result) {
                msg += result[i].words + "\r\n";
                i++;
            }
            $("#wordArea2").val(msg);
        }
    } else if(resultEntity.code === '500') {
        alert("错误！\r\n" + resultEntity.data);
    }
}

/**
 * 根据百度返回的json数据，按格式显示内容
 */
function generatorResult(data) {
    var result = "";
    for(var key in data) {
        var name = translateCode(key);
        result += name + ":" + data[key] + " \r\n";
    }
    return result;
}

/**
 * 监听重置按钮
 */
function resetBtnListener() {
    $(".imageResetBtn").click(function () {
        $("#imageTypeBtn").html("通用物体识别 <span class=\"caret\"></span>");// 类型下拉框
        $("#imageAreaImg").html("<textarea id=\"imageArea1\" placeholder=\"此处粘贴图片\" style=\"width: 97%; height: 250px;\"></textarea>");// 粘贴图片文本框
        $("#imageArea2").val("");// 结果显示文本框
        // 其他结果显示
        $("#imageResult1").html("...");
        $("#imageResult2").html("...");
        $("#imageResult3").html("...");

        // 图片类型标志
        globalImageType = "1";
    });

    $(".wordResetBtn").click(function () {
        $("#wordTypeBtn").html("通用文字识别 <span class=\"caret\"></span>");// 类型下拉框
        $("#wordAreaImg").html("<textarea id=\"wordArea1\" placeholder=\"此处粘贴图片\" style=\"width: 97%; height: 450px;\"></textarea>");// 粘贴图片文本框
        $("#wordArea2").val("");// 结果显示文本框

        // 图片类型标志
        globalWordType = "1";
    });


}