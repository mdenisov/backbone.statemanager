
StateManager.regExpStateConversion = function(name) {
  return Backbone.Router.prototype._routeToRegExp(name);
};

StateManager.addStateManager = function(target, options) {
  var stateManager;
  if (options == null) {
    options = {};
  }
  if (!target) {
    new Error('Target must be defined');
  }
  StateManager.prepareTargetStates(target);
  stateManager = new Backbone.StateManager.Manager(target.states, options);
  _.extend(target, {
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

StateManager.prepareTargetStates = function(target) {
  var pattern, state, _ref, _state, _states;
  _states = {};
  if (_.isObject(target.states)) {
    _ref = target.states;
    for (pattern in _ref) {
      state = _ref[pattern];
      _state = StateManager.bindMethods(target, state, ['enter', 'exit']);
      _state.transitions = StateManager.bindMethods(target, state.transitions);
      _states[pattern] = _state;
    }
  }
  return target.states = _states;
};

StateManager.bindMethods = function(target, methods, filters) {
  var method, name, _methods;
  _methods = {};
  methods = _.isFunction(methods) ? methods() : _.clone(methods);
  if (_.isObject(methods)) {
    if (filters) {
      methods = _.pick(methods, filters);
    }
    for (name in methods) {
      method = methods[name];
      if (_.isFunction(method)) {
        _methods[name] = _.bind(method, target);
      }
    }
  }
  return _methods;
};
