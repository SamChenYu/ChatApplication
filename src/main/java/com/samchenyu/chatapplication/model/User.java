package com.samchenyu.chatapplication.model;

import lombok.Data;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @Column(name = "username")
    private String username;
    @Column(name = "authToken")
    private String authToken;
    @Column(name = "email")
    private String email;
    @Column(name = "password")
    private String password;
}
