package com.samchenyu.chatapplication.service;


import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.samchenyu.chatapplication.model.*;
import com.samchenyu.chatapplication.storage.*;

import java.util.List;
import java.util.UUID;



@Service
@AllArgsConstructor
public class MessagingService {

    private final UserStorage userStorage = UserStorage.getInstance();
    private final ChatStorage chatStorage = ChatStorage.getInstance();

    public Chat connectToChat(User user1, User user2) {
        Chat chat = chatStorage.getInstance().getChat(user1, user2);
        return chat;
    }

    public List<Chat> getChatList(User user) {
        return chatStorage.getInstance().getChatList(user);
    }

    public Chat sendMessage(String chatID ,Message message) {
        if(message == null) {
            return null;
        }
        Chat chat = chatStorage.getInstance().getChatByID(chatID);
        chat.addMessage(message);

        return chat;
    }

    public UserStorage getUserStorage() {
        return userStorage.getInstance();
    }






}
