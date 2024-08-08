package com.samchenyu.chatapplication.storage;

import com.samchenyu.chatapplication.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

}