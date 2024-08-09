package com.samchenyu.chatapplication.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "message")
@Data
public class Message {

    @EmbeddedId
    private MessageID messageID;

    @Column(name = "`from`") // quotations because from is a reserved keyword
    private String from;

    @Column(name = "text")
    private String text;

    @Column(name = "recipient")
    private String recipient;

    @Column(name = "`time`")
    private String time;

    @Column(name="authToken")
    private String authToken; // authToken

    @ManyToOne
    @JoinColumn(name = "chatID", insertable = false, updatable = false)
    @JsonBackReference // Avoid circular references
    private Chat chat;
}
