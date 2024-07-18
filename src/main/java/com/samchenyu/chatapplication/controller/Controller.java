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
        Chat chat = messagingService.sendMessage(message.getChatID(), message);
        if (chat == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        // sends the message to the socket
        simpMessagingTemplate.convertAndSend("/topic/" + message.getChatID(), message);
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
        // this function is used for both creating a new chat object and connecting to an existing chat object
        User recipientUser = new User();
        recipientUser.setUsername(chatRequest.getRecipient());
        Chat chat = messagingService.connectToChat(chatRequest.getUser(), recipientUser);
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

    @PostMapping("/chatlist")
    public ResponseEntity<List<User>> chatList(@RequestBody User user) {
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




    @PostMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello World");
    }
    // address: localhost:8080/hello

}
