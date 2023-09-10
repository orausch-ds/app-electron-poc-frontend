'use strict'

const electron = require('electron')
const app = electron.app
const globalShortcut = electron.globalShortcut
const os = require('os')
const path = require('path')
const fs = require('fs')
const config = require(path.join(__dirname, 'package.json'))
const BrowserWindow = electron.BrowserWindow
var kill  = require('tree-kill');

app.name = config.productName
var mainWindow = null
app.on('ready', function () {
  mainWindow = new BrowserWindow({
    backgroundColor: 'lightgray',
    title: config.productName,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      defaultEncoding: 'UTF-8',
    }
  })

  var child = require('child_process').spawn(
    'java', ['-jar', getPathToJar(), '']
  );

  function getPathToJar() {
    const jarPattern = /^electron-poc-backend-jar-.*\.jar$/;
    const jarFiles = [];
    var jarPath;
    const backendPath = path.join(__dirname, 'backend');

    const files = fs.readdirSync(backendPath);
    for (const file of files) {
      if (file.match(jarPattern)) {
        jarFiles.push(file);
      }
    }
  
    if (jarFiles.length === 0) {
      throw new Error('No matching JAR files found.');
    } else {
      // Loads 1 matching jar 
      return path.join(backendPath, jarFiles[0]);  
    }
  }

  setTimeout(function() {
    mainWindow.loadURL(`file://${__dirname}/app/html/order.html`)
  }, 10000);

  // Enable keyboard shortcuts for Developer Tools on various platforms.
  let platform = os.platform()
  if (platform === 'darwin') {
    globalShortcut.register('Command+Option+I', () => {
      mainWindow.webContents.openDevTools()
    })
  } else if (platform === 'linux' || platform === 'win32') {
    globalShortcut.register('Control+Shift+I', () => {
      mainWindow.webContents.openDevTools()
    })
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.setMenu(null)
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.onbeforeunload = (e) => {
    // Prevent Command-R from unloading the window contents.
    e.returnValue = false
  }

  console.error(child.pid)

  mainWindow.on('closed', function () {
    console.error('Kill the child')
    kill(child.pid);
    mainWindow = null
  })
})

app.on('window-all-closed', () => { app.quit() })
