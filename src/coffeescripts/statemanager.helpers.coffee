StateManager.regExpStateConversion = (name) -> Backbone.Router.prototype._routeToRegExp name

StateManager.addStateManager = (target, options = {}) ->
  new Error 'Target must be defined' unless target

  StateManager.prepareTargetStates target
  stateManager = new Backbone.StateManager.Manager target.states, options

  _.extend target,
    stateManager : stateManager
    triggerState : -> stateManager.triggerState.apply stateManager, arguments
    getCurrentStateName : -> stateManager.getCurrentStateName()

  target.stateManager.initialize options unless options.initialize is false

StateManager.prepareTargetStates = (target) ->
  _states = {}

  if _.isObject target.states

    for pattern, state of target.states
      _state = StateManager.bindMethods target, state, ['enter', 'exit']
      _state.transitions = StateManager.bindMethods target, state.transitions
      _states[pattern] = _state

  target.states = _states

StateManager.bindMethods = (target, methods, filters) ->
  _methods = {}
  methods = if _.isFunction methods then methods() else _.clone methods

  if _.isObject methods
    if filters then methods = _.pick methods, filters
    _methods[name] = _.bind method, target for name, method of methods when _.isFunction method

  _methods