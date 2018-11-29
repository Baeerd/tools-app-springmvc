package test;

import com.baidu.aip.imageclassify.AipImageClassify;
import org.json.JSONObject;

import java.util.HashMap;

public class BaiduImage {
    //设置APPID/AK/SK
    public static final String APP_ID = "14647734";
    public static final String API_KEY = "zbwbdce1cUVGqOWIVGjEtVpf";
    public static final String SECRET_KEY = "YE5lN09j5NQrIs0Oz1oZ7IIqG3Wi2Zh8";

    public static void main(String[] args) {
        // 初始化一个AipImageClassifyClient
        AipImageClassify client = new AipImageClassify(APP_ID, API_KEY, SECRET_KEY);

        // 可选：设置网络连接参数
        client.setConnectionTimeoutInMillis(2000);
        client.setSocketTimeoutInMillis(60000);

        // 可选：设置代理服务器地址, http和socket二选一，或者均不设置
//        client.setHttpProxy("proxy_host", proxy_port);  // 设置http代理
//        client.setSocketProxy("proxy_host", proxy_port);  // 设置socket代理

        // 可选：设置log4j日志输出格式，若不设置，则使用默认配置
        // 也可以直接通过jvm启动参数设置此环境变量
//        System.setProperty("aip.log4j.conf", "path/to/your/log4j.properties");

        // 调用接口
        HashMap<String, String> options = new HashMap<String, String>();
        options.put("baike_num", "5");

        String path = "C:\\Users\\10844\\Desktop\\3.png";
        JSONObject res = client.advancedGeneral(path, options);
        System.out.println(res.toString(2));

    }
}
