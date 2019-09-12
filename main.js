const { app, BrowserWindow, autoUpdater } = require("electron");
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
    icon: __dirname + "/img/gear-icon.png",
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
app.on("ready", createWindow);

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", () => {
  sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", () => {
  sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", err => {
  sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
});
autoUpdater.on("download-progress", progressObj => {
  sendStatusToWindow(
    `Download speed: ${progressObj.bytesperSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred})`
  );
});
autoUpdater.on("update-downloaded", info => {
  sendStatusToWindow("Update downloaded; will install now");
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 500ms
  // You could call autoUpdater.quitAndInstall(); immediate;y
  autoUpdater.quitAndInstall();
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  // Check to see if a user is not on a Mac
  // If user is on OS X, process.platform will be darwin
  if (process.platform !== "darwin") {
    app.quit();
  }
});
