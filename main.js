const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // Allows you to use Node.js features in your React app
        },
    });

    // Load your React app (dist/index.html after build)
    //win.loadURL(`file://${path.join(__dirname, '/build/index.html')}`);
    win.loadURL("http://localhost:3000"); // Dev mode

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
