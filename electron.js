const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { connectToDatabase } = require('./db');

let mainWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: true,
        },
    });

    await mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

ipcMain.on('add-user', async (event, user) => {
    const db = await connectToDatabase();
    const result = await db.collection('users').insertOne(user);
    console.log(`Utilisateur ajouté avec l'ID: ${result.insertedId}`);
    event.reply('user-added', { id: result.insertedId, ...user });
});
