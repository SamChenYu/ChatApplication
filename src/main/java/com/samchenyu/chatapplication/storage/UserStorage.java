package com.samchenyu.chatapplication.storage;

import com.samchenyu.chatapplication.model.User;

import java.util.HashSet;
import java.util.HashMap;


public class UserStorage {

    private static final HashSet<String> usernameStorage = new HashSet<>();
    private static final HashMap<String, String> passwordStorage = new HashMap<>();
    private static final HashMap<String, String> emailStorage = new HashMap<>();
    private static final HashMap<String, String> UUIDAuthentication = new HashMap<>();



    private static UserStorage instance;

    private UserStorage() {

        usernameStorage.add("user1");
        passwordStorage.put("user1","user1");
        emailStorage.put("user1","user1@gmail.com");

        usernameStorage.add("user2");
        passwordStorage.put("user2","user2");
        emailStorage.put("user2","user2@gmail.com");

        usernameStorage.add("user3");
        passwordStorage.put("user3","user3");
        emailStorage.put("user3","user3@gmail.com");


        usernameStorage.add("user4");
        passwordStorage.put("user4","user4");
        emailStorage.put("user4","user4@gmail.com");

    }

    public static synchronized UserStorage getInstance() {
        if (instance == null) {
            instance = new UserStorage();
        }
        return instance;
    }

    public boolean login(String username, String password) {

        if(!usernameStorage.contains(username)) {
            return false;
        }
        return passwordStorage.get(username).equals(password);
    }

    public boolean userExists(User user) {
        return usernameStorage.contains(user.getUsername());
    }

    public boolean userAndEmailExists(User user) {

        String checkUsername = user.getUsername();
        String checkEmail  = user.getEmail();

        if(!usernameStorage.contains(checkUsername)) return false;

        return emailStorage.get(checkUsername).equals(checkEmail);
    }



    public void addUser(User user) {
        if(userAndEmailExists(user)) {
            throw new IllegalArgumentException("User or email already exists");
        }
        usernameStorage.add(user.getUsername());
        passwordStorage.put(user.getUsername(), user.getPassword());
        emailStorage.put(user.getUsername(), user.getEmail());
    }

    public void setAuthToken(String username, String UUID) {
        UUIDAuthentication.put(username,UUID);
    }

    public boolean checkAuthToken(String username, String checkUUID) {
        if(username == null || checkUUID == null) return false;
        if(!UUIDAuthentication.containsKey(username)) return false;
        return UUIDAuthentication.get(username).equals(checkUUID);
    }


    public void logout(String username) {
        UUIDAuthentication.remove(username);
    }
}
