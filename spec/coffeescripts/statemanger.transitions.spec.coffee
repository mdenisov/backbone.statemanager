describe 'StateManager.Transitions', ->
  buildDummy = =>
    @dummy =
      models : buildModels()
      filter : spyOn(@prototype, 'filter').andCallThrough()

  buildModels = ->
    [
      buildModel 'type', /stateName/, false
      buildModel 'type', /stateName/, true
      buildModel 'foo', /stateName/, true
    ]

  buildModel = (type, regExp, inverse) ->
    model = jasmine.createSpyObj 'model', ['get']
    model.get.when('type').thenReturn type
    model.get.when('regExp').thenReturn regExp
    model.get.when('inverse').thenReturn inverse
    model

  Given => @prototype = StateManager.Transitions::
  Given -> buildDummy()
  Then => expect(@prototype.model).toEqual StateManager.Transition

  describe 'matchTransitions', =>
    When => @result = @prototype.matchTransitions.call @dummy, 'type', 'stateName'
    Then => expect(@dummy.filter).toHaveBeenCalledWith jasmine.any Function
    Then => expect(@result).toEqual @dummy.models.slice(0, 1)

  describe 'parse', =>
    Given -> spyOn _, 'isObject'

    describe 'when attributes passed are not an object', =>
      Given -> _.isObject.andReturn false
      When => @result = @prototype.parse.call @dummy
      Then => expect(@result).toEqual jasmine.any Array
      Then => expect(@result.length).toEqual 0

    describe 'attributes passed are an object', =>
      Given -> _.isObject.andReturn true
      When => @result = @prototype.parse.call @dummy, key : 'value', anotherKey : 'anotherValue'
      Then => expect(@result[0]).toEqual pattern : 'key', method : 'value'
      Then => expect(@result[1]).toEqual pattern : 'anotherKey', method : 'anotherValue'