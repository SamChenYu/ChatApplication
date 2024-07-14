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

    @PostMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello World");
    }
    // address: localhost:8080/hello

}
