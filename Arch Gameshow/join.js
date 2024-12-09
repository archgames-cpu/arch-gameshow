let selectedCharacter = null;

// Function to join a game
function joinGame() {
    const username = document.getElementById('username').value;
    const gameCode = document.getElementById('gameCode').value.toUpperCase(); // Convert to uppercase

    if (!username || !gameCode) {
        alert("Please enter both username and game code.");
        return;
    }

    console.log("Entered Game Code:", gameCode);
    
    if (games[gameCode]) {
        games[gameCode].players.push(username); // Add player to the game's player list

        alert(`Welcome ${username}! You have joined the game with code ${gameCode}.`);
        
        window.location.href = 'dashboard.html'; // Redirect to dashboard
    } else {
        alert("Invalid game code. Please try again.");
    }
}

// Function to check if Enter key is pressed
function checkEnter(event) {
    if (event.key === 'Enter') {
        joinGame(); // Call joinGame function when Enter is pressed
    }
}

// Function to select a character
function selectCharacter(character) {
    selectedCharacter = character;
    document.getElementById('selected-character').textContent = `Selected Character: ${character}`;
}