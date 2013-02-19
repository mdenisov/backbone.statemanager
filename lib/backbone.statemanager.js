// Backbone.Statemanager, v
// Copyright (c)2013 Patrick Camacho and Mark Roseboom, Crashlytics
// Distributed under MIT license
// http://github.com/crashlytics/backbone.statemanager

(function() {

  (function(Backbone, _, $) {
    var StateManager;
    StateManager = {};
    Backbone.StateManager = StateManager;
    
  (function() {
  
    StateManager.regExpStateConversion = function(name) {
      name = name.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&').replace(/:\w+/g, '([^\/]+)').replace(/\*\w+/g, '(.*?)');
      return new RegExp("^" + name + "$");
    };
  
    StateManager.addStateManager = function(target, options) {
      var stateManager, states;
      if (options == null) {
        options = {};
      }
      if (!target) {
        new Error('Target must be defined');
      }
      states = _.isFunction(target.states) ? target.states() : target.states;
      states = StateManager.bindStates(target, states);
      stateManager = new Backbone.StateManager.Manager(states, options);
      _.extend(target, {
        states: states,
        stateManager: stateManager,
        triggerState: function() {
          return stateManager.triggerState.apply(stateManager, arguments);
        },
        getCurrentStateName: function() {
          return stateManager.getCurrentStateName();
        }
      });
      if (options.initialize !== false) {
        return target.stateManager.initialize(options);
      }
    };
  
    StateManager.bindStates = function(target, states) {
      states = _.clone(states);
      _.each(states, function(state, pattern) {
        _.each(['enter', 'exit'], function(key) {
          if (state[key]) {
            return state[key] = _.bind(state[key], target);
          }
        });
        return _.each(state.transitions(function(method, pattern) {
          return state[pattern] = _.bind(method, target);
        }));
      });
      return states;
    };
  
  }).call(this);
  
  (function() {
    var __hasProp = {}.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  
    StateManager.Transition = (function(_super) {
  
      __extends(Transition, _super);
  
      function Transition() {
        return Transition.__super__.constructor.apply(this, arguments);
      }
  
      Transition.prototype.idAttribute = name;
  
      Transition.prototype.validate = function(attrs) {
        switch (true) {
          case !_.isString(attrs.pattern):
            return 'Must have a pattern';
          case !_.isFunction(attrs.method):
            return 'Must have a method';
          case !_.isRegExp(attrs.regExp):
            return 'Must have a valid regexp';
        }
      };
  
      Transition.prototype.parse = function(attrs) {
        var _ref;
        if ((_ref = attrs.regExp) == null) {
          attrs.regExp = StateManager.regExpStateConversion(attrs.pattern);
        }
        return attrs;
      };
  
      return Transition;
  
    })(Backbone.Model);
  
  }).call(this);
  
  (function() {
    var __hasProp = {}.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  
    StateManager.Transitions = (function(_super) {
  
      __extends(Transitions, _super);
  
      function Transitions() {
        return Transitions.__super__.constructor.apply(this, arguments);
      }
  
      Transitions.prototype.model = StateManager.Transition;
  
      Transitions.prototype.matchTransitions = function(type, stateName) {
        return this.filter(function(transition) {
          return transition.get('type') === type && transition.get('regExp').test(stateName) !== transition.get('inverse');
        });
      };
  
      Transitions.prototype.parse = function(attrs) {
        var key, transitions, value;
        transitions = [];
        if (_.isObject(attrs)) {
          for (key in attrs) {
            value = attrs[key];
            transitions.push({
              pattern: key,
              method: value
            });
          }
        }
        return transitions;
      };
  
      return Transitions;
  
    })(Backbone.Collection);
  
  }).call(this);
  
  (function() {
    var __hasProp = {}.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  
    StateManager.State = (function(_super) {
  
      __extends(State, _super);
  
      function State() {
        return State.__super__.constructor.apply(this, arguments);
      }
  
      State.prototype.idAttribute = 'pattern';
  
      State.prototype.validate = function(attrs, options) {
        switch (true) {
          case !_.isString(attrs.pattern):
            return 'Must have a pattern';
          case !attrs.transitions instanceof StateManager.Transitions:
            return 'Transitions must be a valid collection';
          case !_.isRegExp(attrs.regExp):
            return 'Must have a valid regexp';
          case attrs.enter && !_.isFunction(attrs.enter):
            return 'Must have a valid enter method';
          case attrs.exit && !_.isFunction(attrs.exit):
            return 'Must have a valid exit method';
        }
      };
  
      State.prototype.matchTransitions = function(type, stateName) {
        return _.pluck(this.get('transitions').matchTransitions(type, stateName), 'method');
      };
  
      State.prototype.parse = function(attrs) {
        var _ref;
        attrs.transitions = new StateManager.Transitions(attrs.transitions);
        if ((_ref = attrs.regExp) == null) {
          attrs.regExp = StateManager.regExpStateConversion(attrs.pattern);
        }
        return attrs;
      };
  
      return State;
  
    })(Backbone.Model);
  
  }).call(this);
  
  (function() {
    var __hasProp = {}.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
  
    StateManager.States = (function(_super) {
  
      __extends(States, _super);
  
      function States() {
        return States.__super__.constructor.apply(this, arguments);
      }
  
      States.prototype.model = StateManager.State;
  
      States.prototype.findInitial = function() {
        return this.find(function(state) {
          return !!state.get('initial');
        });
      };
  
      States.prototype.match = function(name) {
        return this.find(function(state) {
          return state.get('regExp').match(name);
        });
      };
  
      return States;
  
    })(Backbone.Collection);
  
  }).call(this);
  
  (function() {
  
    StateManager.Manager = (function() {
  
      function Manager(states, options) {
        var _ref;
        this.options = options != null ? options : {};
        this.states = new StateManager.States(states, this.options);
        if ((_ref = this.initialize) != null) {
          _ref.apply(this, arguments);
        }
      }
  
      Manager.prototype.addState = function(pattern, definition) {
        if (definition == null) {
          definition = {};
        }
        return this.states.add(_.extend(definition, {
          pattern: pattern
        }));
      };
  
      Manager.prototype.removeState = function(pattern) {
        var _ref;
        return (_ref = this.states.get(pattern)) != null ? _ref.destroy() : void 0;
      };
  
      Manager.prototype.triggerState = function(newStateName, options) {
        var currentStateName;
        if (options == null) {
          options = {};
        }
        if (currentStateName = this.getCurrentStateName() !== name || options.reEnter) {
          this.exitState(currentStateName, _.extend({}, options, {
            newStateName: newStateName
          }));
          return this.enterState(newStateName, _.extend({}, options, {
            prevStateName: currentStateName
          }));
        }
      };
  
      Manager.prototype.enterState = function(stateName, options) {
        var prevStateName, state, _base;
        if (options == null) {
          options = {};
        }
        if (!(stateName && (state = this.states.match(stateName)))) {
          return;
        }
        prevStateName = options.prevStateName;
        this.trigger("before:enter:state", state, stateName, options);
        if (prevStateName) {
          this.executeStateTransitions("onBeforeEnterFrom", prevStateName, state, stateName, options);
        }
        if (typeof (_base = state.get('enter')) === "function") {
          _base(options);
        }
        this.setCurrentStateName(stateName);
        if (prevStateName) {
          this.executeStateTransitions("onEnterFrom", prevStateName, state, stateName, options);
        }
        return this.trigger("enter:state", state, stateName, options);
      };
  
      Manager.prototype.exitState = function(stateName, options) {
        var newStateName, state, _base;
        if (options == null) {
          options = {};
        }
        if (!(stateName && (state = this.states.match(stateName)))) {
          return;
        }
        newStateName = options.newStateName;
        this.trigger("before:exit:state", state, stateName, options);
        if (newStateName) {
          this.executeStateTransitions("onBeforeExitTo", newStateName, state, stateName, options);
        }
        if (typeof (_base = state.get('exit')) === "function") {
          _base(options);
        }
        this.setCurrentStateName(null);
        if (newStateName) {
          this.executeStateTransitions("onExitTo", newStateName, state, stateName, options);
        }
        return this.trigger("exit:state", state, stateName, options);
      };
  
      Manager.prototype.executeStateTransitions = function(type, matchName, state, stateName, options) {
        if (!matchName) {
          return;
        }
        return _.each(typeof state.matchTransitions === "function" ? state.matchTransitions(type, matchName) : void 0, function(method) {
          return method(state, stateName, options);
        });
      };
  
      Manager.prototype.getCurrenStateName = function() {
        return this.currentStateName;
      };
  
      Manager.prototype.setCurrentStateName = function(name) {
        var currentStateName;
        currentStateName = this.currentStateName;
        this.currentStateName = name;
        if (this.name !== currentStateName) {
          return this.trigger('change:currentStateName', currentStateName, name);
        }
      };
  
      Manager.prototype.close = function() {
        if (typeof this.beforeClose === "function") {
          this.beforeClose();
        }
        this.exitState(this.getCurrenStateName());
        return typeof this.onClose === "function" ? this.onClose() : void 0;
      };
  
      return Manager;
  
    })();
  
    _.extend(StateManager.Manager, Backbone.Events);
  
  }).call(this);
  
  ;

    return StateManager;
  })(Backbone, _, $ || window.jQuery || window.Zepto || window.ender);

}).call(this);