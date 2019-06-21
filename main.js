const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const {app, BrowserWindow, ipcMain} = electron;

let mainWindow;

const appReadyEvent = () => {
  mainWindow = new BrowserWindow({
    minWidth: 1000,
    minHeight: 720,
    center: true,
    frame:false
  });
  mainWindow.setMenuBarVisibility(false)
  mainWindow.setResizable(true);
  mainWindow.center();
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }));
}

app.on('ready', appReadyEvent);

app.on('window-all-closed', () => {
  app.quit();
});