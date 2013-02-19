class StateManager.Transition extends Backbone.Model
  idAttribute : 'name'

  validate : (attrs) ->
    switch true
      when not _.isString(attrs.pattern) then 'Must have a pattern'
      when not _.isFunction(attrs.method) then 'Must have a method'
      when not _.isRegExp(attrs.regExp) then 'Must have a valid regexp'

  parse : (attrs) ->
    attrs.regExp ?= StateManager.regExpStateConversion attrs.pattern
    attrs