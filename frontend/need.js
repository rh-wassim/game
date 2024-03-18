var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 10;
var ballY = 50;
var ballSpeedY = 4;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3; // Score required to win a match

var showingWinScreen = false;

var tournamentPlayers = [];
var currentMatch = {};
var tournamentStarted = false;

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
        switch(event.key) {
            case 'ArrowUp': upArrowPressed = true; break;
            case 'ArrowDown': downArrowPressed = true; break;
            case 'w': wKeyPressed = true; break;
            case 's': sKeyPressed = true; break;
        }
    });

    document.addEventListener('keyup', function(event) {
        switch(event.key) {
            case 'ArrowUp': upArrowPressed = false; break;
            case 'ArrowDown': downArrowPressed = false; break;
            case 'w': wKeyPressed = false; break;
            case 's': sKeyPressed = false; break;
        }
    });

    document.getElementById('startTournamentButton').addEventListener('click', handleStartTournamentClick);
};


function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function moveEverything() {
    if (showingWinScreen) {
        return;
    }
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
        } else {
            player2Score++; // must be before ballReset()
            ballReset();
        }
    }
    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
        } else {
            player1Score++; // must be before ballReset()
            ballReset();
        }
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for (var i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}

function drawEverything() {
    // next line blanks out the screen with black
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    
    if (showingWinScreen) {
        canvasContext.fillStyle = 'white';
        
        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Player 1 Wins!", 350, 200);
        } else if (player2Score >= WINNING_SCORE) {
            canvasContext.fillText("Player 2 Wins!", 350, 200);
        }

        canvasContext.fillText("click to continue", 350, 500);
        return;
    }

    drawNet();
    
    // this is left player paddle
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    
    // this is right player paddle
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    
    // next line draws the ball
    colorCircle(ballX, ballY, 10, 'white');
    
    // scores
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

function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

// Add this function to handle the keyboard input
var wKeyPressed = false;
var sKeyPressed = false;
var upArrowPressed = false;
var downArrowPressed = false;

function movePaddle() {
    if (wKeyPressed && paddle1Y > 0) {
        paddle1Y -= 6;
    } else if (sKeyPressed && paddle1Y < canvas.height - PADDLE_HEIGHT) {
        paddle1Y += 6;
    }
    if (upArrowPressed && paddle2Y > 0) {
        paddle2Y -= 6;
    } else if (downArrowPressed && paddle2Y < canvas.height - PADDLE_HEIGHT) {
        paddle2Y += 6;
    }
}

// Call this function in moveEverything to actually move the paddles
function moveEverything() {
    if (showingWinScreen) {
        return;
    }
    // Additional logic for moving the paddles
    movePaddle();

    // Existing ball movement logic
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with paddles
    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score++; // must be before ballReset()
            ballReset();
        }
    }
    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player1Score++; // must be before ballReset()
            ballReset();
        }
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

// Additional code to continue handling tournament logic
function handleStartTournamentClick() {
    // Get player aliases from the DOM
    var playerAliases = [
    document.getElementById('player1').value.trim(),
    document.getElementById('player2').value.trim(),
    document.getElementById('player3').value.trim(),
    document.getElementById('player4').value.trim()
    ];

    // Check if all aliases are provided
    if (playerAliases.some(alias => alias === '')) {
        alert('All player aliases need to be provided.');
        return;
    }

    // Hide registration form and show the canvas
    document.getElementById('playerInputForm').style.display = 'none';
    canvas.style.display = 'block';

    // Initialize players for the tournament
    tournamentPlayers = playerAliases.map(alias => {
        return {
            alias: alias,
            score: 0
        };
    });

    // Start the tournament
    tournamentStarted = true;
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
    currentMatch = {
        player1Index: 0, // Index of the first player in the tournament
        player2Index: 1  // Index of the second player in the tournament
    };

    // Start the first match
    ballReset();
}

// Call this function when a player wins the match
function handleWin(playerIndex) {
    tournamentPlayers[playerIndex].score++;
    if (playerIndex == currentMatch.player1Index) {
        currentMatch = {
        player1Index: 2,
        player2Index: 3
    };
    } else {
        // Final match
        showingWinScreen = true;
        alert(tournamentPlayers[playerIndex].alias + " wins the tournament!");
        // Reset tournament
        tournamentStarted = false;
    }
    // Reset scores for the next match
    player1Score = 0;
    player2Score = 0;
    ballReset();
}

// Check for a win after each score
function ballReset() {
    if (player1Score >= WINNING_SCORE) {
        handleWin(currentMatch.player1Index);
    } else if (player2Score >= WINNING_SCORE) {
        handleWin(currentMatch.player2Index);
    }
    // Reset the ball for the next serve
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

