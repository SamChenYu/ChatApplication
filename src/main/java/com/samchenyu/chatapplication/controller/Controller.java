package com.samchenyu.chatapplication.controller;


import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.samchenyu.chatapplication.service.MessagingService;
import com.samchenyu.chatapplication.model.*;

import java.util.List;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping
public class Controller {

    private final MessagingService messagingService;
    private final SimpMessagingTemplate simpMessagingTemplate;


    @PostMapping("/login")
    public ResponseEntity<List<Chat>> login(@RequestBody User user) {
        // User Login Endpoint
        boolean success = messagingService.getUserStorage().login(user.getUsername(), user.getPassword());

        if (success) {
            System.out.println("Login success");
            List<Chat> chat = messagingService.getChatList(user);
            return ResponseEntity.ok(chat);
        } else {
            System.out.println("Login failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    /* address: localhost:8080/login
        sample json to send in postman
        {
            "username": "user1",
            "password": "user1"
        }
     */


    @PostMapping("/sendmessage")
    public ResponseEntity<Chat> sendMessage(@RequestBody Message message) {
        // User Sending Message Endpoint
        Chat chat = messagingService.sendMessage(message.getChatID(), message);
        if (chat == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        simpMessagingTemplate.convertAndSend("/topic/" + message.getChatID(), chat); // sends the message to the socket
        return ResponseEntity.ok(chat);
    }

    /* address: localhost:8080/sendmessage
        sample json to send in postman
        {
            "from": "user1",
            "recipient": "user2",
            "text": "this is a new message",
            "time": "12:00",
            "chatID": "chat1"
        }
     */

    @PostMapping("/newchat")
    public ResponseEntity<Chat> newChat(@RequestBody ChatRequest chatRequest) {
        // Search For Users Endpoint
        // If a chat object already exists, it will be returned, otherwise
        // a new chat object will be created and pushed to the sockets of the two users
        User recipientUser = new User();
        recipientUser.setUsername(chatRequest.getRecipient());
        Chat chat = messagingService.connectToChat(chatRequest.getUser(), recipientUser);

        if(chat == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        // to prevent an infinite loop of notifications, we should only send the notification if the chat is new
        if(chat.getMessages().isEmpty()) {
            System.out.println("update chats sent for " + recipientUser.getUsername());
            // The socket expects a list of users, but this endpoint returns chats, so we have to convert it
            List<User> userList = messagingService.getUserList(recipientUser);
            simpMessagingTemplate.convertAndSend("/topic/chatlist/" + recipientUser.getUsername(), userList);
            // send out to the current user too
            userList = messagingService.getUserList(chatRequest.getUser());
            simpMessagingTemplate.convertAndSend("/topic/chatlist/" + chatRequest.getUser().getUsername(), userList);
        }
        return ResponseEntity.ok(chat);
    }
    /* address: localhost:8080/newchat
        sample json to send in postman
        {
            "user": {
                "username": "user1",
                "password": "user1"
            },
            "recipient": "user2"
        }
     */


    @PostMapping("/loadchat")
    public ResponseEntity<Chat> loadChat(@RequestBody ChatRequest chatRequest) {
        // If a socket sends chatlist updates, the frontend will call this endpoint
        // Because it already knows the chat object exists (there is no error handling)
        // This endpoint is also used to prevent infinite loops of loading the same chat (/newchat sends socket updates)
        User recipientUser = new User();
        recipientUser.setUsername(chatRequest.getRecipient());
        Chat chat = messagingService.connectToChat(chatRequest.getUser(), recipientUser);

        if(chat == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.ok(chat);
    }
    /* address: localhost:8080/loadchat
        sample json to send in postman
        {
            "user": {
                "username": "user1",
                "password": "user1"
            },
            "recipient": "user2"
        }
     */


    @PostMapping("/chatlist")
    public ResponseEntity<List<User>> chatList(@RequestBody User user) {
        // Endpoint to get the list of users the current user is chatting with
        List<User> userList = messagingService.getUserList(user);
        return ResponseEntity.ok(userList);
    }
    /* address: localhost:8080/chatlist
        sample json to send in postman
        {
            "username": "user1",
            "password": "user1"
        }
     */

    @PostMapping("/adduser")
    public ResponseEntity<Void> addUser(@RequestBody User user) {
        // Registration Endpoint
        messagingService.addUser(user);
        System.out.println("user added");
        return ResponseEntity.ok().build();
    }
    /* address: localhost:8080/adduser
        sample json to send in postman
        {
            "email": "user1@gmail.com",
            "username": "user1",
            "password": "user1"
        }
     */

}