package com.samchenyu.chatapplication.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "message")
@Data
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "messageID")
    private int messageID; // sequential numbering of chats

    @Column(name = "from")
    private String from;

    @Column(name = "text")
    private String text;

    @Column(name = "recipient")
    private String recipient;

    @Column(name = "time")
    private String time;

    @Column(name = "chatID")
    private String chatID;

    @Column(name="authToken")
    private String authToken; // authToken

    @ManyToOne
    @JoinColumn(name = "chatID", insertable = false, updatable = false)
    private Chat chat;
}
