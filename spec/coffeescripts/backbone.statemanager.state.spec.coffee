describe 'StateManager.State', ->
  Given => @prototype = StateManager.State::
  Then => expect(@prototype.idAttribute).toEqual 'pattern'

  describe 'validate', =>
    Given -> spyOn(_, 'isString').andReturn true
    Given -> spyOn(_, 'isFunction').andReturn true
    Given -> spyOn(_, 'isRegExp').andReturn true
    Given => @args = transitions : Object.create StateManager.Transitions::

    describe 'when pattern attribute is not a string', =>
      Given -> _.isString.andReturn false
      When => @result = @prototype.validate @args
      Then => expect(@result).toEqual 'Must have a pattern'

    describe 'when transitions attribute is not a collection of state manager transitions', =>
      When => @result = @prototype.validate {}
      Then => expect(@result).toEqual 'Transitions must be a valid collection'

    describe 'when regExp attribute is not a regExp', =>
      Given -> _.isRegExp.andReturn false
      When => @result = @prototype.validate @args
      Then => expect(@result).toEqual 'Must have a valid regexp'

    describe 'when enter method attribute exists and is not a isFunction', =>
      Given -> _.isFunction.andReturn false
      When => @result = @prototype.validate(_.extend @args, enter : 'enter')
      Then => expect(@result).toEqual 'Must have a valid enter method'

    describe 'when exit method attribute exists and is not a isFunction', =>
      Given -> _.isFunction.andReturn false
      When => @result = @prototype.validate(_.extend @args, exit : 'exit')
      Then => expect(@result).toEqual 'Must have a valid exit method'

  describe 'parse', =>
    Given => spyOn(StateManager, 'regExpStateConversion').andReturn 'regExpStateConversion'
    Given => @transitions = spyOnConstructor StateManager, 'Transitions', ['parse', 'reset']

    describe 'when attributes already have a regexp', =>
      When => @result = @prototype.parse regExp : 'regExp'
      Then => expect(@result.regExp).toEqual 'regExp'

    describe 'attributes passed are an object', =>
      Given => @transitions.parse.andReturn 'transitions parsed'
      When => @result = @prototype.parse transitions : 'transitions'
      Then => expect(@transitions.parse).toHaveBeenCalledWith 'transitions'
      Then => expect(@transitions.reset).toHaveBeenCalledWith 'transitions parsed', parse : true
      Then => expect(@result.regExp).toEqual 'regExpStateConversion'