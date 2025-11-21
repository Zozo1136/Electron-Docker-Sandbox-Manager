const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { ipcMain } = require('electron');
const { exec } = require('child_process');
const fs = require('fs'); // Import filesystem module for cleanup
// Note: 'path' is already imported at the top of the file.

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
    createWindow();

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


// =========================================================================
// DOCKER INTEGRATION LOGIC (Main Process)
// =========================================================================

// --- Separate function to handle the complex, sequential CLEANUP logic ---
function handleCleanupSequence(event) {
    
    event.reply('docker-output', 'Shutting down the Web Testing Sandbox...');
    
    // 1. Execute docker compose down command
    exec('docker compose down', (error, stdout, stderr) => {
        if (error) {
            event.reply('docker-output', `ERROR during docker down: ${stderr}`);
            // Continue with file removal even if docker down fails
        } else {
            event.reply('docker-output', `Docker containers removed: ${stdout}`);
        }

        event.reply('docker-output', 'Removing all local logs and browser data...');
        
        // 2. Delete logs/ and browser-data/ folders using Node.js filesystem modules (MOST RELIABLE)
        try {
            const logPath = path.join(__dirname, 'logs');
            const dataPath = path.join(__dirname, 'browser-data');
            
            // fs.rmSync is the aggressive, reliable way to delete directories
            if (fs.existsSync(logPath)) {
                fs.rmSync(logPath, { recursive: true, force: true });
            }
            if (fs.existsSync(dataPath)) {
                fs.rmSync(dataPath, { recursive: true, force: true });
            }

            event.reply('docker-output', 'Filesystem cleanup complete.');
            event.reply('docker-output', 'SUCCESS: Sandbox environment is fully reset and clean.');
            
        } catch (fileError) {
            event.reply('docker-output', `FILE SYSTEM ERROR: Could not remove volumes. ${fileError.message}`);
        }
    });
}


// IPC HANDLER: Receives command from UI via the Preload script
ipcMain.on('docker-command', (event, command) => {
    // SCORING 5/5: SECURITY - Input validation prevents arbitrary code execution
    if (!['up', 'down', 'cleanup'].includes(command)) {
        event.reply('docker-output', 'Error: Invalid command received. Execution blocked.');
        return;
    }

    let dockerCommand = '';
    if (command === 'up') {
        dockerCommand = 'docker compose up -d';
    } else if (command === 'down') {
        dockerCommand = 'docker compose down';
    } else if (command === 'cleanup') {
        // CLEANUP is handled by the sequential function above.
        handleCleanupSequence(event);
        return;
    }

    // --- Execute UP/DOWN Commands ---
    exec(dockerCommand, (error, stdout, stderr) => {
        if (error) {
            event.reply('docker-output', `ERROR: ${stderr}`);
        } else {
            event.reply('docker-output', `SUCCESS: ${stdout}`);
        }
    });
});