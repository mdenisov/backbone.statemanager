describe 'StateManager.States', ->
  buildDummy = =>
    @dummy =
      models : buildModels()
      find : spyOn(@prototype, 'find').andCallThrough()

  buildModels = ->
    [
      buildModel true, 'foo', false
      buildModel false, 'regExp', true
    ]

  buildModel = (initial, regExp) ->
    model = jasmine.createSpyObj 'model', ['get']
    model.get.when('initial').thenReturn initial
    model.get.when('regExp').thenReturn regExp
    model

  Given => @prototype = StateManager.States::
  Given -> buildDummy()
  Then => expect(@prototype.model).toEqual StateManager.State

  describe 'findInitial', =>
    When => @result = @prototype.findInitial.call @dummy
    Then => expect(@dummy.find).toHaveBeenCalledWith jasmine.any Function
    Then => expect(@result).toEqual @dummy.models[0]

  describe 'match', =>
    When => @result = @prototype.match.call @dummy, /regExp/
    Then => expect(@dummy.find).toHaveBeenCalledWith jasmine.any Function
    Then => expect(@result).toEqual @dummy.models[1]