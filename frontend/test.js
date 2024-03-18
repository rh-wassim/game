var canvas;
var canvasContext;
var ballX = 400;
var ballY = 300;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;  // Lowered for faster testing of the tournament logic

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

var tournamentPlayers = [{}, {}, {}, {}];
var currentMatch = { player1Index: null, player2Index: null };
var tournamentStarted = false;

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
    if (showingWinScreen) {
        if (!tournamentStarted) {
            player1Score = 0;
            player2Score = 0;
            showingWinScreen = false;
        } else {
            // Reset for a new tournament
            tournamentPlayers.forEach(player => player.hasWon = false);
            startMatch(1, 2);  // Restart the tournament
        }
    }
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();	
    }, 1000/framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'ArrowUp': upKeyPressed = true; break;
            case 'ArrowDown': downKeyPressed = true; break;
            case 'w': case 'W': wKeyPressed = true; break;
            case 's': case 'S': sKeyPressed = true; break;
        }
    });

    document.addEventListener('keyup', function(event) {
        switch(event.key) {
            case 'ArrowUp': upKeyPressed = false; break;
            case 'ArrowDown': downKeyPressed = false; break;
            case 'w': case 'W': wKeyPressed = false; break;
            case 's': case 'S': sKeyPressed = false; break;
        }
    });

    // Begin the tournament with player aliases
    // In a real scenario, this would be handled with a form submission
    startTournament(['Alice', 'Bob', 'Carol', 'Dave']); // Replace with actual user input
}

function startTournament(playerAliases) {
    tournamentStarted = true;
    playerAliases.forEach((alias, index) => {
        tournamentPlayers[index] = { alias: alias, hasWon: false };
    });
    startMatch(1, 2);  // Start with player 1 vs player 2
}

function startMatch(player1Index, player2Index) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
    currentMatch.player1Index = player1Index;
    currentMatch.player2Index = player2Index;
}

function ballReset() {
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
        if(tournamentStarted) {
            var winnerIndex = player1Score >= WINNING_SCORE ? currentMatch.player1Index : currentMatch.player2Index;
            concludeMatch(currentMatch.player1Index, currentMatch.player2Index, winnerIndex);
        }
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function concludeMatch(player1Index, player2Index, winnerIndex) {
    tournamentPlayers[winnerIndex - 1].hasWon = true;
    
    if (player1Index === 1 && player2Index === 2) {
        startMatch(3, 4);  // Start the match between players 3 and 4
    } else {
        // Both semifinals are done, determine finalists and start final match
        var finalists = tournamentPlayers.filter(player => player.hasWon);
        if (finalists.length === 2) {
            startFinal(finalists[0], finalists[1]);
        }
    }
}

function startFinal(player1, player2) {
    var player1Index = tournamentPlayers.indexOf(player1) + 1;
    var player2Index = tournamentPlayers.indexOf(player2) + 1;
    startMatch(player1Index, player2Index);
}

function announceWinner(winnerIndex) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(tournamentPlayers[winnerIndex - 1].alias + " is the champion!", 350, 200);
    canvasContext.fillText("click to restart", 350, 500);
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
    // Clear the canvas
    colorRect(0, 0, canvas.width, canvas.height, 'black'); 

    if(showingWinScreen) {
        if (!tournamentStarted) {
            canvasContext.fillStyle = 'white';
            canvasContext.fillText("Click to continue", 350, 500);
        } else {
            announceWinner(player1Score >= WINNING_SCORE ? currentMatch.player1Index : currentMatch.player2Index);
        }
        return;
    }

    // Draw the net
    drawNet();

    // Draw paddles and the ball
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    colorCircle(ballX, ballY, 10, 'white'); // Assumes a function for drawing circles is defined

    // Draw the scores
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
