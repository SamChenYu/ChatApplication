package com.samchenyu.chatapplication.config;

import com.samchenyu.chatapplication.service.MessagingService;
import lombok.AllArgsConstructor;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.HandshakeInterceptor;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.HttpStatus;

import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
@AllArgsConstructor
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

    private final MessagingService messagingService;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/message")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS()
                .setInterceptors(new HandshakeInterceptor() {

                    @Override
                    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
                        String username = request.getURI().getQuery().split("&")[0].split("=")[1];  // Assuming 'username' is the first query parameter
                        String authToken = request.getURI().getQuery().split("&")[1].split("=")[1];  // Assuming 'authToken' is the second query parameter

                        if (username == null || authToken == null) {
                            response.setStatusCode(HttpStatus.UNAUTHORIZED);
                            return false;
                        }

                        // Validate the username and token
                        if (messagingService.getUserStorage().getInstance().checkAuthToken(username, authToken)) {
                            return true;
                        }

                        response.setStatusCode(HttpStatus.UNAUTHORIZED);
                        return false;
                    }


                    @Override
                    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
                        // Do nothing
                    }
                });
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app")
                .enableSimpleBroker("/topic");
    }
}
