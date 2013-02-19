class StateManager.Manager

  constructor : (states, @options = {}) ->
    @states = new StateManager.States states, @options
    @initialize?.apply @, arguments

  addState : (pattern, definition = {}) -> @states.add _.extend definition, pattern : pattern

  removeState : (pattern) -> @states.get(pattern)?.destroy()

  triggerState : (newStateName, options = {}) ->
    if (currentStateName = @getCurrentStateName()) isnt newStateName or options.reEnter
      @exitState currentStateName, _.extend {}, options, newStateName : newStateName
      @enterState newStateName, _.extend {}, options, prevStateName : currentStateName

  enterState : (stateName, options = {}) ->
    return unless stateName and state = @states.match stateName
    prevStateName = options.prevStateName

    @trigger "before:enter:state", state, stateName, options
    if prevStateName then @executeStateTransitions 'onBeforeEnterFrom', prevStateName, state, stateName, options

    state.get('enter')? options
    @setCurrentStateName stateName

    if prevStateName then @executeStateTransitions 'onEnterFrom', prevStateName, state, stateName, options
    @trigger "enter:state", state, stateName, options

  exitState : (stateName, options = {}) ->
    return unless stateName and state = @states.match stateName
    newStateName = options.newStateName

    @trigger "before:exit:state", state, stateName, options
    if newStateName then @executeStateTransitions 'onBeforeExitTo', newStateName, state, stateName, options

    state.get('exit')? options
    @setCurrentStateName null

    if newStateName then @executeStateTransitions 'onExitTo', newStateName, state, stateName, options
    @trigger "exit:state", state, stateName, options

  executeStateTransitions : (type, matchName, state, stateName, options) ->
    return unless matchName
    _.each state.matchTransitions?(type, matchName), (method) -> method state, stateName, options

  getCurrentStateName : -> @currentStateName

  setCurrentStateName : (name) ->
    currentStateName = @currentStateName
    @currentStateName = name
    if name isnt currentStateName then @trigger 'change:currentStateName', name, currentStateName

  close : ->
    @beforeClose?()
    @exitState @getCurrentStateName()
    @onClose?()

_.extend StateManager.Manager::, Backbone.Events