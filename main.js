var app = require('app')
var BrowserWindow = require('browser-window')
var shell = require('shell')

var mainWindow = null

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    'accept-first-mouse': true,
    'node-integration': false,
    title: 'Loading',
  })

  mainWindow.loadUrl('https://www.messenger.com')

  // Tell the system to take care of all external links
  mainWindow.webContents.on('new-window', function(event, url) {
    event.preventDefault()
    shell.openExternal(url)
  })

  mainWindow.on('closed', function () {
    mainWindow = null
    app.quit()
  })
})
