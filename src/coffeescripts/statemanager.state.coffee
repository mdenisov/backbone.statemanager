class StateManager.State extends Backbone.Model
  idAttribute : 'pattern'

  validate : (attrs, options) ->
    switch true
      when not _.isString attrs.pattern
        'Must have a pattern'
      when not (attrs.transitions instanceof StateManager.Transitions)
        'Transitions must be a valid collection'
      when not _.isRegExp attrs.regExp
        'Must have a valid regexp'
      when attrs.enter and not _.isFunction attrs.enter
        'Must have a valid enter method'
      when attrs.exit and not _.isFunction attrs.exit
        'Must have a valid exit method'

  matchTransitions : (type, stateName) ->
    _.pluck @get('transitions').matchTransitions(type, stateName), 'method'

  parse : (attrs) ->
    attrs.transitions = StateManager.Transitions::parse attrs.transitions
    attrs.transitions = new StateManager.Transitions attrs.transitions, parse : true
    attrs.regExp ?= StateManager.regExpStateConversion attrs.pattern

    attrs
