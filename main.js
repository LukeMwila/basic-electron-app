const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");

/**
 * This is a global reference to the window object.
 * If we don't create this, the window will be closed
 * automatically when the JS object is garabge collected.
 */
let win;

function createWindow() {
  // Create browser window
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // this will load the index.html file
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Open devtools
  win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
}

// Run create window function
app.on("ready", () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  // Check to see if a user is not on a Mac
  // If user is on OS X, process.platform will be darwin
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("app_version", event => {
  event.sender.send("app_version", { version: app.getVersion() });
});

autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("update_available");
});

autoUpdater.on("update-downloaded", () => {
  mainWindow.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
