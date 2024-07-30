package com.samchenyu.chatapplication.model;

import lombok.Data;

@Data
public class Message {

    private String from;
    private String text;
    private String recipient;
    private String time;
    private String chatID;
    private int messageID; // sequential numbering of chats
    private String authToken; // authToken


}
