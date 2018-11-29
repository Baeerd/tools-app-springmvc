package com.app.text.controller;

import com.app.text.entity.JsonEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@RequestMapping("/testController")
@Controller
public class TestController {

    @RequestMapping("/test")
    public @ResponseBody JsonEntity test() {
        JsonEntity jsonEntity = new JsonEntity();
        jsonEntity.setKey("123123123");
        jsonEntity.setValue("value2123123123");
        List<String> values = new ArrayList<String>();
        values.add("aaaaa");
        values.add("bbbbb");
        jsonEntity.setValues(values);
        return jsonEntity;
    }
}
