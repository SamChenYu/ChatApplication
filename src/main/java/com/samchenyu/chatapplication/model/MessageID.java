package com.samchenyu.chatapplication.model;

/*
    * This class is used to ID each message
    * In SQL we want to use the chatID and messageID as a composite key
    * so this class was used to create a primary key for both chatID and messageID
 */

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Data
@Embeddable
public class MessageID implements Serializable {
    private String chatID;
    private int messageID;
}
