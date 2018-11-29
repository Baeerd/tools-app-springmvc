package com.app.common.exception;

public class MessageException extends RuntimeException {

    public MessageException(String message) {
        super(message);
    }

    public MessageException() {
        super();
    }
}
