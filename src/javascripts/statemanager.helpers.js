
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
