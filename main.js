const { app, BrowserWindow } = require("electron");
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

// Quit when all windows are closed
app.on("window-all-closed", () => {
  // Check to see if a user is not on a Mac
  // If user is on OS X, process.platform will be darwin
  if (process.platform !== "darwin") {
    app.quit();
  }
});
