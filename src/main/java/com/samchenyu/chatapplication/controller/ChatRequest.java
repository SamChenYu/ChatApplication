package com.samchenyu.chatapplication.controller;

import lombok.Data;
import com.samchenyu.chatapplication.model.User;

/*
    * Previously for a POST request, you can't add two objects in the request body
    * Originally: User user, String recipient
 */


@Data
public class ChatRequest {
    private User user;
    private String recipient;
}
