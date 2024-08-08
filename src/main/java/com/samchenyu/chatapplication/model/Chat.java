package com.samchenyu.chatapplication.model;

import jakarta.persistence.*;
import lombok.Data;


import java.util.List;
import java.util.ArrayList;


@Entity
@Table(name = "chat")
@Data
public class Chat {

    @Id
    @Column(name = "chatID")
    private String chatID;

    @ElementCollection
    @CollectionTable(name = "participants", joinColumns = @JoinColumn(name = "chatID"))
    @Column(name="username")
    private List<String> participants = new ArrayList<>(); // List of usernames - don't want User because we don't want to transmit passwords and authTokens out

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Message> messages = new ArrayList<>();

    @Column(name = "currentMessageID")
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
        participants.add(user.getUsername());
    }

    public void addParticipant(String username) {
        if (participants == null) {
            participants = new ArrayList<>();
        }
        participants.add(username);
    }

}
