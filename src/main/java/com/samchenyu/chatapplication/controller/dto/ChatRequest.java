package com.samchenyu.chatapplication.controller.dto;

import lombok.Data;
import com.samchenyu.chatapplication.model.User;

/*
    * Data Transfer Object for ChatRequest
    * Used for requesting a chat with a recipient
 */


@Data
public class ChatRequest {
    private User user;
    private String recipient;
}
