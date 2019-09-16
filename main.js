const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");

/**
 * This is a global reference to the window object.
 * If we don't create this, the window will be closed
 * automatically when the JS object is garabge collected.
 */
let win;
let workerWindow;

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

  // create hidden worker window
  workerWindow = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true }
  });

  // this will load the worker.html file
  workerWindow.loadFile("worker.html");

  // Open devtools
  win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
}

function sendWindowMessage(targetWindow, message, payload) {
  if (typeof targetWindow === "undefined") {
    console.log("Target window does not exist");
    return;
  }
  console.log("[Step 2]: The message has been sent by the worker");
  console.log("[Message Payload]: ", payload);
  targetWindow.webContents.send(message, payload);
}

// Run create window function
app.on("ready", async () => {
  createWindow();
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 60000); // 900000 every 15 minutes

  ipcMain.on("message-from-worker", (event, arg) => {
    console.log("[Step 1]: Here sending message from worker");
    sendWindowMessage(win, "message-from-worker", arg);
  });
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  // Check to see if a user is not on a Mac
  // If user is on OS X, process.platform will be darwin
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on("app_version", event => {
  event.sender.send("app_version", { version: app.getVersion() });
});

autoUpdater.on("update-available", () => {
  win.webContents.send("update_available");
});

autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
