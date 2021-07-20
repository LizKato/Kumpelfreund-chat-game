const trigger = [
    //0
    ["hi", "hey", "hello"],
    //1
    ["how are you", "how are things"],
    //2
    ["what is going on", "what is up"],
    //3
    ["happy", "good", "well", "fantastic", "cool"],
    //4
    ["bad", "bored", "tired", "sad"],
    //5
    ["tell me story", "tell me joke"],
    //6
    ["thanks", "thank you"],
    //7
    ["bye", "good bye", "goodbye"]
];

const reply = [
    //0
    ["Hello!", "Hi!", "Hey!", "Hi there!"],
    //1
    [
        "Fine... how are you?",
        "Pretty well, how are you?",
        "Fantastic, how are you?"
    ],
    //2
    [
        "Nothing much",
        "Exciting things!"
    ],
    //3
    ["Glad to hear it"],
    //4
    ["Why?", "Cheer up buddy"],
    //5
    ["What about?", "Once upon a time..."],
    //6
    ["You're welcome", "No problem"],
    //7
    ["Goodbye", "See you later"]
];

const alternative = [
    "Same",
    "Go on...",
    "Try again",
    "I'm listening...",
    "Bro..."
];

const robot = ["How do you do, fellow human", "I am not a bot"];
const ASKED_FOR_GAME = 'ASKED_FOR_GAME';
const START_RPS = 'START_RPS';

let gameState;
let interval;

const winSound = new Audio('sounds/win.wav')

function playWinSound() {
    winSound.play();
}

const loseSound = new Audio('sounds/lose.wav')
function playLoseSound() {
    loseSound.play();
}

function smallTalkToBot() {
    botWriteOn("Hi and welcome to my little chatroom. We can chat and if you really want to lose we can play some games together. Just type in game if you want to.")
    interval = idleNotification()
    const inputField = document.getElementById("input")
    inputField.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {
            clearInterval(interval);
            let input = inputField.value;
            inputField.value = ""
            output(input);
            interval = idleNotification();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // smallTalkToBot();
    setTimeout(() => {
        initializeRunner();
    }, 500);
});

function output(input) {
    let botAnswer;
    let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");
    text = text
        .replace(/ a /g, " ")
        .replace(/i feel /g, "")
        .replace(/whats/g, "what is")
        .replace(/please /g, "")
        .replace(/ please/g, "");

    botAnswer = getReply(text);
    if (!botAnswer) {
        if (text.indexOf('game') > -1 || gameState === ASKED_FOR_GAME && text.indexOf('yes') > -1) {
          botAnswer = "Cool then....let's start with ... hmm Rock Paper Scissors?";
          clearInterval(interval);
          gameState = START_RPS;
        }
        else if (text.match(/robot/gi)) {
            botAnswer = robot[Math.floor(Math.random() * robot.length)];
        } else {
            botAnswer = alternative[Math.floor(Math.random() * alternative.length)];
        }
    }

    addChat(input, botAnswer);
}

function getReply(text, triggerParam, replyParam) {
    let result;
    let realTrigger = triggerParam !== undefined ? triggerParam : trigger;
    let realReply = replyParam !== undefined ? replyParam : reply;
    for (let x = 0; x < realTrigger.length; x++) {
        for (let y = 0; y < realReply.length; y++) {
            if (realTrigger[x][y] === text) {
                let possibleReplies = realReply[x];
                result = possibleReplies[Math.floor(Math.random() * possibleReplies.length)];
            }
        }
    }
    return result;
}

function addChat(input, product) {
    userWrite(input);

    botWriteOn(product);

    setTimeout(() => {
        if (gameState === START_RPS) {
            clearInterval(interval);
            startRockPaperScissors();
        }
    }, 1000)
}
function userWrite(message) {
    const chatbox = document.getElementById("chatbox");
    let userDiv = document.createElement("div");
    userDiv.classList.add("user");
    userDiv.innerHTML = `You: <span class="user-response">${message}</span>`;
    chatbox.appendChild(userDiv);
    chatbox.scrollTo(0, chatbox.scrollHeight);
}
function actionAsGif(userActionName, kiActionName) {
    const chatbox = document.getElementById("chatbox");
    let actionContainer = document.createElement("div");
    actionContainer.classList.add("rps-actions");

    let userAction = document.createElement('img');
    userAction.alt = userActionName;
    userAction.src = 'img/' + userActionName + '.gif';
    userAction.classList.add('user-rps-action')

    let kiAction = document.createElement('img');
    kiAction.alt = kiActionName;
    kiAction.src = 'img/' + kiActionName + '.gif';
    kiAction.classList.add('ki-rps-action')

    actionContainer.appendChild(userAction);
    actionContainer.appendChild(kiAction);

    chatbox.appendChild(actionContainer);
    chatbox.scrollTo(0, chatbox.scrollHeight);
}
function botWriteOn(message) {
    setTimeout(() => {
        const chatbox = document.getElementById("chatbox");
        let botDiv = document.createElement("div");
        botDiv.classList.add("bot");
        botDiv.innerHTML = `Kumpelfreund: <span class="bot-response">${message}</span>`;
        chatbox.appendChild(botDiv);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 750)
}

function idleNotification() {
    return setInterval(() => {
        botWriteOn('I\'m bored want to play a game?');
        gameState = ASKED_FOR_GAME;
    }, 10000)
}
