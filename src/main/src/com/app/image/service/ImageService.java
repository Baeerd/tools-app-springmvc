package com.app.image.service;

import org.springframework.stereotype.Service;

import java.util.Map;

public interface ImageService {

    /**
     * 图像识别
     * @param params 前台传递参数
     * @return 百度识别返回的json字符串
     */
    String resoveImage(Map<String, String> params);

    /**
     * 文字识别
     * @param params
     * @return
     */
    String resoveWord(Map<String,String> params);
}
