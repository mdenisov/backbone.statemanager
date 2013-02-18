class StateManager.Transitions extends Backbone.Collection
  model : StateManager.Transition

  matchTransitions : (type, stateName) ->
    @filter (transition) ->
      transition.get('type') is type and
      transition.get('regExp').test(stateName) isnt transition.get 'inverse'

  parse : (attrs) ->
    transitions = []
    if _.isObject attrs then transitions.push pattern : key, method : value for key, value of attrs
    transitions