package com.samchenyu.chatapplication.storage;

import com.samchenyu.chatapplication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Repository extends JpaRepository<User, Long> {
}
