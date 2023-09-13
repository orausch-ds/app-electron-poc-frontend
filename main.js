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

process.env.BASE_URL = 'http://localhost:9229';
process.env.APP_DIR = path.join(__dirname, 'app')

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

  var child = spawnChildProcess();

  mainWindow.loadURL(`file://${__dirname}/app/html/loading.html`)

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

  mainWindow.on('closed', function () {
    kill(child.pid);
    mainWindow = null
  })
})

app.on('window-all-closed', () => { app.quit() })


function spawnChildProcess() {
  return require('child_process').spawn(
    path.join(__dirname, 'backend', 'custom-jre', 'bin', 'java.exe'), ['-jar', getPathToBackendJar(), '']
  );
}

function getPathToBackendJar() {
  const jarPattern = /^electron-poc-backend-jar-.*\.jar$/;
  const jarFiles = [];
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
    return path.join(backendPath, jarFiles[0]);  
  }
}