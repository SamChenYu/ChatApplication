let url = 'http://localhost:8080'; // server address
let stompMessageClient;
let stompChatClient;

/*
    connectToMessageSocket()
        When a user clicks on a chat, they are subscribed to the topic of that chat
        for updates. This will update the chat window with new incoming / outcoming messages.
        There will be only one connection to a chat at a time and changes if the user clicks on
        another chat.

    connectToChatSocket()
        When a user logs in, they are subscribed to their own chatlist topic. This will notify
        them of any changes to their chatlist. For example, if another user creates a chat
        with them, it will update in their chatlist.
        There will be only one connection when the user logs in
 */


connectToChatSocket();

function connectToMessageSocket(currentChatID) {

    // If there is a previous connection to a chat, disconnect it
    // This is to prevent being redirected to another chat if there is an incoming message
    // For further development, this can be used to notify the user of other chat's messages -> Unread messages
    if (stompMessageClient && stompMessageClient.connected) {
        console.log("Disconnecting previous message client");
        stompMessageClient.disconnect(() => {
        });
    }

    console.log("Connecting to chat with ID: " + currentChatID);
    let socket = new SockJS(url + "/message");
    stompMessageClient = Stomp.over(socket);

    stompMessageClient.connect({}, function(frame) {

        console.log("Connected: " + frame);
        // Subscribe to the chat topic
        // This will update the chat window with new incoming / outcoming messages
        stompMessageClient.subscribe("/topic/" + currentChatID, function (response) {
            let data = JSON.parse(response.body);
            clearChat();
            displayMessages(data, currentRecipient);
        });

    }, function(error) {
        console.error("STOMP error in message: ", error);
    });
}




function connectToChatSocket() {
    let socket = new SockJS(url + "/message");
    stompChatClient = Stomp.over(socket);

    stompChatClient.connect({}, function(frame) {

        console.log("Connected: " + frame);
        // Subscribe to the chatlist topic
        // When another user creates a chat with you, this will notify you
        console.log("Subscribing to chatlist topic for user: " + username);
        stompChatClient.subscribe("/topic/chatlist/" + username, function(response) {
            let data = JSON.parse(response.body);
            console.log("New chat notification: ", data);
            displayChats(data, true);
            loadMessages();
        });

    }, function(error) {
        console.error("STOMP error in chatlist: ", error);
    });
}


