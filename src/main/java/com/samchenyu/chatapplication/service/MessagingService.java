package com.samchenyu.chatapplication.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.samchenyu.chatapplication.model.*;
import com.samchenyu.chatapplication.storage.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MessagingService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ChatRepository chatRepository;



    // USER SERVICE

    public void addUser(User user) {
        userRepository.save(user);
    }

    public String newUUIDAuth(User user) {
        String username = user.getUsername();
        String newUUID = UUID.randomUUID().toString();

        User existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User with username " + username + " not found"));
        existingUser.setAuthToken(newUUID);
        userRepository.save(existingUser);

        return newUUID;
    }


    public boolean login(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return user.getPassword().equals(password);
        } else {
            return false;
        }
    }

    public boolean checkAuthToken(String username, String authToken) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return user.getAuthToken().equals(authToken);
        } else {
            return false;
        }
    }


    public void logout(String username) {
        // reset the authtoken
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User with username " + username + " not found"));
        user.setAuthToken(null);
        userRepository.save(user);
    }





    // CHAT SERVICE

    public Chat connectToChat(User user1, User user2) {
        // check if the users exist in the first place
        if(!userRepository.existsByUsername(user1.getUsername()) || !userRepository.existsByUsername(user2.getUsername())) {
            return null;
        }
        return chatRepository.findByParticipants(user1.getUsername(), user2.getUsername())
                .orElseThrow(() -> new RuntimeException("Chat with " + user1.getUsername() + " and " + user2.getUsername() + " not found"));
    }


    public List<Chat> getChatList(User user) {
        return chatRepository.findChatsByParticipant(user.getUsername());
    }

    public List<User> getUserList(User user) {
        // Returns a list of users that the current user has chats with
        List<Chat> chats = chatRepository.findChatsByParticipant(user.getUsername());
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
        Chat chat = chatRepository.findById(chatID)
                .orElseThrow(() -> new RuntimeException("Chat with ID " + chatID + " not found"));
        chat.addMessage(message);
        return chat;
    }



    public List<Message> getMessagesSince(String chatID, int messageID) {

        Chat chat = chatRepository.findById(chatID)
                .orElseThrow(() -> new RuntimeException("Chat with ID " + chatID + " not found"));
        List<Message> chatMessages = chat.getMessages();

        List<Message> messages = new ArrayList<>();
        for(int i=messageID+1; i<chatMessages.size(); i++) {
            messages.add(chatMessages.get(i));
        }
        return messages;
    }


}
