StateManager.regExpStateConversion = (name) ->
  name = name.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&')
                .replace(/:\w+/g, '([^\/]+)')
                .replace(/\*\w+/g, '(.*?)')

  new RegExp "^#{ name }$"

StateManager.addStateManager = (target, options = {}) ->
  new Error 'Target must be defined' unless target

  states = if _.isFunction target.states then target.states() else target.states
  states = StateManager.bindStates target, states
  stateManager = new Backbone.StateManager.Manager states, options

  _.extend target,
    states : states
    stateManager : stateManager
    triggerState : -> stateManager.triggerState.apply stateManager, arguments
    getCurrentStateName : -> stateManager.getCurrentStateName()

  target.stateManager.initialize options unless options.initialize is false

StateManager.bindStates = (target, states) ->
  states = _.clone states

  _.each states, (state, pattern) ->
    _.each ['enter', 'exit'], (key) -> state[key] = _.bind state[key], target if state[key]
    _.each state.transitions (method, pattern) -> state[pattern] = _.bind method, target

  states