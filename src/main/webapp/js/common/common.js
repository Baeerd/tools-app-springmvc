document.write('<script src="js/common/server.js"></script>');
document.write('<script src="js/plugin/plugin.js"></script>');
document.write('<script src="js/user/format.js"></script>');
document.write('<script src="js/user/image.js"></script>');
document.write('<script src="js/util/Util.js"></script>');
document.write('<script src="js/util/Menu.js"></script>');


$(document).ready(function(){
    /**
     * 加载菜单
     */
    loadMenu();
    /**
     * 监听ESC按键事件，关闭等待框
     */
    waitBtnListener();
});

/**
 * 监听ESC按键事件，关闭等待框
 */
function waitBtnListener() {
    $(window).keydown(function (event) {
        if (event.keyCode == 27) {
            bootbox.hideAll();
        }
    });
}