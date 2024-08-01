# ChatApplication

## Chat Application with Spring Web Sockets
### Features:
- **Real-Time Chat:** 
  - Instant message delivery and updates using Spring WebSocket and STOMP protocol.
  - Users can send and receive messages in real time
- **Message Persistence:**
  - Messages are stored on the server, ensuring that all chat history is retained even if users disconnect or restart the application.
  - Each chat conversation is uniquely identified and messages are associated with the correct chat session.
- **Chat Sessions:**
  - Users can engage in multiple chat sessions simultaneously.
  - Chat sessions are maintained for each pair of users, ensuring that messages are delivered to the correct recipient.
- **WebSocket Integration:**
  - Utilizes WebSocket connections with SockJS and STOMP for efficient message handling and updates.
  - Supports automatic reconnections and handles connection errors.
- **Responsive Front-End:**
  - User interface is designed to be responsive and user-friendly, making it accessible on various devices.
  - Provides a clean and intuitive chat interface with support for message display and input.
  - **User Management:**
  - **Login System:**
    - Users can log in with a unique username and password.
    - Authentication is handled securely, ensuring only authorized users can access their chat sessions.
    - Provides a login interface with error handling for invalid credentials.
  - Users can connect, disconnect, and switch between different chat sessions.

### Technologies Used:
- **Frontend:** JavaScript, SockJS, STOMP
- **Backend:** Spring Boot, Spring WebSocket

[Front End Login Design](https://codepen.io/Gogila-_/pen/VwJYqxB)  
[Front End Chat Design](https://codepen.io/ThomasDaubenton/pen/QMqaBN)


<img width="1335" alt="image" src="https://github.com/user-attachments/assets/910aa7e0-cb30-4303-a42b-54a00e525a29">

<img width="1191" alt="image" src="https://github.com/user-attachments/assets/e56a7467-2753-4cc8-a366-363629d5fee2">



