function initializeRunner() {
    const runnerGame = document.getElementById('runnerGame');
    runnerGame.style.display = 'block';
    runnerGame.classList.add('appear');

    let canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");

    context.canvas.height = 400;
    console.log(document.getElementById('main').clientWidth);
    context.canvas.width = document.getElementById('main').clientWidth;

    // Start the frame count at 1
    let frameCount = 1;
    let levelUpInterval;

    let lost = false;
    let won = false;

    const player = document.createElement('img');
    player.src = 'img/duck.png'

    const playerFall = document.createElement('img');
    playerFall.src = 'img/duck_fall.png'

    const playerReverse = document.createElement('img');
    playerReverse.src = 'img/duck_reverse.png'

    const playerReverseFall = document.createElement('img');
    playerReverseFall.src = 'img/duck_reverse_fall.png'


    let playerProperties = {
        height: 50,
        jumping: true,
        width: 50,
        x: 0,
        xVelocity: 0,
        y: 8,
        yVelocity: 0,
        currentPlayerImg: player,
        jumpSound: new Audio('sounds/quack.wav')
    };


// Create the obstacles for each frame
    const levelUp = () => {
        // increase the frame / "level" count
        frameCount++;
        objectSpeed++;
        objectSkipSpeed = objectSkipSpeed + 0.5;
    }

    const controller = {

        left: false,
        right: false,
        up: false,
        keyListener: function (event) {

            const key_state = event.type === "keydown";

            switch (event.keyCode) {
                case 65:// A
                case 37:// left key
                    controller.left = key_state;
                    break;
                case 87:// W
                case 32:// Space
                case 38:// up key
                    controller.up = key_state;
                    break;
                case 68:// D
                case 39:// right key
                    controller.right = key_state;
                    break;

            }
        }
    };

    let objects = [];
    let objectSkip = 0;
    let currentSkip = 1;
    let objectSpeed = 5;
    let objectSkipSpeed = 1;

    const loop = function () {
        if (lost) {
            clearInterval(levelUpInterval);

            canvas.remove();
            document.getElementById('runner-explaination').remove();
            document.getElementById('end-screen').style.display = 'block';
            return
        }
        if (controller.up && !playerProperties.jumping) {
            playerProperties.yVelocity -= 30;
            playerProperties.jumping = true;
            playerProperties.jumpSound.play();
        }

        if (controller.left) {
            playerProperties.currentPlayerImg = playerReverse;
            playerProperties.xVelocity -= 0.5;
        }

        if (controller.right) {
            playerProperties.currentPlayerImg = player;
            playerProperties.xVelocity += 0.5;

        }

        playerProperties.yVelocity += 1.5;// gravity
        playerProperties.x += playerProperties.xVelocity;
        playerProperties.y += playerProperties.yVelocity;
        playerProperties.xVelocity *= 0.9;// friction
        playerProperties.yVelocity *= 0.9;// friction

        // if playerProperties is falling below floor line
        if (playerProperties.y > 386 - 16 - playerProperties.height) {
            playerProperties.jumping = false;
            playerProperties.y = 386 - 16 - playerProperties.height;
            playerProperties.yVelocity = 0;
        }

        // if playerProperties is going off the left of the screen
        if (playerProperties.x < -20) {
            playerProperties.x = 20;
        } else if (playerProperties.x > context.canvas.width - 40) {// if playerProperties goes past right boundary
            playerProperties.x = context.canvas.width - 50;
        }

        // Creates the backdrop for each frame
        context.fillStyle = 'black';
        context.fillRect(0, 0, context.canvas.width, 400); // x, y, width, height

        // Create the obstacles for each frame
        // Set the standard obstacle height
        const height = 200 * Math.cos(Math.PI / 6);

        context.fillStyle = "white"; // hex for triangle color

        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            context.beginPath();

            context.moveTo(obj.x, 385); // x = random, y = coor. on "ground"
            context.lineTo(obj.x + 20, 385); // x = ^random + 20, y = coor. on "ground"
            context.lineTo(obj.x + 10, 500 - height); // x = ^random + 10, y = peak of triangle

            context.closePath();
            context.fill();
            let collision = Math.abs((obj.x - 12) - playerProperties.x);
            if (collision < 10 && playerProperties.y > 300) {
                if (playerProperties.currentPlayerImg === player) {
                    playerProperties.currentPlayerImg = playerFall;
                } else if (playerProperties.currentPlayerImg === playerReverse) {
                    playerProperties.currentPlayerImg = playerReverseFall;
                }
                lost = true;
                playLoseSound();
            }

            obj.x = obj.x - objectSpeed;
        }
        objects = objects.filter(obj => obj.x > 0);

        objectSkip = objectSkip + objectSkipSpeed;
        if (objectSkip >= currentSkip) {
            objects.push({x: context.canvas.width});
            objectSkip = 0;
            currentSkip = getRandomIntInclusive(100, 200);
        }

        // Creates and fills the cube for each frame
        context.drawImage(playerProperties.currentPlayerImg, playerProperties.x, playerProperties.y, playerProperties.width, playerProperties.height);
        // context.rect(playerProperties.x, playerProperties.y, playerProperties.width, playerProperties.height);
        context.fill();

        // Creates the "ground" for each frame
        context.strokeStyle = "white";
        context.lineWidth = 30;
        context.beginPath();
        context.moveTo(0, 385);
        context.lineTo(context.canvas.width, 385);
        context.stroke();


        context.font = "30px Courier New";
        context.fillStyle = "white";
        context.textAlign = "left";
        context.fillText("Level " + frameCount, 10, 35);

        // call update when the browser is ready to draw again
        window.requestAnimationFrame(loop);
    };

    window.addEventListener("keydown", controller.keyListener)
    window.addEventListener("keyup", controller.keyListener);
    window.requestAnimationFrame(loop);

    levelUpInterval = setInterval(levelUp, 5000);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
