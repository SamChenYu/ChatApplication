package com.samchenyu.chatapplication.model;

import lombok.Data;


import java.util.List;
import java.util.ArrayList;


@Data
public class Chat {

    private String chatID;
    private List<User> participants = new ArrayList<>();

    private List<Message> messages = new ArrayList<>();
    private int currentMessageID = -1; // keeps track of the messagesSize (used for updating the sockets)

    public void addMessage(Message message) {
        currentMessageID++;
        message.setMessageID(currentMessageID);
        messages.add(message);
    }

    public void addParticipant(User user) {
        if (participants == null) {
            participants = new ArrayList<>();
        }
        participants.add(user);
    }

}
