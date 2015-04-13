var fs = require('fs');
var defaults = require('lodash').defaults;
var app = require('app');
var ipc = require('ipc');
var BrowserWindow = require('browser-window');
var path = require('path');
var AutoUpdateManager = require('./updates');
var dialog = require('dialog');

var staticPath = path.join(__dirname, '..', 'static');

var mainWindow = null;
var runtimeSettingsPath = null;

// App
app.on('ready', function () {
  var windowOptions = {
    width: 800,
    height: 600,
    frame: false,
    'web-preferences': {
      plugins: true
    },
    title: 'Loading'
  };

  runtimeSettingsPath = path.join(app.getPath('userData'), 'runtimeSettings.json');

  var savedWindowOptions = {};
  try {
    savedWindowOptions = JSON.parse(fs.readFileSync(runtimeSettingsPath));
  } catch(e) {}

  windowOptions = defaults(savedWindowOptions, windowOptions);

  mainWindow = new BrowserWindow(windowOptions);
  mainWindow.loadUrl('file://' + staticPath + '/app.html');

  mainWindow.on('closed', function() {
    var size = mainWindow.getSize();
    var position = mainWindow.getPosition();
    var windowProperties = {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1]
    };
    fs.writeFile(runtimeSettingsPath, JSON.stringify(windowProperties), function(err) {
      app.quit();
      mainWindow = null;
    });
  })
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
