const username = sessionStorage.getItem("username");
const password = sessionStorage.getItem("password");


// load the messages
loadChats();
const messages = loadMessages('user2');
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

            //result.forEach(user => {
            //    console.log(user.username);
            //})
            displayChats(result);
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Something went wrong. Please try again.");

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
         if(usersDisplayed == 0) {
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
                recipient: recipient
            })
        });

        // Handle the response
        const result = await response.json();
        if (response.ok) {
            displayMessages(result);
            return result;
        } else {
            console.error("Request failed:", result.message);
        }
    } catch (error) {
        console.error("Error occurred during fetch:", error);
    }
}

function displayMessages(response) {
    response.messages.forEach(message => {
        console.log(message);
    });
}