ipc = require 'ipc'
shell = require 'shell'

# Window buttons
for action in ['close', 'minimize']
  document.querySelector("#btn-#{action}").addEventListener 'click', (e) ->
    e.preventDefault()
    ipc.send('do-native-action', action)

# Show window UI
document.body.classList.add('ready')

# Handle webview
webview = document.getElementById("messenger")
webview.addEventListener 'new-window', (e) ->
  e.preventDefault()
  shell.openExternal(e.url)

# Menus
require('./js/menu')
