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
        user1.setEmail("user1@gmail.com");

        User user2 = new User();
        user2.setUsername("user2");
        user2.setPassword("user2");
        user2.setEmail("user2@gmail.com");

        User user3 = new User();
        user3.setUsername("user3");
        user3.setPassword("user3");
        user3.setEmail("user3@gmail.com");

        User user4 = new User();
        user4.setUsername("user4");
        user4.setPassword("user4");
        user4.setEmail("user4@gmail.com");


        users.add(user1);
        users.add(user2);
        users.add(user3);
        users.add(user4);
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

    public boolean userExists(User user) {
        String checkUsername = user.getUsername();
        String checkEmail  = user.getEmail();
        for (User u : users) {
            if (u.getUsername().equals(checkUsername) || u.getEmail().equals(checkEmail)) {
                return true;
            }
        }
        return false;
    }

    public void addUser(User user) {
        if(userExists(user)) {
            throw new IllegalArgumentException("User already exists");
        }
        users.add(user);
    }

}
