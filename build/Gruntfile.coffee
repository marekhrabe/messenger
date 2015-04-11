fs = require 'fs'
path = require 'path'
os = require 'os'

# Add support for obselete APIs of vm module so we can make some third-party
# modules work under node v0.11.x.
require 'vm-compatibility-layer'

_ = require 'underscore-plus'

packageJson = require '../package.json'

# Shim harmony collections in case grunt was invoked without harmony
# collections enabled
_.extend(global, require('harmony-collections')) unless global.WeakMap?

module.exports = (grunt) ->
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-shell')
  grunt.loadNpmTasks('grunt-download-atom-shell')
  grunt.loadNpmTasks('grunt-atom-shell-installer')
  grunt.loadTasks('tasks')

  # This allows all subsequent paths to the relative to the root of the repo
  grunt.file.setBase(path.resolve('..'))

  if not grunt.option('verbose')
    grunt.log.writeln = (args...) -> grunt.log
    grunt.log.write = (args...) -> grunt.log

  [major, minor, patch] = packageJson.version.split('.')
  tmpDir = os.tmpdir()
  appName = if process.platform is 'darwin' then 'Messenger.app' else 'Messenger'
  buildDir = grunt.option('build-dir') ? path.join(tmpDir, 'atom-build')
  buildDir = path.resolve(buildDir)
  installDir = grunt.option('install-dir')

  home = if process.platform is 'win32' then process.env.USERPROFILE else process.env.HOME
  atomShellDownloadDir = path.join(home, '.atom', 'atom-shell')

  symbolsDir = path.join(buildDir, 'Atom.breakpad.syms')
  shellAppDir = path.join(buildDir, appName)
  if process.platform is 'win32'
    contentsDir = shellAppDir
    appDir = path.join(shellAppDir, 'resources', 'app')
    installDir ?= path.join(process.env.ProgramFiles, appName)
    killCommand = 'taskkill /F /IM messenger.exe'
  else if process.platform is 'darwin'
    contentsDir = path.join(shellAppDir, 'Contents')
    appDir = path.join(contentsDir, 'Resources', 'app')
    installDir ?= path.join('/Applications', appName)
    killCommand = 'pkill -9 Messenger'
  else
    contentsDir = shellAppDir
    appDir = path.join(shellAppDir, 'resources', 'app')
    installDir ?= process.env.INSTALL_PREFIX ? '/usr/local'
    killCommand ='pkill -9 messenger'

  installDir = path.resolve(installDir)

  coffeeConfig =
    glob_to_multiple:
      expand: true
      src: [
        'src/**/*.coffee'
        'exports/**/*.coffee'
        'static/**/*.coffee'
      ]
      dest: appDir
      ext: '.js'

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    atom: {appDir, appName, symbolsDir, buildDir, contentsDir, installDir, shellAppDir}

    docsOutputDir: 'docs/output'

    coffee: coffeeConfig

    'download-atom-shell':
      version: packageJson.atomShellVersion
      outputDir: 'atom-shell'
      downloadDir: atomShellDownloadDir
      rebuild: true  # rebuild native modules after atom-shell is updated
      token: process.env.ATOM_ACCESS_TOKEN

    'create-windows-installer':
      appDirectory: shellAppDir
      outputDirectory: path.join(buildDir, 'installer')
      authors: 'Marek Hrabě'
      loadingGif: path.resolve(__dirname, '..', 'resources', 'win', 'loading.gif')
      iconUrl: 'https://raw.githubusercontent.com/marekhrabe/messenger/master/resources/win/messenger.ico'
      setupIcon: path.resolve(__dirname, '..', 'resources', 'win', 'messenger.ico')
      remoteReleases: 'https://atom.io/api/updates'

    shell:
      'kill-atom':
        command: killCommand
        options:
          stdout: false
          stderr: false
          failOnError: false

  grunt.registerTask('compile', ['coffee'])
  grunt.registerTask('test', ['shell:kill-atom', 'run-specs'])

  ciTasks = ['output-disk-space', 'download-atom-shell', 'download-atom-shell-chromedriver', 'build']
  ciTasks.push('dump-symbols') if process.platform isnt 'win32'
  ciTasks.push('set-version', 'check-licenses')
  ciTasks.push('mkdeb') if process.platform is 'linux'
  ciTasks.push('create-windows-installer') if process.platform is 'win32'
  ciTasks.push('test') if process.platform is 'darwin'
  ciTasks.push('codesign')
  ciTasks.push('publish-build')
  grunt.registerTask('ci', ciTasks)

  defaultTasks = ['download-atom-shell', 'download-atom-shell-chromedriver', 'build', 'set-version']
  defaultTasks.push 'install' unless process.platform is 'linux'
  grunt.registerTask('default', defaultTasks)
