package com.app.image.controller;

import com.app.common.entity.Result;
import com.app.image.service.ImageService;
import com.app.text.entity.JsonEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import java.util.Map;

@Controller
@RequestMapping("/image")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @RequestMapping("/resoveImage")
    public @ResponseBody Result resoveImage(@RequestParam Map<String, String> params) {
        Result result = new Result();
        String jsonData = imageService.resoveImage(params);
        result.setName(params.get("type")); // TODO 名称暂存符号
        result.setCode("200");
        result.setLen("3");
        result.setType("image");
        result.setData(jsonData);
        return result;
    }

    @RequestMapping("/resoveWord")
    public @ResponseBody Result resoveWord(@RequestParam Map<String, String> params) {
        Result result = new Result();
        String jsonData = imageService.resoveWord(params);
        result.setName(params.get("type")); // TODO 名称暂存符号
        result.setCode("200");
        result.setType("word");
        result.setData(jsonData);
        return result;
    }
}
