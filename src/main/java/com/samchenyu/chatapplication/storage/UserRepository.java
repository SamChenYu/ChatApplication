package com.samchenyu.chatapplication.storage;

import com.samchenyu.chatapplication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, String> {

    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username); // Returns the user object

}
