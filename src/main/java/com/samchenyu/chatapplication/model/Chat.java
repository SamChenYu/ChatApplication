package com.samchenyu.chatapplication.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.ArrayList;


@Entity
@Table(name = "chat")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Chat {


    @Id
    @Column(name = "chatID")
    private String chatID;

    @ElementCollection
    @CollectionTable(name = "participants", joinColumns = @JoinColumn(name = "chatID"))
    @Column(name="username")
    private List<String> participants = new ArrayList<>(); // List of usernames - don't want User because we don't want to transmit passwords and authTokens out

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference // Manage references for serialization
    private List<Message> messages = new ArrayList<>();

    @Column(name = "currentMessageID")
    private int currentMessageID = -1; // keeps track of the messagesSize (used for updating the sockets)

    public void setChatID() {
        this.chatID = java.util.UUID.randomUUID().toString();
    }


    public void addMessage(Message message) {
        if (messages == null) {
            messages = new ArrayList<>();
        }
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
