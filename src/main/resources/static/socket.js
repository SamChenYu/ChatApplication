let url = 'http://localhost:8080'; // server address
let stompClient;

function connectToSocket(currentChatID) {
    console.log("Connecting to chat with ID: " + currentChatID);
    let socket = new SockJS(url + "/message");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function(frame) {
        console.log("Connected: " + frame);
        stompClient.subscribe("/topic/" + currentChatID, function(response) {
            let data = JSON.parse(response.body);
            console.log("Data received: ", data);
            clearChat();
            displayMessages(data);
        });
    }, function(error) {
        console.error("STOMP error: ", error);
    });
}
