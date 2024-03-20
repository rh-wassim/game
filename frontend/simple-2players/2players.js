var canvas;
var canvasContext;
var ballX = 400;
var ballY = 300;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

var wKeyPressed = false;
var sKeyPressed = false;
var upKeyPressed = false;
var downKeyPressed = false;
const PADDLE_SPEED = 6;

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();	
    }, 1000 / framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowUp') {
            upKeyPressed = true;
        } else if (event.key === 'ArrowDown') {
            downKeyPressed = true;
        } else if (event.key === 'w' || event.key === 'W') {
            wKeyPressed = true;
        } else if (event.key === 's' || event.key === 'S') {
            sKeyPressed = true;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowUp') {
            upKeyPressed = false;
        } else if (event.key === 'ArrowDown') {
            downKeyPressed = false;
        } else if (event.key === 'w' || event.key === 'W') {
            wKeyPressed = false;
        } else if (event.key === 's' || event.key === 'S') {
            sKeyPressed = false;
        }
    });
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function handleMouseClick(evt) {
    if(showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}


function ballReset() {
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function moveEverything() {
    if(showingWinScreen) {
        return;
    }

    if (wKeyPressed) {
        paddle1Y -= PADDLE_SPEED;
        if (paddle1Y < 0) {
            paddle1Y = 0;
        }
    } else if (sKeyPressed) {
        paddle1Y += PADDLE_SPEED;
        if (paddle1Y > canvas.height - PADDLE_HEIGHT) {
            paddle1Y = canvas.height - PADDLE_HEIGHT;
        }
    }

    if (upKeyPressed) {
        paddle2Y -= PADDLE_SPEED;
        if (paddle2Y < 0) {
            paddle2Y = 0;
        }
    } else if (downKeyPressed) {
        paddle2Y += PADDLE_SPEED;
        if (paddle2Y > canvas.height - PADDLE_HEIGHT) {
            paddle2Y = canvas.height - PADDLE_HEIGHT;
        }
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;
	
    if(ballX < 0) {
        if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score++;
            ballReset();
        }
    }
    if(ballX > canvas.width) {
        if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player1Score++;
            ballReset();	
        }
    }
    if(ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for(var i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}

function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if(showingWinScreen) {
        canvasContext.fillStyle = 'white';

        if(player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Left Player Won", 350, 200);
        } else if(player2Score >= WINNING_SCORE) {
            canvasContext.fillText("Right Player Won", 350, 200);
        }

        canvasContext.fillText("click to continue", 350, 500);
        return;
    }

    drawNet();
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}