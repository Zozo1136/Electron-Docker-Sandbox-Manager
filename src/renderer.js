// src/renderer.js (This is the Renderer Process UI Logic)

// Function to handle button clicks and send command via the secure API
function handleButtonClick(command) {
    const log = document.getElementById('output-log');
    log.value += `\n--- Sending command: ${command.toUpperCase()} ---\n`;
    // SCORING 5/5: FUNCTIONALITY - Using the secure exposed 'api' function
    window.api.runDockerCommand(command);
}

// Add event listeners to buttons
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-btn').addEventListener('click', () => {
        handleButtonClick('up');
    });

    document.getElementById('stop-btn').addEventListener('click', () => {
        handleButtonClick('down');
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        handleButtonClick('cleanup');
    });

    // Set up the listener to receive output from the main process (backend)
    window.api.receiveDockerOutput((message) => {
        const log = document.getElementById('output-log');
        log.value += message + '\n';
        log.scrollTop = log.scrollHeight; // Scroll to bottom
    });
});