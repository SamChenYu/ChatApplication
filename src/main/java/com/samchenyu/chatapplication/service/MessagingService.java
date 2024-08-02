package com.samchenyu.chatapplication.service;


import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.samchenyu.chatapplication.model.*;
import com.samchenyu.chatapplication.storage.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;



@Service
@AllArgsConstructor
public class MessagingService {

    private final UserStorage userStorage = UserStorage.getInstance();
    private final ChatStorage chatStorage = ChatStorage.getInstance();

    public Chat connectToChat(User user1, User user2) {
        // check if the users exist in the first place
        if (!userStorage.getInstance().userExists(user1) || !userStorage.getInstance().userExists(user2)) {
            return null;
        }
        Chat chat = chatStorage.getInstance().getChat(user1, user2);
        return chat;
    }



    public List<Chat> getChatList(User user) {
        return chatStorage.getInstance().getChatList(user);
    }

    public List<User> getUserList(User user) {
        // Returns a list of users that the current user has chats with
        List<Chat> chats = chatStorage.getInstance().getChatList(user);
        List<User> users = new ArrayList<>();
        // for each chat, get the other user
        for (Chat chat : chats) {
            List<String> participants = chat.getParticipants();
            for (String participant : participants) {
                if (!participant.equals(user.getUsername())) {
                    User user1 = new User();
                    user1.setUsername(participant);
                    users.add(user1);
                }
            }
        }
        return users;
    }

    public Chat sendMessage(String chatID ,Message message) {
        if(message == null) {
            return null;
        }
        Chat chat = chatStorage.getInstance().getChatByID(chatID);
        chat.addMessage(message);

        return chat;
    }

    public void addUser(User user) {
        userStorage.getInstance().addUser(user);
    }

    public String newUUIDAuth(User user) {
        String username = user.getUsername();
        String newUUID = UUID.randomUUID().toString();
         userStorage.getInstance().setAuthToken(username, newUUID);
         return newUUID;
    }

    public List<Message> getMessagesSince(String chatID, int messageID) {

        Chat chat = chatStorage.getInstance().getChatByID(chatID);
        List<Message> chatMessages = chat.getMessages();

        List<Message> messages = new ArrayList<>();
        for(int i=messageID+1; i<chatMessages.size(); i++) {
            messages.add(chatMessages.get(i));
        }
        return messages;
    }


    public UserStorage getUserStorage() {
        return userStorage.getInstance();
    }






}
