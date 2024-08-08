package com.samchenyu.chatapplication.storage;

import com.samchenyu.chatapplication.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, String> {

    @Query("SELECT c FROM Chat c JOIN c.participants p WHERE p = :username")
    List<Chat> findChatsByParticipant(@Param("username") String username);

    @Query("SELECT c FROM Chat c JOIN c.participants p1 JOIN c.participants p2 WHERE p1 = :username1 AND p2 = :username2")
    Optional<Chat> findByParticipants(@Param("username1") String u1, @Param("username2") String u2);


}
