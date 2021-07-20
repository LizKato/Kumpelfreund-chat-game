let playerScore = 0;
let kiScore = 0;

const actionsValues = [
    {
        id: 0,
        name: 'Scissors',
        winAgainst: 1
    },
    {
        id: 1,
        name: 'Paper',
        winAgainst: 2
    },
    {
        id: 2,
        name: 'Rock',
        winAgainst: 0
    }
];
const otherQuestions = [
    //0
    ["next", "another", "different"],
]
const otherReplies = [
    //0
    ["If you want to switch you first have to win against me!", "If you are not winning enough, you are not worth another game", "I am the gamemaster, I decide when we switch games"],
]
const gameReplies = [
    // player won
    ["That was just a coincidence.", "I don't begrudge you the head start.", "Remember, pride comes before a fall.", "You will regret this!"],
    // ki won
    ["As expected.", "gg ez", "I didn't even try hard."],
    // draw
    ["Haha like I know exactly what you take.", "No one wins also means that I have not lost."],
];

function startRockPaperScissors() {
    botWriteOn('Let\'s play a best of three. Type in your action and I will follow. But don\'t get your hopes up, I\'m going to win anyway.')
    initializeGameTalkToBot();
}


function initializeGameTalkToBot() {
    document.getElementById("input").style.display = "none";
    const inputField = document.getElementById("inputGame");
    inputField.style.display = "block";

    inputField.focus();
    inputField.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {
            let input = inputField.value;
            inputField.value = ""
            useAction(input);
        }
    });
}

function useAction(actionInput) {
    console.log(actionInput);
    let lowerCaseAction = actionInput.toLowerCase();
    let userActionName = '';
    if (lowerCaseAction === 'rock' || lowerCaseAction === 'paper' || lowerCaseAction === 'scissors') {
        userActionName = lowerCaseAction;
        const kiActionName = kiAction();
        actionAsGif(userActionName, kiActionName);
        evaluateScore(actionInput, kiActionName.toLowerCase());

        if (kiScore === 2) {
            botWriteOn('Ha, I won the best of 3. Try again I reset the score');
            playerScore = 0;
            kiScore = 0;
        }

        if (playerScore === 2) {
            botWriteOn('Argh...you are just lucky. Let\'s try something different. I will beat you in Connect Four ')

            setTimeout(() => {
                initializeConnectFour();
            }, 2000)
        }
    } else if(lowerCaseAction === 'score') {
        userWrite(lowerCaseAction);
        botWriteOn('You won ' + playerScore + ' times')
        botWriteOn('I won ' + kiScore + ' times')
    } else {
        userWrite(lowerCaseAction);
        lowerCaseAction = lowerCaseAction
            .replace(/ a /g, " ")
            .replace(/i feel /g, "")
            .replace(/whats/g, "what is")
            .replace(/please /g, "")
            .replace(/ please/g, "")
            .replace(/ game/g, "")
            .replace(/ can/g, "")
            .replace(/ we/g, "")
            .replace(/ play/g, "");

        let possibleReply = getReply(lowerCaseAction, otherQuestions, otherReplies);
        if (possibleReply) {
            botWriteOn(possibleReply);
        } else {
            botWriteOn("Don\'t try to trick me you can only use rock, paper, scissors or score if you want to know it");
        }
    }
}

function kiAction() {
    const actionNumber = getRandomInt(3);
    const actions = ['scissors', 'rock', 'paper'];

    return actions[actionNumber];
}

function evaluateScore(playerAction, kiAction) {
    const playerActionValue = actionsValues.find(value => value.name.toLowerCase() === playerAction);
    const kiActionValue = actionsValues.find(value => value.name.toLowerCase() === kiAction);

    if (playerActionValue.winAgainst === kiActionValue.id) {
        // player win
        setTimeout(() => {
            playWinSound();
        }, 500);

        botWriteOn("You won");
        botWriteOn(gameReplies[0][getRandomInt(gameReplies[0].length)]);
        playerScore++;
    } else if(kiActionValue.winAgainst === playerActionValue.id) {
        // player lose
        setTimeout(() => {
            playLoseSound();
        }, 500);
        botWriteOn("I won");
        botWriteOn(gameReplies[1][getRandomInt(gameReplies[1].length)]);
        kiScore++;
    } else {
        // draw
        botWriteOn("Draw.");
        botWriteOn(gameReplies[2][getRandomInt(gameReplies[2].length)]);
    }
    if (playerScore < 2 && kiScore < 2) {
        botWriteOn('Type in your action for the next round.');
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
