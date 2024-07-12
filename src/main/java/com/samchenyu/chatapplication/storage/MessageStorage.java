package com.samchenyu.chatapplication.storage;

import com.samchenyu.chatapplication.model.Message;

import java.util.Map;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.ArrayList;

public class MessageStorage {
    private static Map<String, List<Message>> messages = new LinkedHashMap<>();
    private static MessageStorage instance;


    public static synchronized MessageStorage getInstance() {
        if (instance == null) {
            instance = new MessageStorage();
        }
        return instance;
    }

    public List<Message> getMessages(String username1, String username2) {



        List<Message> result = new ArrayList<>();

        // fetch the last 20 messages
        int count = 0;

        return result;
    }



}
