const username = sessionStorage.getItem("username");
const password = sessionStorage.getItem("password");



let currentChatID = null;
let currentRecipient = null;

main();

function main() {

    document.title = "Messages: " + username;
    loadChats();
    // loadChat -> displayChats -> loadMessages of first user -> displayMessages of first user

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
    // It sends the username and password to the server
    // After that is displays the chat on the UI
    try {
        const response = await fetch("http://localhost:8080/chatlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password})
        });

        const result = await response.json();
        if (response.ok) {
            displayChats(result);
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Something went wrong in loadChats(). Please try again.");

    }
}

function displayChats(users) {
    // displays the chats on the browser
    // Expects an array of users that has active chats
    // The first user in the array will have their chat messages loaded

    let usersDisplayed = 0;

    const chatList = document.querySelector('.discussions');
    // clear the chat list by removing all divs with dummy tag
    const dummyDivs = document.querySelectorAll('.discussion.dummy');
    dummyDivs.forEach(div => {
        div.remove();
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
        userDiv.addEventListener('click', () => {
            // add event listeners to load in the new messages
            clearChat();
            currentRecipient = user.username;
            loadMessages(currentRecipient);

        });

         if(usersDisplayed === 0) {
             userDiv.classList.add('discussion', 'message-active', 'dummy');
         } else {
             userDiv.classList.add('discussion', 'dummy');
         }

         const descContactDiv = document.createElement('div');
         descContactDiv.classList.add('desc-contact');

        const namePara = document.createElement('p');
        namePara.classList.add('name');
        namePara.textContent = user.username;

        const timerDiv = document.createElement('div');
        timerDiv.classList.add('timer');
        timerDiv.textContent = '12 sec';

        userDiv.appendChild(descContactDiv);
        descContactDiv.appendChild(namePara);
        userDiv.appendChild(timerDiv);

         chatList.appendChild(userDiv);

         if(usersDisplayed === 0) {
            // we will load the chat messages for the first user
            loadMessages(user.username);
         }

         usersDisplayed++;
    });


     // add dummy chat cards to fill up the blank space
    for (let i = usersDisplayed; i < 7; i++) {
        const userDiv = document.createElement('div');
        userDiv.classList.add('discussion', 'dummy');

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






async function loadMessages(recipient) {
    // FETCHES messages from the server from a single chat
    // It expects the username, password and the recipient
    // An array of messages is returned
    // It then displays the messages on the UI
    try {
        const response = await fetch("http://localhost:8080/newchat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: {
                    username: username,
                    password: password
                },
                recipient: recipient // do not change this to currentRecipient
            })
        });

        // Handle the response
        const result = await response.json();
        if (response.ok) {
            clearChat();
            currentChatID = result.chatID;
            connectToSocket(currentChatID);
            displayMessages(result, recipient); // do not change to currentRecipient
            return result;
        } else {
            console.error("Request failed:", result.message);
        }
    } catch (error) {
        console.error("Error occurred during fetch:", error);
    }
}



function displayMessages(response, recipient) {

    // displays the messages on the browser
    // it expects an array of messages
    // the reason is has recipient as a parameter is to change the recipient name on the chat window

    /*
        FORM for the message from the other user
          <div class="message text-only">
            <div class="message">
              <p class="text"> Hey Megan ! It's been a while 😃</p>
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
    nameTag.textContent = recipient;

    const messagesContainer = document.querySelector('.messages-chat');
    response.messages.forEach(message => {

        if(message.from === username) {
            // this is a message from the current user
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'text-only');

            const messageContentDiv = document.createElement('div');
            messageContentDiv.classList.add('response');


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
        } else {
            // this is a message from the other user
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'text-only');

            const messageContentDiv = document.createElement('div');
            messageContentDiv.classList.add('message');


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
        }
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        // scroll to the bottom of the chat for the most recent messages
    });
}




function clearChat() {
    const messagesChat = document.querySelector('.messages-chat');
    messagesChat.innerHTML = '';
}










async function sendMessage() {

    // sends a message to the server
    // expects the message to be sent to the current recipient
    // it then displays the message on the UI after receiving response from the server web socket

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
    // send the message to the server
    //sendMessageToServer(message, recipient);


    // send the message to the server
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
    const currentTime = `${hours}:${minutes}`;try {
        const response = await fetch("http://localhost:8080/sendmessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    from: username,
                    recipient: currentRecipient,
                    text: message,
                    time: currentTime,
                    chatID:  currentChatID
                })
        });
        const result = await response.json();
        if (response.ok) {
            clearChat();
            displayMessages(result, currentRecipient);
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Something went wrong in sendMessage(). Please try again.");

    }


}


async function searchUsers(searchValue) {

    // search for a user to create a new chat with
    // it sends the search value to the server
    // a chat is created if the user is found
    // a chat object is returned to display

    const data = {
        user: {
            username: username,
            password: password
        },
        recipient: searchValue
    };
    try {
        const response = await fetch("http://localhost:8080/newchat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            //loadChats(); // reload the chats
            //displayMessages(result, searchValue);
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("User not found. Try again.");

    }
}



function chatSocketUpdate(users) {
    // this function is almost exactly the same as displayChats but the difference is that it does not load the messages
    // if you use displayChats with the socket it causes an infinite loop
    // display chats will call loading messages which will make the socket update the chat window which then calls this function again

    let usersDisplayed = 0;

    const chatList = document.querySelector('.discussions');
    // clear the chat list by removing all divs with dummy tag
    const dummyDivs = document.querySelectorAll('.discussion.dummy');
    dummyDivs.forEach(div => {
        div.remove();
    });

    const nameTag = document.querySelector('.currentChatName');;

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
        userDiv.addEventListener('click', () => {
            // add event listeners to load in the new messages
            clearChat();
            currentRecipient = user.username;
            loadMessages(currentRecipient);

        });

        if(usersDisplayed === 0) {
            userDiv.classList.add('discussion', 'message-active', 'dummy');
        } else {
            userDiv.classList.add('discussion', 'dummy');
        }

        const descContactDiv = document.createElement('div');
        descContactDiv.classList.add('desc-contact');

        const namePara = document.createElement('p');
        namePara.classList.add('name');
        namePara.textContent = user.username;

        const timerDiv = document.createElement('div');
        timerDiv.classList.add('timer');
        timerDiv.textContent = '12 sec';

        userDiv.appendChild(descContactDiv);
        descContactDiv.appendChild(namePara);
        userDiv.appendChild(timerDiv);

        chatList.appendChild(userDiv);

        usersDisplayed++;
    });


    // add dummy chat cards to fill up the blank space
    for (let i = usersDisplayed; i < 7; i++) {
        const userDiv = document.createElement('div');
        userDiv.classList.add('discussion', 'dummy');

        const descContactDiv = document.createElement('div');
        descContactDiv.classList.add('desc-contact');

        const namePara = document.createElement('p');
        namePara.classList.add('name');
        namePara.textContent = '';


        userDiv.appendChild(descContactDiv);
        descContactDiv.appendChild(namePara);


        chatList.appendChild(userDiv);
    }

}

