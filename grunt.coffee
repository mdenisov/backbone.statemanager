module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-rigger'
  grunt.loadNpmTasks 'grunt-jasmine-runner'
  grunt.loadNpmTasks 'grunt-coffee'

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
      app :
        src : ['src/coffeescripts/*.coffee']
        dest : 'src/javascripts'
        options :
          bare: true

    lint :
      files : ['src/statemanager.*.js']

    rig :
      build :
        src : ['<banner:meta.banner>', 'src/javascripts/build/statemanager.js']
        dest : 'lib/backbone.statemanager.js'

    min :
      standard :
        src : [
          '<banner:meta.banner>'
          '<config:rig.build.dest>'
        ]
        dest: 'lib/backbone.statemanager.min.js'

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

    jshint :
      options :
        curly : true
        eqeqeq : true
        immed : false
        latedef : true
        newcap : true
        noarg : true
        sub : true
        undef : true
        boss : true
        eqnull : true
        browser : true

      globals :
        jQuery : true
        Backbone : true
        _ : true
        StateManager : true
        $ : true

    uglify: {}

  grunt.registerTask 'default', 'lint rig min'