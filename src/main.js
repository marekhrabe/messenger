var app = require('app')
var BrowserWindow = require('browser-window')

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

  mainWindow.on('closed', function () {
    mainWindow = null
    app.quit()
  })
})
