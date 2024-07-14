package com.samchenyu.chatapplication.storage;

import com.samchenyu.chatapplication.model.Chat;
import com.samchenyu.chatapplication.model.Message;
import com.samchenyu.chatapplication.model.User;

import lombok.Data;

import java.util.List;
import java.util.ArrayList;

@Data
public class ChatStorage {

    private static List<Chat> chats = new ArrayList<>();
    private static ChatStorage instance;

    private ChatStorage() {
        Chat chat1 = new Chat();
        chat1.setChatID("chat1");
        chats.add(chat1);
    }

    public static synchronized ChatStorage getInstance() {
        if (instance == null) {
            instance = new ChatStorage();
            addSampleChat();

        }
        return instance;
    }

    public static void addSampleChat() {
        Chat chat1 = new Chat();
        chat1.setChatID("chat1");
        chats.add(chat1);
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
        chat1.addMessage(message1);

        Message message2 = new Message();
        message2.setFrom("user2");
        message2.setRecipient("user1");
        message2.setText("Hi");
        message2.setTime("12:01");
        chat1.addMessage(message2);

        chats.add(chat1);
    }

    public void addChat(Chat chat) {
        chats.add(chat);
    }


    public List<Chat> getChatList(User user) {
        List<Chat> userChats = new ArrayList<>();
        String username = user.getUsername();
        for (Chat chat : chats) {
            List<User> participants = chat.getParticipants();
            for(User participant : participants) {
                if (participant.getUsername().equals(username)) {
                    userChats.add(chat);
                }
            }
        }
        return userChats;
    }

    public Chat getChat(User user1, User user2) {
        for (Chat chat : chats) {
            if (chat.getParticipants().contains(user1) && chat.getParticipants().contains(user2)) {
                return chat;
            }
        }
        return null;
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
