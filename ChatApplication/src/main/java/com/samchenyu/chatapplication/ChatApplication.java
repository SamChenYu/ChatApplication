package com.samchenyu.chatapplication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChatApplication {

    public static void main(String[] args) {

        SpringApplication.run(ChatApplication.class, args);
        System.out.println("Server running! :3");
    }

}
