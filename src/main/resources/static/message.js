const username = sessionStorage.getItem("username");
const password = sessionStorage.getItem("password");
const authToken = sessionStorage.getItem("authToken");

console.log(authToken);

if(username == null || password == null || authToken == null) {
    window.location.href = "index.html";
}


let currentChatID = null;
let currentRecipient = null;
let lastLoadedMessage = -1; // Keeps track of the last message loaded to not req the whole chat

main();

function main() {

    document.title = "Messages: " + username;
    loadChats().then(r => { loadMessages(false); });

    // Add event listeners to buttons
    const sendButton = document.querySelector('.icon.send.fa.fa-paper-plane-o.clickable');
    sendButton.addEventListener('click', () => {
        sendMessage();
    });
    const inputField = document.querySelector('.write-message');
    inputField.addEventListener('keypress', (event) => {
        if(event.key === 'Enter') {
            sendMessage();
        }
    });

    const searchButton = document.querySelector('.discussions .discussion.search .searchbar input');
    searchButton.addEventListener('keypress', (event) => {
        if(event.key === 'Enter') {
            const searchValue = searchButton.value;
            searchUsers(searchValue);
            searchButton.value = '';
        }
    });

    const searchIcon = document.querySelector('.fa.fa-search');

    searchIcon.addEventListener('click', () => {
        const searchValue = searchButton.value;
        searchUsers(searchValue);
        searchButton.value = '';
    });

}

async function loadChats() {
    // FETCHES list of users from server that user has active chats with
    // PAYLOAD: User object {username, password}
    // EXPECTED RESPONSE: Array of users
    // Calls displayChats() to display the chats on the UI
    try {
        const response = await fetch("http://localhost:8080/chatlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if(response.status === 403) { // UNAUTHORIZED
            alert("Session expired. Please log in again.");
            window.location.href = "index.html";
            return;
        }
        const result = await response.json();
        if (response.ok) {
            displayChats(result, false);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.log(error);
        alert("Something went wrong in loadChats(). Please try again.");

    }
}

function displayChats(users, isSocketUpdate) {

    // Displays the chats on the browser
    // PARAMS: An array of users,
    //      isSocketUpdate: used to determine how the active chat is displayed
    //      TRUE: The active chat will be for the first recipient user in the list
    //      FALSE: The active chat messages will be loaded based on the currentRecipient

    let usersDisplayed = 0; // used to add dummy chat cards to fill up the blank space
    const chatList = document.querySelector('.discussions');
    const dummyDivs = document.querySelectorAll('.discussion.dummy');
    dummyDivs.forEach(div => {
        div.remove(); // clear the chat list by removing all divs with dummy tag
    });


    // Loop through the users and create the necessary elements
    /*
        Form for the chats card
        <div class=discussion>
            <div class="desc-contact">
                <p class="name">Megan Leib</p>
            </div>
            <div class="timer">12 sec</div>
        </div>
     */
     users.forEach(user => {

        const userDiv = document.createElement('div');
         if( (usersDisplayed === 0 && currentRecipient == null && !isSocketUpdate) || currentRecipient === user.username) {
             // (usersDisplayed === 0 && currentRecipient == null && !isSocketUpdate) -> this is the first chat to be displayed during initial load
             // currentRecipient === user.username -> a new chat was created but the user already had a chat with this user before (socket update)
             currentRecipient = user.username;
             userDiv.classList.add('discussion', 'message-active', 'dummy'); // make the current user chat active
         } else {
             userDiv.classList.add('discussion', 'dummy');
         }
        userDiv.addEventListener('click', () => {
            // Loading a chat of a user
            clearChat();
            currentRecipient = user.username;
            loadMessages(false);
            const activeChats = document.querySelectorAll('.discussion.message-active');
            activeChats.forEach(chat => {
                chat.classList.remove('message-active'); // Make sure that there are no other active chats
            });
            userDiv.classList.add('message-active');
            lastLoadedMessage = -1; // Reset the last loaded message
        });
         // Create the necessary elements
         const descContactDiv = document.createElement('div');
         descContactDiv.classList.add('desc-contact');

        const namePara = document.createElement('p');
        namePara.classList.add('name');
        namePara.textContent = user.username;

        const timerDiv = document.createElement('div');
        timerDiv.classList.add('timer');
        timerDiv.textContent = '12 sec'; // Todo: Add the time of the last message

        userDiv.appendChild(descContactDiv);
        descContactDiv.appendChild(namePara);
        userDiv.appendChild(timerDiv);

         chatList.appendChild(userDiv);

         usersDisplayed++;
    });


     // Add dummy chat cards to fill up the blank space
    for (let i = usersDisplayed; i < 7; i++) {
        const userDiv = document.createElement('div');
        userDiv.classList.add('discussion', 'dummy', 'empty');

        const descContactDiv = document.createElement('div');
        descContactDiv.classList.add('desc-contact');

        const namePara = document.createElement('p');
        namePara.classList.add('name');
        namePara.textContent = '';

        const timerDiv = document.createElement('div');
        timerDiv.classList.add('timer');
        timerDiv.textContent = '';

        userDiv.appendChild(descContactDiv);
        descContactDiv.appendChild(namePara);
        userDiv.appendChild(timerDiv);

        chatList.appendChild(userDiv);
    }
}

async function loadMessages(isSocketUpdate) {
    // FETCHES messages from the server from a single chat
    // PARAM:   isSocketUpdate -> if it's a socket update, we are sure the chat exists, therefore we can call the
    //          /loadchat endpoint. If it's not a socket update, we need to check if the chat already exists
    //          with /newchat instead
    // PAYLOAD: User object {username, password} and recipient
    // EXPECTED RESPONSE: An array of messages
    // Calls displayMessages to display the messages on the UI

    if(currentRecipient === null) return;
    // /newchat -> not sure if the chat exists (user searching)
    // /loadchat -> received from socket therefore chat exists
    const url = isSocketUpdate ? "http://localhost:8080/newchat" : "http://localhost:8080/loadchat";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                user: {
                    username,
                    password
                },
                recipient: currentRecipient
            })
        });

        if(response.status === 403) { // UNAUTHORIZED
            alert("Session expired. Please log in again.");
            window.location.href = "index.html";
            return;
        }

        // Handle the response
        const result = await response.json();
        console.log(result);
         if (response.ok) {
            clearChat();
            displayMessages(result);
            console.log('last loaded message:', lastLoadedMessage);
            currentChatID = result.chatID;
            console.log('Connecting to chatSocket :', currentChatID);
            connectToMessageSocket(currentChatID);
            return result;
        } else {
            console.error("Request failed:", result.message);
        }
    } catch (error) {
        console.log(error);
        alert("Something went wrong in loadMessages(). Please try again.");
    }
}

function displayMessages(response) {
    console.log(response);
    // Displays the messages on the browser
    // PARAMS: A chat object {chatID, recipient, messages}

    /*
        FORM for the message from the other user
          <div class="message text-only">
            <div class="message">
              <p class="text"> Hey Megan ! It's been a while</p>
                <p class="time">12:00</p>
            </div>
          </div>

          FORM for the message from the current user
          <div class="message text-only">
            <div class="response">
              <p class="text"> When can we meet ?</p>
              <p class="time">12:00</p>
            </div>
          </div>
     */

    // update the chatID and recipient


    const nameTag = document.querySelector('.currentChatName');
    nameTag.textContent = currentRecipient;

    const messagesContainer = document.querySelector('.messages-chat');
    response.messages.forEach(message => {

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'text-only');

        const messageContentDiv = document.createElement('div');
        const messageContentDivClass = message.from === username ? 'response' : 'message'; // check if the message is from the current user to change the styling
        messageContentDiv.classList.add(messageContentDivClass);

        const textPara = document.createElement('p');
        textPara.classList.add('text');
        textPara.textContent = message.text;

        const timePara = document.createElement('p');
        timePara.classList.add('time');
        timePara.textContent = message.time;

        messageContentDiv.appendChild(textPara);
        messageContentDiv.appendChild(timePara);
        messageDiv.appendChild(messageContentDiv);

        messagesContainer.appendChild(messageDiv);

        messagesContainer.scrollTop = messagesContainer.scrollHeight; // scroll to the bottom of the chat for the most recent messages

        lastLoadedMessage = message.messageID.messageID; // Update the last loaded messageID
        console.log('Last loaded message:', lastLoadedMessage);
    });
}

async function sendMessage() {

    // Sends a message to the server
    // Message will be sent to the currentRecipient
    // PAYLOAD: Message object {from, recipient, text, time, chatID}
    // The web socket will update the chat after the message is sent

    const messageInput = document.querySelector('.write-message');
    const message = messageInput.value;
    messageInput.value = '';

    if(message.length === 0 || (currentChatID == null && currentRecipient == null)) {
        return;
    }
    /*
    This adds the message to the chat window but I'd rather listen for a response from the server
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'text-only');

    const responseDiv = document.createElement('div');
    responseDiv.classList.add('response');

    const textPara = document.createElement('p');
    textPara.classList.add('text');
    textPara.textContent = message;

    responseDiv.appendChild(textPara);
    messageDiv.appendChild(responseDiv);

    document.querySelector('.messages-chat').appendChild(messageDiv);
    */

    // Send the message to the server
    /*
        JSON TEMPLATE to send a message
        {
            "from": "user1",
            "recipient": "user2",
            "text": "this is a new message",
            "time": "12:00",
            "chatID": "chat1"
        }
     */
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    try {
        const response = await fetch("http://localhost:8080/sendmessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(

                {
                        messageID: {
                            chatID:  currentChatID,
                            messageID: lastLoadedMessage + 1
                        },
                    from: username,
                    recipient: currentRecipient,
                    text: message,
                    time: currentTime
                })
        });

        if(response.status === 403) { // UNAUTHORIZED
            alert("Session expired. Please log in again.");
            window.location.href = "index.html";
            return;
        }
        // Previously the controller would send the chat object back, but now we are using sockets
        // const result = await response.json();
        // if (response.ok) {
        //     clearChat();
        //     displayMessages(result, currentRecipient);
        // } else {
        //     alert(result.message);
        // }
    } catch (error) {
        console.log(error);
        alert("Something went wrong in sendMessage(). Please try again.");
    }
}

async function searchUsers(searchValue) {

    // Search for a user to create a new chat with
    // PARAMS: username to search for
    // PAYLOAD: User object {username, password} and recipient
    // A chat is created if the user is found
    // EXPECTED RESPONSE: NONE - the socket will update the chat list

    /*
        The Server will receive a request for the new chat with a username.
        If the username exists, then it will update the socket before returning HTTP ok.
        This is why we pre-emptively update the currentRecipient to the searchValue

        If the username does not exist, then it will return HTTP bad request before the socket,
        then we know to immediately change the currentRecipient back to the previous recipient
     */

    if(searchValue === username) {
        alert('You cannot chat with yourself.');
        return;
    }

    const previousRecipient = currentRecipient;
    currentRecipient = searchValue;

    const data = {
        user: {
            username,
            password,
        },
        recipient: searchValue
    };
    try {
        const response = await fetch("http://localhost:8080/newchat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });

        if(response.status === 403) { // UNAUTHORIZED
            alert("Session expired. Please log in again.");
            window.location.href = "index.html";
            return;
        } else if(response.status === 400) { // BAD REQUEST
            alert("User not found. Try again.");
            currentRecipient = previousRecipient; // Revert the recipient back to the previous recipient
            return;
        }
        const result = await response.json();
        if (response.ok) {
            //currentRecipient = searchValue;
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.log(error);
        alert('Something went wrong in searchUsers(). Please try again.');
    }
}

function clearChat() {
    // Clears the chat window messages to reload new messages
    const messagesChat = document.querySelector('.messages-chat');
    messagesChat.innerHTML = '';
}



window.addEventListener('beforeunload', function (e) {
    // Disconnect the socket when the user leaves the page
    if (socket != null) {
        socket.close();
    }

    // Clear the authToken on client and server
    sessionStorage.removeItem("authToken");
    try {
        fetch("http://localhost:8080/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                username,
                password,
            })
        });
    } catch (error) {
        console.log(error);
    }
});




