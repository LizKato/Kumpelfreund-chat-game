function initializeRunner() {
    let canvas = document.querySelector("canvas");
    canvas.style.display = 'block';
    canvas.classList.add('appear');
    const context = canvas.getContext("2d");

    context.canvas.height = 400;
    context.canvas.width = document.getElementById('main').clientWidth;

// Start the frame count at 1
    let frameCount = 1;
// Set the number of obstacles to match the current "level"
    let obCount = frameCount;
// Create a collection to hold the generated x coordinates
    let obXCoors = [];

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
    const nextFrame = () => {
        // increase the frame / "level" count
        frameCount++;
        if (frameCount === 10) {
            won = true;
            playWinSound();
        }

        for (let i = 0; i < obCount; i++) {
            // Randomly generate the x coordinate for the top corner start of the triangles
            obXCoor = Math.floor(Math.random() * (context.canvas.width - 240 + 1) + 140);
            obXCoors.push(obXCoor);
        }

    }

    const controller = {

        left: false,
        right: false,
        up: false,
        keyListener: function (event) {

            const key_state = event.type === "keydown";

            switch (event.keyCode) {

                case 37:// left key
                    controller.left = key_state;
                    break;
                case 38:// up key
                    controller.up = key_state;
                    break;
                case 39:// right key
                    controller.right = key_state;
                    break;

            }
        }
    };

    const loop = function () {
        if (lost || won) {
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
            playerProperties.x = -20;
            nextFrame();
        }

        // Creates the backdrop for each frame
        context.fillStyle = 'black';
        context.fillRect(0, 0, context.canvas.width, 400); // x, y, width, height

        // Create the obstacles for each frame
        // Set the standard obstacle height
        const height = 200 * Math.cos(Math.PI / 6);

        context.fillStyle = "white"; // hex for triangle color
        obXCoors.forEach((obXCoor) => {
            context.beginPath();

            context.moveTo(obXCoor, 385); // x = random, y = coor. on "ground"
            context.lineTo(obXCoor + 20, 385); // x = ^random + 20, y = coor. on "ground"
            context.lineTo(obXCoor + 10, 500 - height); // x = ^random + 10, y = peak of triangle

            context.closePath();
            context.fill();
            let collision = Math.abs((obXCoor-12) - playerProperties.x);
            if (collision < 10 && playerProperties.y > 300) {
                if (playerProperties.currentPlayerImg === player) {
                    playerProperties.currentPlayerImg = playerFall;
                } else if (playerProperties.currentPlayerImg === playerReverse) {
                    playerProperties.currentPlayerImg = playerReverseFall;
                }
                lost = true;
                playLoseSound();
            }
        })

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
        context.fillText("Level " + frameCount, 10,35);

        if (lost) {
            context.textAlign = "center";
            context.fillText("Hahaha You lose. Click to retry ", context.canvas.width/2,context.canvas.height/2);
        } else if (won) {
            context.textAlign = "center";
            context.fillText("You won. I hope you are happy now....go play something else ", context.canvas.width/2,context.canvas.height/2);
        }

        // call update when the browser is ready to draw again
        window.requestAnimationFrame(loop);
    };

    window.addEventListener("keydown", controller.keyListener)
    window.addEventListener("keyup", controller.keyListener);
    window.requestAnimationFrame(loop);

    canvas.addEventListener('click', function() {
        if (lost || won) {
            frameCount = 1
            lost = false;
            won = false;
            obXCoors = [];
            obCount = frameCount;
            window.requestAnimationFrame(loop);
            playerProperties = {
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
        }
    }, false);
}
