package com.samchenyu.chatapplication.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.samchenyu.chatapplication.model.*;
import com.samchenyu.chatapplication.storage.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MessagingService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;



    // USER SERVICE

    public void addUser(User user) {
        if(userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("User already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public boolean login(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String dbPassword = user.getPassword();
            return passwordEncoder.matches(password, dbPassword);
        } else {
            System.out.println("User not found");
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

        Optional<Chat> chat = chatRepository.findByParticipants(user1.getUsername(), user2.getUsername());
        if(chat.isPresent()) {
            System.out.println("Chat already exists with ID " + chat.get().getChatID());
            return chat.get();
        } else {
            // Create a new chat between the two users
            Chat newChat = new Chat();
            newChat.setChatID();
            System.out.println("New chat created with ID " + newChat.getChatID());
            newChat.addParticipant(user1);
            newChat.addParticipant(user2);
            chatRepository.save(newChat);
            return newChat;
        }
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
        Optional<Chat> optional = chatRepository.findById(chatID);

        if(optional.isPresent()) {
            Chat chat = optional.get();
            int currentMessageID = chat.getCurrentMessageID();
            chat.setCurrentMessageID(currentMessageID + 1);
            chat.addMessage(message);
            chatRepository.save(chat);
            int size = chat.getMessages().size(); // force the lazy load
            return chat;

        } else {
            return null;
        }
    }



    public List<Message> getMessagesSince(String chatID, int messageID) {


        Optional<Chat> optional = chatRepository.findById(chatID);

        if(optional.isPresent()) {
            Chat chat = optional.get();
            List<Message> messages = chat.getMessages();
            List<Message> messagesSince = new ArrayList<>();
            for(int i=messageID+1; i<messages.size(); i++) {
                messagesSince.add(messages.get(i));
            }
            return messagesSince;
        } else {
            return null;
        }
    }

    // USER DETAILS SERVICE INTERFACE
    // This method is used by the JWT filter to load user details
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities("USER")
                .build();
        return userDetails;
    }


    public void setAuthToken(String username, String authToken) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User with username " + username + " not found"));
        user.setAuthToken(authToken);
        userRepository.save(user);
    }
}
