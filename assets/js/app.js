// Action sender
var ipc = require('ipc');
var shell = require('shell');
var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var doAction = function(action) {
	ipc.send('do-native-action', action);
};

// Application Buttons
var btn_close = document.getElementById('btn-close');
var btn_minimize = document.getElementById('btn-minimize');

btn_close.addEventListener('click', function(e) {
	e.preventDefault();
	doAction('quit');
}, false);

btn_minimize.addEventListener('click', function(e) {
	e.preventDefault();
	doAction('minimize');
}, false);

// Ready window actions
onload = function() {
	document.getElementsByTagName('body')[0].className += ' ready';
	
	var webview = document.getElementById("messenger");	
	webview.addEventListener('new-window', function(e) {
		shell.openExternal(e.url);
	});
}

// Menus
var menu = new Menu();
var template = [{
	label: 'Messenger',
	submenu: [{
		label: 'About Messenger',
		selector: 'orderFrontStandardAboutPanel:'
	}, {
		type: 'separator'
	}, {
		label: 'Services',
		submenu: []
	}, {
		type: 'separator'
	}, {
		label: 'Hide Messenger',
		accelerator: 'Command+H',
		selector: 'hide:'
	}, {
		label: 'Hide Others',
		accelerator: 'Command+Shift+H',
		selector: 'hideOtherApplications:'
	}, {
		label: 'Show All',
		selector: 'unhideAllApplications:'
	}, {
		type: 'separator'
	}, {
		label: 'Quit',
		accelerator: 'Command+Q',
		click: function() {
			doAction('quit');
		}
	}, ]
}, {
	label: 'Edit',
	submenu: [{
		label: 'Undo',
		accelerator: 'Command+Z',
		selector: 'undo:'
	}, {
		label: 'Redo',
		accelerator: 'Shift+Command+Z',
		selector: 'redo:'
	}, {
		type: 'separator'
	}, {
		label: 'Cut',
		accelerator: 'Command+X',
		selector: 'cut:'
	}, {
		label: 'Copy',
		accelerator: 'Command+C',
		selector: 'copy:'
	}, {
		label: 'Paste',
		accelerator: 'Command+V',
		selector: 'paste:'
	}, {
		label: 'Select All',
		accelerator: 'Command+A',
		selector: 'selectAll:'
	}, ]
}, {
	label: 'Window',
	submenu: [{
		label: 'Minimize',
		accelerator: 'Command+M',
		selector: 'performMiniaturize:'
	}, {
		label: 'Close',
		accelerator: 'Command+W',
		selector: 'performClose:'
	}, {
		type: 'separator'
	}, {
		label: 'Bring All to Front',
		selector: 'arrangeInFront:'
	}, ]
}, {
	label: 'Help',
	submenu: []
}, ];

menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);