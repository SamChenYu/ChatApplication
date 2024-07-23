package com.samchenyu.chatapplication.storage;

import com.samchenyu.chatapplication.model.Chat;
import com.samchenyu.chatapplication.model.Message;
import com.samchenyu.chatapplication.model.User;

import lombok.Data;

import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

@Data
public class ChatStorage {

    private static List<Chat> chats = new ArrayList<>();
    private static ChatStorage instance;


    public static synchronized ChatStorage getInstance() {
        if (instance == null) {
            instance = new ChatStorage();
            addSampleChat();

        }
        return instance;
    }


    public static void addSampleChat() {
        // for testing purposes


        // chat1 between user1 and user2
        Chat chat1 = new Chat();
        chat1.setChatID("chat1");
        User user1 = new User();
        user1.setUsername("user1");
        user1.setPassword("user1");
        chat1.addParticipant(user1);


        User user2 = new User();
        user2.setUsername("user2");
        user2.setPassword("user2");
        chat1.addParticipant(user2);

        Message message1 = new Message();
        message1.setFrom("user1");
        message1.setRecipient("user2");
        message1.setText("Hello");
        message1.setTime("12:00");
        message1.setChatID("chat1");
        chat1.addMessage(message1);

        Message message2 = new Message();
        message2.setFrom("user2");
        message2.setRecipient("user1");
        message2.setText("Hi");
        message2.setTime("12:01");
        message2.setChatID("chat1");
        chat1.addMessage(message2);

        chats.add(chat1);

        // chat2 between user1 and user3
        Chat chat2 = new Chat();
        String chatID = UUID.randomUUID().toString();
        chat2.setChatID(chatID);
        User user3 = new User();
        user3.setUsername("user3");
        user3.setPassword("user3");

        chat2.addParticipant(user1);
        chat2.addParticipant(user3);

        Message message3 = new Message();
        message3.setFrom("user1");
        message3.setRecipient("user3");
        message3.setText("wassup");
        message3.setTime("12:00");
        message3.setChatID(chatID);

        chat2.addMessage(message3);

        Message message4 = new Message();
        message4.setFrom("user3");
        message4.setRecipient("user1");
        message4.setText("bro");
        message4.setTime("12:01");
        message4.setChatID(chatID);

        chat2.addMessage(message4);


        chats.add(chat2);

    }

    public void addChat(Chat chat) {
        chats.add(chat);
    }


    public List<Chat> getChatList(User user) {
        // Returns the list of chats that the user is a participant of
        List<Chat> userChats = new ArrayList<>();
        String username = user.getUsername();

        for (Chat chat : chats) {
            for (User participant : chat.getParticipants()) {
                if (participant.getUsername().equals(username)) {
                    userChats.add(chat);
                }
            }
        }
        return userChats;
    }


    public Chat getChat(User user1, User user2) {
        // under the presumption that the two users exist already
        for (Chat chat : chats) {
            boolean user1Found = false;
            boolean user2Found = false;
            for(User participant : chat.getParticipants()) {
                if (participant.getUsername().equals(user1.getUsername())) {
                    user1Found = true;
                    continue;
                }
                if (participant.getUsername().equals(user2.getUsername())) {
                    user2Found = true;
                    continue;
                }
            }
            if (user1Found && user2Found) {
                return chat;
            }
        }

        Chat newChat = newChat(user1, user2);
        chats.add(newChat);
        return newChat;
    }

    public Chat newChat(User user1, User user2) {
        Chat chat = new Chat();
        chat.setChatID(UUID.randomUUID().toString());
        chat.getParticipants().add(user1);
        chat.getParticipants().add(user2);
        return chat;
    }

    public Chat getChatByID(String chatID) {
        for (Chat chat : chats) {
            if (chat.getChatID().equals(chatID)) {
                return chat;
            }
        }
        throw new IllegalArgumentException("Chat not found");
    }



}
