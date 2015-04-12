var app = require('app');
var ipc = require('ipc');
var BrowserWindow = require('browser-window');
var path = require('path');
var AutoUpdateManager = require('./updates');
var dialog = require('dialog');

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
    title: 'Loading'
  });

  mainWindow.loadUrl('file://' + staticPath + '/app.html');
});

// API
ipc.on('do-native-action', function(event, action) {
  switch (action) {
    case 'close':
      app.quit();
      break;

    case 'minimize':
      mainWindow.minimize();
      break;
  }
});

// Auto updater

updater = new AutoUpdateManager(app.getVersion())
updater.on('state-changed', function () {
  if (updater.state === 'update-available') {
    dialog.showMessageBox({
      type: 'info',
      buttons: ['Install and Relaunch', 'Not now'],
      message: 'Messenger Update Available',
      detail: "New version of Messenger is available and ready to be installed.",
    }, function (result) {
      if (result === 0) {
        updater.install();
      }
    })
  }
})
