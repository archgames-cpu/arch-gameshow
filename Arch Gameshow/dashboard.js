let players = []; // Array to hold connected players
let currentGameCode = ''; // Global variable to store the current game code
let socket; // Declare WebSocket variable

// Connect to the WebSocket server on page load
window.onload = function() {
    socket = new WebSocket('ws://localhost:8080');
    
    socket.onopen = () => {
        console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'update') {
            players = data.players; // Update local players array
            updatePlayerList(); // Refresh player list display
        }
    };
};

// Function to add a player (not needed here but kept for consistency)
function addPlayer(playerName, character) {
    players.push({ name: playerName, character: character });
    updatePlayerList();

    // Notify server of new player joining (not needed here but kept for consistency)
    socket.send(JSON.stringify({ type: 'join', player: { username: playerName, character }, gameCode: currentGameCode }));
}

// Function to update the player list display
function updatePlayerList() {
    const playerListDiv = document.getElementById('player-list');
    playerListDiv.innerHTML = ''; // Clear existing list

    // Display the host at the top
    if (localStorage.getItem('games')) {
        const storedGames = JSON.parse(localStorage.getItem('games'));
        const storedCode = localStorage.getItem('currentGameCode');
        currentGameCode = storedCode;

        const host = storedGames[storedCode].host;
        const hostCharacter = storedGames[storedCode].players.find(player => player.username === host).character; 
        const hostItem = document.createElement('div');
        hostItem.textContent = `${host} (Host) - Character: ${hostCharacter || "None"}`;
        hostItem.className = 'player-item'; 
        playerListDiv.appendChild(hostItem);

        // Divider between host and other players
        const divider = document.createElement('hr');
        divider.className = 'divider'; 
        playerListDiv.appendChild(divider);

        // Display other players below the host, excluding the host from this list
        storedGames[storedCode].players.forEach(player => {
            if (player.username !== host) { 
                const playerItem = document.createElement('div');
                playerItem.textContent = `${player.username} - Character: ${player.character || "None"}`; 
                playerItem.className = 'player-item'; 
                playerListDiv.appendChild(playerItem);
            }
        });
    }
}

// Function to start the game
function startGame() {
    if (players.length > 1) {
        alert('Starting game...');
        // Logic to start the game goes here...
    } else {
        alert('At least one extra player is required to start the game.');
    }
}

// Function to cancel the game and redirect to homepage
function cancelGame() {
    players = []; // Clear connected players
    updatePlayerList(); // Refresh player list display

    alert('The game has been canceled.'); // Notify user

    // Clear local storage
    localStorage.removeItem('games');
    localStorage.removeItem('currentGameCode');
    localStorage.removeItem('isGameActive');

    // Redirect to homepage after canceling
    window.location.href = 'index.html'; // Change this to your homepage URL if different
}

// Function to set the game code on the dashboard (to be called on dashboard load)
function setGameCode(code) {
    document.getElementById('code-value').textContent = code; // Update displayed game code on dashboard
}

// On page load, set the game code (using local storage or URL parameters)
window.onload = function() {
    const storedGames = JSON.parse(localStorage.getItem('games')) || {};
    const storedCode = localStorage.getItem('currentGameCode'); 
    const storedActiveState = localStorage.getItem('isGameActive'); 

    if (storedActiveState === 'true' && storedGames[storedCode]) { 
        currentGameCode = storedCode; 
        setGameCode(storedCode); 
        
        updatePlayerList(); // Update player list display
    } else {
        setGameCode("No active game"); 
    }
};