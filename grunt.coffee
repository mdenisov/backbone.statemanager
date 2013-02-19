module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-rigger'
  grunt.loadNpmTasks 'grunt-jasmine-runner'

  grunt.initConfig
    pkg : '<json:package.json>'

    meta :
      version : '<%= pkg.version %>'
      banner :
        '// Backbone.Statemanager, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Patrick Camacho and Mark Roseboom, Crashlytics\n' +
        '// Distributed under MIT license\n' +
        '// http://github.com/crashlytics/backbone.statemanager\n'

    minifyjs :
      standard :
        src : [
          '<banner:meta.banner>'
          '<config:rig.build.dest>'
        ]
        dest : 'lib/backbone.marionette.min.js'

    coffee :
      compile :
        files :
          'src/javascripts/*.js' : 'src/coffeescripts/*.coffee'
          'src/javascripts/build/*.js' : 'src/coffeescripts/build/*.coffee'
          'spec/javascripts/*.spec.js' : 'spec/coffeescripts/*.spec.coffee'
        options :
          bare : true

    rig :
      compile :
        src : 'src/javascripts/build/statemanager.js'
        dest : 'lib/backbone.statemanager.js'

    min :
      files :
        src : ['<banner:meta.banner>', 'lib/backbone.statemanager.js']
        dest : 'lib/backbone.statemanger.min.js'

    uglify: {}

    jasmine :
      src : [
        'vendor/javascripts/jquery-1.9.1.js'
        'vendor/javascripts/underscore-1.4.4.js'
        'vendor/javascripts/backbone-0.9.10.js'
        'src/javascripts/build/statemanager.js'
        'src/javascripts/statemanager.helpers.js'
        'src/javascripts/statemanager.transition.js'
        'src/javascripts/statemanager.transitions.js'
        'src/javascripts/statemanager.states.js'
        'src/javascripts/statemanager.state.js'
        'src/javascripts/statemanager.manager.js'
      ]
      helpers : 'spec/javascripts/helpers/*.js'
      specs : 'spec/javascripts/*.spec.js'

    'jasmine-server' :
      browser : false

  grunt.registerTask 'default', 'coffee rig min'
