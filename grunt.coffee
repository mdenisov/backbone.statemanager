module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-jasmine-runner'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-rigger'

  grunt.initConfig
    pkg : '<json:package.json>'

    meta :
      version : '<%= pkg.version %>'
      banner :
        '// Backbone.Statemanager, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Patrick Camacho and Mark Roseboom, Crashlytics\n' +
        '// Distributed under MIT license\n' +
        '// http://github.com/crashlytics/backbone.statemanager\n'

    coffee :
      compile :
        files :
          'src/javascripts/*.js' : 'src/coffeescripts/*.coffee'
          'src/javascripts/build/*.js' : 'src/coffeescripts/build/*.coffee'

    rig :
      build :
        src : ['<banner:meta.banner>', 'src/javascripts/build/statemanager.js']
        dest : 'lib/backbone.statemanager.js'

    min :
      files :
        src : ['<banner:meta.banner>', 'lib/backbone.statemanager.js']
        dest : 'lib/backbone.statemanger.min.js'

    uglify: {}

    jasmine :
      src : [
        'vendor/javascripts/jquery.js'
        'vendor/javascripts/json2.js'
        'vendor/javascripts/underscore.js'
        'vendor/javascripts/backbone.js'
        'src/build/statemanager.js'
        'src/statemanager.helpers.js'
        'src/statemanager.states.js'
        'src/statemanager.state.js'
      ]
      helpers : 'spec/javascripts/helpers/*.js'
      specs : 'spec/javascripts/**/*.spec.js'

    'jasmine-server' :
      browser : false

  grunt.registerTask 'default', 'coffee rig min'