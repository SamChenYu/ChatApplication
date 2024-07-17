package com.samchenyu.chatapplication.storage;

import com.samchenyu.chatapplication.model.User;

import java.util.List;
import java.util.ArrayList;

public class UserStorage {

    private static List<User> users = new ArrayList<>();
    private static UserStorage instance;

    private UserStorage() {
        User user1 = new User();
        user1.setUsername("user1");
        user1.setPassword("user1");

        User user2 = new User();
        user2.setUsername("user2");
        user2.setPassword("user2");

        User user3 = new User();
        user3.setUsername("user3");
        user3.setPassword("user3");


        users.add(user1);
        users.add(user2);
        users.add(user3);
    }

    public static synchronized UserStorage getInstance() {
        if (instance == null) {
            instance = new UserStorage();
        }
        return instance;
    }

    public boolean login(String username, String password) {
        for (User user : users) {
            if (user.getUsername().equals(username) && user.getPassword().equals(password)) {
                return true;
            }
        }
        return false;
    }

}
