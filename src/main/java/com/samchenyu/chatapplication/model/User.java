package com.samchenyu.chatapplication.model;

import lombok.Data;

import java.util.Map;
import java.util.HashMap;

@Data
public class User {
    private String authToken;
    private String email;
    private String username;
    private String password;
}
