package com.app.image.service.impl;

import com.app.common.exception.MessageException;
import com.app.common.util.IOUtil;
import com.app.image.service.ImageService;
import com.baidu.aip.imageclassify.AipImageClassify;
import com.baidu.aip.ocr.AipOcr;
import org.apache.commons.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class ImageServiceImpl implements ImageService {

    static {
        imageClient = initAipImageClassify();
        wordClient = initAopOcr();
    }

    /**
     * 图像识别
     * @param params 前台传递参数
     * @return 百度识别返回的json字符串
     */
    public String resoveImage(Map<String, String> params) {

        // 获取图片信息
        byte[] imageData = getImageData(params.get("image"));

        // 调用接口
        Integer type = Integer.parseInt(params.get("type")==null?"0":params.get("type"));
        // 设置参数
        HashMap<String, String> options = new HashMap<String, String>();
        try{
            switch (type) {
                case 0 : // 类型为空
                    throw new MessageException("所选类型为空");
                case 1 : // 通用物体识别
                    return rResultI(imageClient.advancedGeneral(imageData, options));
                case 2 : // 菜品识别
                    options.put("top_num", "4");
                    return rResultI(imageClient.dishDetect(imageData, options));
                case 3 : // 车型识别
                    options.put("top_num", "4");
                    return rResultI(imageClient.carDetect(imageData, options));
                case 4 : // logo商标识别
                    return rResultI(imageClient.logoSearch(imageData, options));
                case 5 : // 动物识别
                    return rResultI(imageClient.animalDetect(imageData, options));
                case 6 : // 植物识别
                    return rResultI(imageClient.plantDetect(imageData, options));
                default: // 没有此类型
                    throw new MessageException("没有此类型");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new MessageException(e.getMessage());
        }
    }

    /**
     * 文字识别
     * @param params 前台传递参数
     * @return 百度识别返回的json字符串
     */
    public String resoveWord(Map<String, String> params) {

        // 获取图片信息
        byte[] imageData = getImageData(params.get("image"));

        // 调用接口
        Integer type = Integer.parseInt(params.get("type")==null?"0":params.get("type"));

        // 设置参数
        HashMap<String, String> options = new HashMap<String, String>();

        try{
            switch (type) {
                case 0 : // 类型为空
                    throw new MessageException("所选类型为空");
                case 1 : //  通用文字识别
                    options.put("language_type", "CHN_ENG");
                    options.put("detect_direction", "true");
                    options.put("detect_language", "true");
                    options.put("probability", "true");
                    return rResultW(wordClient.basicGeneral(imageData, options));
                case 2 : // 通用文字识别（高精度版）
                    options.put("detect_direction", "true");
                    options.put("probability", "true");
                    return rResultW(wordClient.basicAccurateGeneral(imageData, options));
                case 3 : // 网络图片文字识别
                    options.put("detect_direction", "true");
                    options.put("detect_language", "true");
                    return rResultW(wordClient.webImage(imageData, options));
                case 4 : // 银行卡识别
                    return rResultW(wordClient.bankcard(imageData, options));
                case 5 : // 表格文字识别
                    String result = rResultW(wordClient.tableRecognitionAsync(imageData, options));
                    //options.put("result_type", "json");// 期望获得的结果类型（默认为excel）
                    String requestId = getRequestId(result);
                    return rResultW(wordClient.tableResultGet(requestId, options));
                default: // 没有此类型
                    throw new MessageException("没有此类型");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new MessageException(e.getMessage());
        }
    }

    /**
     * 通过返回的结果，获取表格结果
     * @param result
     * @return
     */
    private String getRequestId(String result) {
        // TODO 通过表格文字识别结果返回的结果，获取下次的请求ID
        return  "";
    }

    /**
     * 将页面传递的图片信息转换成byte数组
     * @param image base64编码图片文件
     * @return
     */
    private byte[] getImageData(String image) {
        // 处理base64编码
        image = image.substring(image.indexOf(",")+1, image.length());
        return Base64.decodeBase64(image);
    }

    /**
     * 对检测结果非空判断(图像识别)
     * @param jsonObject
     * @return
     */
    private String rResultI(JSONObject jsonObject) {
        if(jsonObject.has("error_code")) {
            String error_msg = IOUtil.getProp(jsonObject.get("error_code").toString());
            System.out.println("调用接口错误：" + jsonObject.get("error_code"));
            throw new MessageException(error_msg);
        }
        return jsonObject == null ? "" : jsonObject.get("result").toString();
    }

    /**
     * 对检测结果非空判断(文字识别)
     * @param jsonObject
     * @return
     */
    private String rResultW(JSONObject jsonObject) {
        if(jsonObject.has("error_code")) {
            String error_msg = IOUtil.getProp(jsonObject.get("error_code").toString());
            System.out.println("调用接口错误：" + jsonObject.get("error_code"));
            throw new MessageException(error_msg);
        }
        return jsonObject == null ? "" : jsonObject.get("words_result").toString();
    }

    /**
     * 百度图像识别客户端
     */
    private static AipImageClassify imageClient;

    /**
     * 百度文字识别客户端
     */
    private static AipOcr wordClient;

    /**
     * 初始化百度图像识别客户端
     * @return
     */
    private static AipImageClassify initAipImageClassify() {
        //设置APPID/AK/SK
        String appId = IOUtil.getProp("image.APP_ID");
        String apiKey = IOUtil.getProp("image.API_KEY");
        String secretKey = IOUtil.getProp("image.SECRET_KEY");
        AipImageClassify client = new AipImageClassify(appId, apiKey, secretKey);
        // 可选：设置网络连接参数
        client.setConnectionTimeoutInMillis(2000);
        client.setSocketTimeoutInMillis(60000);
        return client;
    }

    /**
     * 初始化
     * @return
     */
    private static AipOcr initAopOcr() {
        //设置APPID/AK/SK
        String appId = IOUtil.getProp("image.APP_ID");
        String apiKey = IOUtil.getProp("image.API_KEY");
        String secretKey = IOUtil.getProp("image.SECRET_KEY");
        AipOcr client = new AipOcr(appId, apiKey, secretKey);
        // 可选：设置网络连接参数
        client.setConnectionTimeoutInMillis(2000);
        client.setSocketTimeoutInMillis(60000);
        return client;
    }

}
