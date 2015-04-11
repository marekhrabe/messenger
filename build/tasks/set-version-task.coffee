fs = require 'fs'
path = require 'path'

module.exports = (grunt) ->
  {spawn} = require('./task-helpers')(grunt)

  grunt.registerTask 'set-version', 'Set the version in the plist and package.json', ->
    done = @async()
    appDir = grunt.config.get('atom.appDir')
    {version} = require(path.join(appDir, 'package.json'))

    # Replace version field of package.json.
    packageJsonPath = path.join(appDir, 'package.json')
    packageJson = require(packageJsonPath)
    packageJson.version = version
    packageJsonString = JSON.stringify(packageJson)
    fs.writeFileSync(packageJsonPath, packageJsonString)

    if process.platform is 'darwin'
      cmd = 'script/set-version'
      args = [grunt.config.get('atom.buildDir'), version]
      spawn {cmd, args}, (error, result, code) -> done(error)
    else if process.platform is 'win32'
      shellAppDir = grunt.config.get('atom.shellAppDir')
      shellExePath = path.join(shellAppDir, 'messenger.exe')

      strings =
        CompanyName: 'Marek Hrabě'
        FileDescription: 'Messenger'
        LegalCopyright: 'Copyright (C) 2015 Marek Hrabě. All rights reserved'
        ProductName: 'Messenger'
        ProductVersion: version

      rcedit = require('rcedit')
      rcedit(shellExePath, {'version-string': strings}, done)
    else
      done()
