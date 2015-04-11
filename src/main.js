var app = require('app');
var ipc = require('ipc');
var BrowserWindow = require('browser-window');
var path = require('path');

var staticPath = path.join(__dirname, '..', 'static');

var mainWindow = null;

// App
app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    resizable: false,
    'web-preferences': {
      plugins: true
    },
    'accept-first-mouse': true,
    title: 'Loading'
  });

  mainWindow.loadUrl('file://' + staticPath + '/app.html');
});

// API
ipc.on('do-native-action', function(event, action) {
  switch (action) {
    case 'quit':
      app.quit();
      break;

    case 'minimize':
      mainWindow.minimize();
      break;
  }
});
