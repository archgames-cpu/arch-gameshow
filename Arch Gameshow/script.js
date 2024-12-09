let games = JSON.parse(localStorage.getItem('games')) || {}; // Load existing games from local storage
let currentGameCode = ''; // Global variable to store the current game code
let isGameActive = false; // Flag to indicate if a game is currently active
let selectedCharacter = null; // Variable to store selected character
let socket; // Declare WebSocket variable

// Automatically connect to WebSocket server on page load
window.onload = function() {
    socket = new WebSocket('ws://localhost:8080');
    
    socket.onopen = () => {
        console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'update') {
            games[currentGameCode].players = data.players; // Update players list
            localStorage.setItem('games', JSON.stringify(games)); // Update local storage
            updatePlayerList(); // Refresh player list display
        }
    };
};

function createGame() {
    const username = document.getElementById('username').value;
    if (!username) {
        customAlert("Please enter a username.");
        return;
    }

    // Show character selection container
    document.getElementById('character-selection-container').style.display = 'block';
    
    // Check if there is already an existing game
    if (isGameActive) {
        customAlert("A game is already in progress. Please join the existing game or cancel it before creating a new one.");
        return; // Prevent creating a new game
    }

    currentGameCode = Math.random().toString(36).substring(2, 6).toUpperCase(); // Generate uppercase game code
    games[currentGameCode] = { players: [{ username, character: selectedCharacter }], host: username };

    customAlert(`Game created! Join with code: ${currentGameCode}`);
    
    localStorage.setItem('games', JSON.stringify(games)); // Store updated games in local storage
    localStorage.setItem('currentGameCode', currentGameCode); // Store current game code
    localStorage.setItem('isGameActive', true); // Set flag for active game
    isGameActive = true; // Update flag in memory
    
    window.location.href = 'dashboard.html'; // Redirect to dashboard
}

function handleGameCodeInput(input) {
    input.value = input.value.toUpperCase(); // Convert input value to uppercase

    if (input.value.length > 4) {
        input.value = input.value.substring(0, 4); // Limit input to 4 characters
    }
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        checkGameCode(); // Call checkGameCode function when Enter is pressed
    }
}

function checkGameCode() {
    const username = document.getElementById('username').value;
    const gameCode = document.getElementById('gameCode').value.toUpperCase(); // Convert entered code to uppercase

    console.log("Entered Game Code:", gameCode);
    
    if (games[gameCode]) {
        if (!username) {
            customAlert("Please enter a username.");
            return;
        }
        
        const character = selectedCharacter || "None"; // Use selected character or default to "None"
        
        games[gameCode].players.push({ username, character }); // Add player with character info
        
        customAlert(`Welcome ${username}! You have joined the game with code ${gameCode}.`);
        
        localStorage.setItem('games', JSON.stringify(games)); // Update games in local storage
        window.location.href = 'dashboard.html'; // Redirect to dashboard
    } else {
        customAlert("Invalid game code. Please try again.");
    }
}

// Function to select a character
function selectCharacter(character) {
    selectedCharacter = character;
    document.getElementById('selected-character').textContent = `Selected Character: ${character}`;
}

// Custom alert functionality
function showCustomAlert(message, duration = 5000) {
    const alertContainer = document.getElementById('custom-alert-container');
    
    // Create a new alert element
    const alertElement = document.createElement('div');
    alertElement.className = 'custom-alert';
    
    const messageElement = document.createElement('span');
    messageElement.textContent = message; // Set the alert message
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = 'X';
    
    // Close alert function
    closeButton.onclick = function() {
        alertContainer.removeChild(alertElement); // Remove the alert from the container
    };
    
    // Append elements to the alert
    alertElement.appendChild(messageElement);
    alertElement.appendChild(progressBar);
    alertElement.appendChild(closeButton);
    
    // Append the new alert to the container
    alertContainer.appendChild(alertElement);
    
  	// Start the progress bar animation
  	progressBar.style.width = '100%';

  	const interval = setInterval(() => {
      	let currentWidth = parseFloat(progressBar.style.width);
      	if (currentWidth > 0) {
          	progressBar.style.width = (currentWidth - (100 / (duration / 100))) + '%';
      	} else {
          	clearInterval(interval);
          	closeButton.click(); // Close when progress is complete
      	}
  	}, 100);

  	// Automatically close the alert after specified duration
  	setTimeout(() => {
      	clearInterval(interval);
      	closeButton.click(); // Close after duration
  	}, duration);
}

function customAlert(message) {
  	showCustomAlert(message);
}

// Function to update the player list display on dashboard
function updatePlayerList() {
    const playerListDiv = document.getElementById('player-list');
    playerListDiv.innerHTML = ''; // Clear existing list

    // Display the host at the top
    if (games[currentGameCode]) {
        const host = games[currentGameCode].host;
        const hostCharacter = games[currentGameCode].players.find(player => player.username === host).character; 
        const hostItem = document.createElement('div');
        hostItem.textContent = `${host} (Host) - Character: ${hostCharacter || "None"}`;
        hostItem.className = 'player-item'; 
        playerListDiv.appendChild(hostItem);

        // Divider between host and other players
        const divider = document.createElement('hr');
        divider.className = 'divider'; 
        playerListDiv.appendChild(divider);

        // Display other players below the host, excluding the host from this list
        games[currentGameCode].players.forEach(player => {
            if (player.username !== host) { 
                const playerItem = document.createElement('div');
                playerItem.textContent = `${player.username} - Character: ${player.character || "None"}`; 
                playerItem.className = 'player-item'; 
                playerListDiv.appendChild(playerItem);
            }
        });
    }
}