package com.app.common.interceptor;

import com.alibaba.fastjson.JSONObject;
import com.app.common.entity.Result;
import com.app.common.exception.MessageException;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 过滤MessageException
 * 如果存在，将信息返回给前台
 */
public class MessageInterception implements HandlerExceptionResolver {
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object o, Exception e) {
        ModelAndView mv = new ModelAndView();

        if(e instanceof MessageException){
            try {
                response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
                response.setCharacterEncoding("UTF-8");
                response.setHeader("Cache-Control", "no-cache, must-revalidate");
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(JSONObject.toJSONString(getExceptionInfo(e)));
            } catch (Exception e1) {
                e1.printStackTrace();
            }
        }
        return mv;
    }

    private Result getExceptionInfo(Exception e) {
        Result result = new Result();
        String jsonData = e.getMessage();
        result.setCode("500");
        result.setData(jsonData);
        return result;
    }

}
