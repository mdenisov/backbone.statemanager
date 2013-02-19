var StateManager;

StateManager = (function(Backbone, _, $) {
  StateManager = {};
  Backbone.StateManager = StateManager;
  
  //= ../statemanager.helpers.js
  //= ../statemanager.transition.js
  //= ../statemanager.transitions.js
  //= ../statemanager.state.js
  //= ../statemanager.states.js
  //= ../statemanager.manager.js
  ;

  return StateManager;
})(Backbone, _, $ || window.jQuery || window.Zepto || window.ender);
