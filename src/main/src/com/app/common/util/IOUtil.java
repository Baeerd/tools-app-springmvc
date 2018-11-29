package com.app.common.util;

import java.io.UnsupportedEncodingException;
import java.util.ResourceBundle;

public class IOUtil {

    private static String path = "baidu";

    /**
     * 加载配置文件内容，默认加载baidu.properties
     * @param key
     * @return
     */
    public static String getProp(String key) {
        ResourceBundle resource = ResourceBundle.getBundle(path);
        //获取key对应的value值
        String result = resource.getString(key);
        if(result != null && !"".equals(result)) {
            try {
                return new String(result.getBytes("ISO-8859-1"), "GBK");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public void initPropPath(String path) {
        this.path = path;
    }
}
