// Generated by CoffeeScript 1.3.3

/*
Backbone.Statemanager, v0.0.1-alpha
Copyright (c)2012 Patrick Camacho and Mark Roseboom, Crashlytics
Distributed under MIT license
http://github.com/crashlytics/backbone.statemanager
*/


(function() {

  Backbone.StateManager = (function(Backbone, _) {
    var StateManager;
    StateManager = function(states, options) {
      var _this = this;
      this.options = options != null ? options : {};
      this.states = {};
      if (_.isObject(states)) {
        return _.each(states, function(value, key) {
          return _this.addState(key, value);
        });
      }
    };
    StateManager.extend = Backbone.View.extend;
    _.extend(StateManager.prototype, Backbone.Events, {
      addState: function(state, callbacks) {
        this.states[state] = callbacks;
        return this.trigger('add:state', state);
      },
      removeState: function(state) {
        delete this.states[state];
        return this.trigger('remove:state', state);
      },
      getCurrentState: function() {
        return this.currentState;
      },
      initialize: function(options) {
        var initial,
          _this = this;
        if (options == null) {
          options = {};
        }
        if (initial = _.chain(this.states).keys().find(function(state) {
          return _this.states[state].initial;
        }).value()) {
          return this.triggerState(initial, options);
        }
      },
      triggerState: function(state, options) {
        var newState;
        if (options == null) {
          options = {};
        }
        if (!(newState = this._matchState(state))) {
          return false;
        }
        if (!(newState === this.states[this.currentState] && !options.reEnter)) {
          if (this.currentState) {
            this.exitState(options);
          }
          return this.enterState(state, options);
        } else {
          return false;
        }
      },
      enterState: function(state, options) {},
      exitState: function(options) {
        var matchedState;
        if (options == null) {
          options = {};
        }
        if (!((matchedState = this._matchState(this.currentState)) && _.isFunction(matchedState.exit))) {
          return false;
        }
        this.trigger('before:exit:state', this.currentState, matchedState, options);
        matchedState.exit(options);
        return this.trigger('exit:state', this.currentState, matchedState, options);
      },
      _matchState: function(state) {
        var stateRegex;
        if (!_.isString(state)) {
          return false;
        }
        state = state.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&').replace(/:\w+/g, '([^\/]+)').replace(/\*\w+/g, '(.*?)');
        stateRegex = new RegExp("^" + state + "$");
        return _.chain(this.states).keys().find(function(state) {
          return stateRegex.test(state);
        }).value();
      }
    });
    StateManager.addStateManager = function(target, options) {
      var stateManager;
      if (options == null) {
        options = {};
      }
      if (!target) {
        new Error('Target must be defined');
      }
      _.deepBindAll(target.states, target);
      stateManager = new Backbone.StateManager(target.states, options);
      target.triggerState = function() {
        return stateManager.triggerState.apply(stateManager, arguments);
      };
      target.getCurrentState = function() {
        return stateManager.getCurrentState();
      };
      if (options.initialize || _.isUndefined(options.initialize)) {
        stateManager.initialize(options);
      }
      return delete target.states;
    };
    _.deepBindAll = function(obj) {
      var target;
      target = _.last(arguments);
      _.each(obj, function(value, key) {
        if (_.isFunction(value)) {
          return obj[key] = _.bind(value, target);
        } else if (_.isObject(value)) {
          return obj[key] = _.deepBindAll(value, target);
        }
      });
      return obj;
    };
    return StateManager;
  })(Backbone, _);

}).call(this);
