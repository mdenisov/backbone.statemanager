
StateManager.Manager = (function() {

  function Manager(states, options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    this.states = new StateManager.States(states, _.extend(options, {
      parse: true
    }));
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
    if ((currentStateName = this.getCurrentStateName()) !== newStateName || options.reEnter) {
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
      this.executeStateTransitions('onBeforeEnterFrom', prevStateName, state, stateName, options);
    }
    if (typeof (_base = state.get('enter')) === "function") {
      _base(options);
    }
    this.setCurrentStateName(stateName);
    if (prevStateName) {
      this.executeStateTransitions('onEnterFrom', prevStateName, state, stateName, options);
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
      this.executeStateTransitions('onBeforeExitTo', newStateName, state, stateName, options);
    }
    if (typeof (_base = state.get('exit')) === "function") {
      _base(options);
    }
    this.setCurrentStateName(null);
    if (newStateName) {
      this.executeStateTransitions('onExitTo', newStateName, state, stateName, options);
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

  Manager.prototype.getCurrentStateName = function() {
    return this.currentStateName;
  };

  Manager.prototype.setCurrentStateName = function(name) {
    var currentStateName;
    currentStateName = this.currentStateName;
    this.currentStateName = name;
    if (name !== currentStateName) {
      return this.trigger('change:currentStateName', name, currentStateName);
    }
  };

  Manager.prototype.close = function() {
    if (typeof this.beforeClose === "function") {
      this.beforeClose();
    }
    this.exitState(this.getCurrentStateName());
    return typeof this.onClose === "function" ? this.onClose() : void 0;
  };

  return Manager;

})();

_.extend(StateManager.Manager.prototype, Backbone.Events);
