describe 'StateManager.Transition', ->
  Given => @prototype = StateManager.Transition::
  Then => expect(@prototype.idAttribute).toEqual 'name'

  describe 'validate', =>
    Given -> spyOn(_, 'isString').andReturn true
    Given -> spyOn(_, 'isFunction').andReturn true
    Given -> spyOn(_, 'isRegExp').andReturn true

    describe 'when pattern attribute is not a string', =>
      Given -> _.isString.andReturn false
      When => @result = @prototype.validate.call @dummy, {}
      Then => expect(@result).toEqual 'Must have a pattern'

    describe 'when method attribute is not a isFunction', =>
      Given -> _.isFunction.andReturn false
      When => @result = @prototype.validate.call @dummy, {}
      Then => expect(@result).toEqual 'Must have a method'

    describe 'when regExp attribute is not a regExp', =>
      Given -> _.isRegExp.andReturn false
      When => @result = @prototype.validate.call @dummy, {}
      Then => expect(@result).toEqual 'Must have a valid regexp'

  describe 'parse', =>
    Given => spyOn(StateManager, 'regExpStateConversion').andReturn 'regExpStateConversion'

    describe 'when attributes already have a regexp', =>
      Given => @args = regExp : 'regExp'
      When => @result = @prototype.parse.call @dummy, @args
      Then => expect(@result).toEqual @args

    describe 'attributes passed are an object', =>
      When => @result = @prototype.parse.call @dummy, {}
      Then => expect(@result).toEqual regExp : 'regExpStateConversion'
