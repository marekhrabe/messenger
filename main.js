var app = require('app');
var ipc = require('ipc');
var BrowserWindow = require('browser-window');

var mainWindow = null;

// App
app.on('ready', function () {
	//if (app.dock) app.dock.hide()
	
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

	mainWindow.loadUrl('file://' + __dirname + '/app.html');
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
