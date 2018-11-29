/**
 * 加载菜单
 */
function loadMenu() {
    // 缓存cookie
    var menuContent = $(".sidebar-nav-fixed").html();
    if(menuContent == null || menuContent === "") {
        $.getJSON("data/menu.json",function (json) {
            var ul = "<ul class=\"menu\" id=\"accordion-menu-js\">";
            var id = 1;
            $.each(json, function (key, value) {
                id++;
                var num = 0;
                $.each(value, function () {
                    num ++;
                });
                ul += "<li>";
                ul += "<a href=\"javascript:void(0);\" target=\"contentIframe\"><i class=\"icon-plus\"></i>"+key+" <span class=\"badge\">"+num+"</span></a>";
                ul += "<ul id='menuLi"+id+"'>";

                $.each(value, function (name, url) {
                    ul += "<li><a href=\""+url+"\" class=\"expanded\">"+name+"</a></li>";
                });

                ul += "</ul>";
                ul += "</li>";
            });
            ul += "</ul>";
            console.log(ul);
            $(".sidebar-nav-fixed").html(ul);
        });
    }
}
//
// /**
//  * 菜单切换动画
//  * @param ulId
//  */
// function changeMenu(ulId) {
//     $("#menuLi"+ulId).toggle(200);
// }