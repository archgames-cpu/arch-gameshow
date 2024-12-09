const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }); // WebSocket server on port 8080

let games = {}; // Object to hold active games

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        const data = JSON.parse(message);

        if (data.type === 'join') {
            const { username, character } = data.player;
            const gameCode = data.gameCode;

            if (!games[gameCode]) {
                games[gameCode] = { players: [] };
            }

            games[gameCode].players.push({ username, character });
            broadcast(gameCode); // Broadcast updated players list
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function broadcast(gameCode) {
    const messageData = JSON.stringify({ type: 'update', players: games[gameCode].players });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(messageData); // Send updated list to all connected clients
        }
    });
}

console.log("WebSocket server is running on ws://localhost:8080");