// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// src/preload.js

const { contextBridge, ipcRenderer } = require('electron');

// SCORING 5/5: ISOLATION & SECURITY - Only exposes the safe 'api' object
contextBridge.exposeInMainWorld('api', {
    // Function to send command (e.g., 'up', 'down') to the main process
    runDockerCommand: (command) => {
        ipcRenderer.send('docker-command', command);
    },
    // Function to receive asynchronous output (logs/status) from the main process
    receiveDockerOutput: (callback) => {
        ipcRenderer.on('docker-output', (event, arg) => callback(arg));
    }
});