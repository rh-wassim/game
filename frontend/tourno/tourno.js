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
const PADDLE_SPEED = 6;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3; 

var showingWinScreen = false;

var tournamentPlayers = [];
var currentMatch = {};
var tournamentStarted = false;

var wKeyPressed = false;
var sKeyPressed = false;
var upKeyPressed = false; 
var downKeyPressed = false;

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
            case 'ArrowUp': upKeyPressed = true; break; // Renamed from upArrowPressed
            case 'ArrowDown': downKeyPressed = true; break; // Renamed from downArrowPressed
            case 'w': wKeyPressed = true; break;
            case 's': sKeyPressed = true; break;
        }
    });

    document.addEventListener('keyup', function(event) {
        switch(event.key) {
            case 'ArrowUp': upKeyPressed = false; break; 
            case 'ArrowDown': downKeyPressed = false; break; // Renamed from downArrowPressed
            case 'w': wKeyPressed = false; break;
            case 's': sKeyPressed = false; break;
        }
    });

    document.getElementById('startTournamentButton').addEventListener('click', handleStartTournamentClick);
};

function moveEverything() {
    if(showingWinScreen) {
        return;
    }

    // Paddle movement logic
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

    // Ball movement logic
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

/////

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
        // Reset all tournament related variables and UI elements
        tournamentPlayers = [];
        currentMatch = {};
        tournamentStarted = false;
        document.getElementById('playerInputForm').style.display = 'block';
        canvas.style.display = 'none';
        // Reset the scores
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
        // Clear the match display
        document.getElementById('currentMatchInfo').textContent = '';
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

    updateMatchDisplay();
}

// Call this function when a player wins the match
function handleWin(winningPlayerIndex) {
    // Increment the winning player's tournament score
    tournamentPlayers[winningPlayerIndex].score++;

    // Show winning screen and stop game
    showingWinScreen = true;
    canvasContext.fillText(tournamentPlayers[winningPlayerIndex].alias + " wins the match!", 350, 200);
    
    if (currentMatch.player1Index === 0 && currentMatch.player2Index === 1) {
        // If the first match just ended, set up the second match
        setTimeout(() => {
            currentMatch = {
                player1Index: 2,
                player2Index: 3
            };
            startNextMatch();
        }, 3000); // 3 second delay
    } else if (currentMatch.player1Index === 2 && currentMatch.player2Index === 3) {
        // If the second match just ended, set up the final match
        setTimeout(() => {
            let finalists = tournamentPlayers.map((player, index) => ({ score: player.score, index })).filter(player => player.score > 0);
            if (finalists.length === 2) {
                currentMatch = {
                    player1Index: finalists[0].index,
                    player2Index: finalists[1].index
                };
            }
            startNextMatch();
        }, 3000); // 3 second delay
    } else {
        // If the final match just ended, declare the tournament winner
        setTimeout(() => {
            alert(tournamentPlayers[winningPlayerIndex].alias + " wins the tournament!");
            resetTournament();
        }, 3000); // 3 second delay
    }
}

function resetPaddles() {
    paddle1Y = (canvas.height - PADDLE_HEIGHT) / 2;
    paddle2Y = (canvas.height - PADDLE_HEIGHT) / 2;
}

function startNextMatch() {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
    updateMatchDisplay();
    resetPaddles();
    ballReset();
}


function resetTournament() {
    tournamentPlayers = [];
    currentMatch = {};
    document.getElementById('playerInputForm').style.display = 'block';
    canvas.style.display = 'none';
    document.getElementById('currentMatchInfo').textContent = '';
    resetPaddles();
    // Need to reset other necessary variables
}

function updateMatchDisplay() {
    var matchInfo = "Match: " + tournamentPlayers[currentMatch.player1Index].alias + " vs " + tournamentPlayers[currentMatch.player2Index].alias;
    document.getElementById('currentMatchInfo').textContent = matchInfo;
}

// Check for a win after each score
function ballReset() {
    // Check for winning condition
    if (player1Score >= WINNING_SCORE) {
        handleWin(currentMatch.player1Index);
        return; 
    } else if (player2Score >= WINNING_SCORE) {
        handleWin(currentMatch.player2Index);
        return; 
    }
    // Reset ball for the next round
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

