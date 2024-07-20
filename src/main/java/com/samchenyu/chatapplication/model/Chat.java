package com.samchenyu.chatapplication.model;

import lombok.Data;


import java.util.List;
import java.util.ArrayList;
@Data
public class Chat {

    private String chatID;
    private List<User> participants = new ArrayList<>();
    private List<Message> messages = new ArrayList<>();

    public void addMessage(Message message) {
        messages.add(message);
    }

    public void addParticipant(User user) {
        if (participants == null) {
            participants = new ArrayList<>();
        }
        participants.add(user);
    }

}
