remote = require 'remote'
app = remote.require 'app'
ipc = require 'ipc'
shell = require 'shell'

# Window buttons
addButtonListener = (action) ->
  document.querySelector("#btn-#{action}").addEventListener 'click', (e) ->
    e.preventDefault()
    ipc.send('do-native-action', action)

addButtonListener(action) for action in ['close', 'minimize']

# Show window UI
document.body.classList.add('ready')

# Handle webview
titleElement = document.querySelector('#title')

webview = document.getElementById("messenger")
webview.addEventListener 'did-finish-load', ->
  webview.focus()
webview.addEventListener 'new-window', (e) ->
  e.preventDefault()
  shell.openExternal(e.url)

# Autofocus Messenger webview
window.addEventListener 'focus', ->
  webview.focus()

# Handle <title> changes
lastTitle = null
setInterval ->
  title = webview.getTitle()
  if title and title isnt lastTitle and title.indexOf('http') isnt 0
    titleElement.innerHTML = title

    badgeResult = (/(?:\(([0-9])\) )?messenger/ig).exec(title)
    if badgeResult
      app.dock.setBadge(badgeResult[1] or '')

    lastTitle = title
, 300

# Menus
require('./js/menu')
