let url = 'http://localhost:8080'; // server address
let stompClient;

connectToSocket(currentChatID);
function connectToSocket(currentChatID) {
    console.log("Connecting to chat with ID: " + currentChatID);
    let socket = new SockJS(url + "/message");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function(frame) {

        console.log("Connected: " + frame);
        if(!(currentChatID === null)) {
            // Subscribe to the chat topic
            // This will update the chat window with new incoming / outcoming messages
            stompClient.subscribe("/topic/" + currentChatID, function (response) {
                let data = JSON.parse(response.body);
                clearChat();
                displayMessages(data);
            });
        }

        // Subscribe to the chatlist topic
        // When another user creates a chat with you, this will notify you
        console.log("Subscribing to chatlist topic for user: " + username);
        stompClient.subscribe("/topic/chatlist/" + username, function(response) {
            let data = JSON.parse(response.body);
            console.log("New chat notification: ", data);
            chatSocketUpdate(data);
        });



    }, function(error) {
        console.error("STOMP error: ", error);
    });
}
