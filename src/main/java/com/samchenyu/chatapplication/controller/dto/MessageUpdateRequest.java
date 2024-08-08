package com.samchenyu.chatapplication.controller.dto;

import lombok.Data;

/*
    * Data Transfer Object for MessageUpdateRequest
    * Used for updating a chat's messages by only sending the most recent messages
 */

@Data
public class MessageUpdateRequest {
    private String username;
    private String authToken;
    private String chatID;
    private int messageID;
}
