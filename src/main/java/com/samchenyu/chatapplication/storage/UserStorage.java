package com.samchenyu.chatapplication.storage;

import java.util.Map;
import java.util.HashMap;

public class UserStorage {

    private static Map<String, String> users = new HashMap<>();
    private static UserStorage instance;

    private UserStorage() {
        users.put("user1", "password1");
    }

    public static synchronized UserStorage getInstance() {
        if (instance == null) {
            instance = new UserStorage();
        }
        return instance;
    }

    public boolean login(String username, String password) {
        return users.containsKey(username) && users.get(username).equals(password);
    }

}
