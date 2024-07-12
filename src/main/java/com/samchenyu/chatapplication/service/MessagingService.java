package com.samchenyu.chatapplication.service;


import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.samchenyu.chatapplication.model.*;
import com.samchenyu.chatapplication.storage.*;



@Service
@AllArgsConstructor
public class MessagingService {

    private final MessageStorage messageStorage = MessageStorage.getInstance();
    private final UserStorage userStorage = UserStorage.getInstance();






}
