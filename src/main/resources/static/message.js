const username = sessionStorage.getItem("username");
const password = sessionStorage.getItem("password");
let currentChatID = null;
let currentRecipient = null;

main();

function main() {
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

}















async function loadChats() {
    // get the list of users that the current user has chatted with
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
            console.log(result);
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
    let usersDisplayed = 0;

    const chatList = document.querySelector('.discussions');
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
             userDiv.classList.add('discussion', 'message-active');
         } else {
             userDiv.classList.add('discussion');
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


     // add empty chat cards to fill up the space
    for (let i = usersDisplayed; i < 7; i++) {
        const userDiv = document.createElement('div');
        userDiv.classList.add('discussion');

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
    // get the messages between the current user and the recipient from the server
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
            console.log("Current recipient: ", currentRecipient, "Current chatID: ", currentChatID);
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

    //displays the messages on the browser

    /*
        FORM for the message from the other user
          <div class="message text-only">
            <div class="message">
              <p class="text"> Hey Megan ! It's been a while 😃</p>
            </div>
          </div>

          FORM for the message from the current user
          <div class="message text-only">
            <div class="response">
              <p class="text"> When can we meet ?</p>
            </div>
          </div>
     */

    // update the chatID and recipient


    const nameTag = document.querySelector('.currentChatName');
    nameTag.textContent = recipient;
    response.messages.forEach(message => {

        if(message.from === username) {
            // this is a message from the current user
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'text-only');

            const responseDiv = document.createElement('div');
            responseDiv.classList.add('response');


            const textPara = document.createElement('p');
            textPara.classList.add('text');
            textPara.textContent = message.text;


            responseDiv.appendChild(textPara);
            messageDiv.appendChild(responseDiv);

            document.querySelector('.messages-chat').appendChild(messageDiv);
        } else {
            // this is a message from the other user
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'text-only');

            const messageDiv2 = document.createElement('div');
            messageDiv2.classList.add('message');


            const textPara = document.createElement('p');
            textPara.classList.add('text');
            textPara.textContent = message.text;

            messageDiv2.appendChild(textPara);
            messageDiv.appendChild(messageDiv2);

            document.querySelector('.messages-chat').appendChild(messageDiv);
        }

    });
}




function clearChat() {
    const messagesChat = document.querySelector('.messages-chat');
    messagesChat.innerHTML = '';
}










async function sendMessage() {
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
    const currentTime = `${hours}:${minutes}`;
    console.log("Sending message to: ", currentRecipient, " with chatID: ", currentChatID);
    try {
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
        console.log("RESPONSE!!!!" + response.recipient);
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

