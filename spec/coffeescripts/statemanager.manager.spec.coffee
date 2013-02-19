describe 'StateManager.Manager', ->
  buildDummy = =>
    methods = [
      'initialize'
      'getCurrentStateName'
      'exitState'
      'enterState'
      'trigger'
      'executeStateTransitions'
      'setCurrentStateName'
      'beforeClose'
      'onClose'
    ]
    @dummy = jasmine.createSpyObj 'manager', methods
    @dummy.states = buildDummyCollection()

  buildDummyCollection = ->
    jasmine.createSpyObj 'collection', ['add', 'get', 'match']

  buildDummyModel = ->
    jasmine.createSpyObj 'model', ['destroy', 'get', 'matchTransitions']

  Given => @prototype = StateManager.Manager.prototype
  Given -> buildDummy()

  describe 'constructor', =>
    Given => @klass = spyOnConstructor StateManager, 'States'
    When => new StateManager.Manager 'states', 'options'
    Then => expect(@klass.constructor).toHaveBeenCalledWith 'states', 'options'

    describe 'with initialize', =>
      When => @prototype.constructor.call @dummy, 'foo'
      Then => expect(@dummy.initialize).toHaveBeenCalledWith 'foo'

  describe 'addState', =>
    When => @prototype.addState.call @dummy, 'pattern', foo : 'bar'
    Then => expect(@dummy.states.add).toHaveBeenCalledWith foo : 'bar', pattern : 'pattern'

  describe 'removeState', =>
    Given => @model = buildDummyModel()
    Given => @dummy.states.get.when('pattern').thenReturn @model
    When => @prototype.removeState.call @dummy, 'pattern'
    Then => expect(@model.destroy).toHaveBeenCalled()

  describe 'triggerState', =>
    Given => @dummy.getCurrentStateName.andReturn 'current'

    describe 'new state name is not current', =>
      When => @prototype.triggerState.call @dummy, 'new'
      Then => expect(@dummy.exitState).toHaveBeenCalledWith 'current', newStateName : 'new'
      Then => expect(@dummy.enterState).toHaveBeenCalledWith 'new', prevStateName : 'current'

    describe 'same state name and no override', =>
      When => @prototype.triggerState.call @dummy, 'current'
      Then => expect(@dummy.exitState).not.toHaveBeenCalled()
      Then => expect(@dummy.enterState).not.toHaveBeenCalled()

    describe 'same state name, with override', =>
      When => @prototype.triggerState.call @dummy, 'current', reEnter : true
      Then => expect(@dummy.exitState).toHaveBeenCalledWith 'current', reEnter : true, newStateName : 'current'
      Then => expect(@dummy.enterState).toHaveBeenCalledWith 'current', reEnter : true, prevStateName : 'current'

  describe 'enterState', =>
    describe 'no state name', =>
      When => @prototype.enterState.call @dummy
      Then => expect(@dummy.states.match).not.toHaveBeenCalled()

    describe 'no state match', =>
      When => @prototype.enterState.call @dummy, 'name'
      Then => expect(@dummy.trigger).not.toHaveBeenCalled()

    describe 'valid state', =>
      Given => @state = buildDummyModel()
      Given => @state.get.when('enter').thenReturn @enter = jasmine.createSpy 'enter'
      Given => @dummy.states.match.andReturn @state

      describe 'no previous state', =>
        When => @prototype.enterState.call @dummy, 'name'

        Then => expect(@dummy.trigger).toHaveBeenCalledWith "before:enter:state", @state, 'name', {}
        Then => expect(@dummy.executeStateTransitions).not.toHaveBeenCalled()
        Then => expect(@enter).toHaveBeenCalled()
        Then => expect(@dummy.setCurrentStateName).toHaveBeenCalledWith 'name'
        Then => expect(@dummy.trigger).toHaveBeenCalledWith "enter:state", @state, 'name', {}

      describe 'previous state', =>
        Given => @options = prevStateName : 'prev'
        When => @prototype.enterState.call @dummy, 'name', @options
        Then => expect(@dummy.executeStateTransitions).toHaveBeenCalledWith 'onBeforeEnterFrom', 'prev', @state, 'name', @options
        Then => expect(@dummy.executeStateTransitions).toHaveBeenCalledWith 'onEnterFrom', 'prev', @state, 'name', @options


  describe 'exitState', =>
    describe 'no state name', =>
      When => @prototype.exitState.call @dummy
      Then => expect(@dummy.states.match).not.toHaveBeenCalled()

    describe 'no state match', =>
      When => @prototype.exitState.call @dummy, 'name'
      Then => expect(@dummy.trigger).not.toHaveBeenCalled()

    describe 'valid state', =>
      Given => @state = buildDummyModel()
      Given => @state.get.when('exit').thenReturn @exit = jasmine.createSpy 'exit'
      Given => @dummy.states.match.andReturn @state

      describe 'no previous state', =>
        When => @prototype.exitState.call @dummy, 'name'

        Then => expect(@dummy.trigger).toHaveBeenCalledWith "before:exit:state", @state, 'name', {}
        Then => expect(@dummy.executeStateTransitions).not.toHaveBeenCalled()
        Then => expect(@exit).toHaveBeenCalled()
        Then => expect(@dummy.setCurrentStateName).toHaveBeenCalledWith null
        Then => expect(@dummy.trigger).toHaveBeenCalledWith "exit:state", @state, 'name', {}

      describe 'previous state', =>
        Given => @options = newStateName : 'new'
        When => @prototype.exitState.call @dummy, 'name', @options
        Then => expect(@dummy.executeStateTransitions).toHaveBeenCalledWith 'onBeforeExitTo', 'new', @state, 'name', @options
        Then => expect(@dummy.executeStateTransitions).toHaveBeenCalledWith 'onExitTo', 'new', @state, 'name', @options

  describe 'executeStateTransitions', =>
    Given => spyOn _, 'each'
    Given => @state = buildDummyModel()
    Given => @state.matchTransitions.andReturn 'transitions'

    describe 'no name', =>
      When => @prototype.executeStateTransitions.call @dummy
      Then => expect(_.each).not.toHaveBeenCalled()

    describe 'with name', =>
      When => @prototype.executeStateTransitions.call @dummy, 'type', 'matchName', @state, 'stateName', 'options'
      Then => expect(@state.matchTransitions).toHaveBeenCalledWith 'type', 'matchName'
      Then => expect(_.each).toHaveBeenCalledWith 'transitions', jasmine.any Function

      describe '_.each callback', =>
        Given => @method = jasmine.createSpy 'method'
        When => _.each.mostRecentCall.args[1] @method
        Then => expect(@method).toHaveBeenCalledWith @state, 'stateName', 'options'

  describe 'getCurrentStateName', =>
    Given => @dummy.currentStateName = 'name'
    Then => expect(@prototype.getCurrentStateName.call @dummy).toEqual 'name'

  describe 'setCurrrentStateName', =>
    Given => @dummy.currentStateName = 'current'

    describe 'same', =>
      When => @prototype.setCurrentStateName.call @dummy, 'current'
      Then => expect(@dummy.trigger).not.toHaveBeenCalled()
      Then => expect(@dummy.currentStateName).toEqual 'current'

    describe 'not the same', =>
      When => @prototype.setCurrentStateName.call @dummy, 'new'
      Then => expect(@dummy.trigger).toHaveBeenCalledWith 'change:currentStateName', 'new', 'current'
      Then => expect(@dummy.currentStateName).toEqual 'new'

  describe 'close', =>
    Given => @dummy.getCurrentStateName.andReturn 'name'
    When => @prototype.close.call @dummy
    Then => expect(@dummy.beforeClose).toHaveBeenCalled()
    Then => expect(@dummy.exitState).toHaveBeenCalledWith 'name'
    Then => expect(@dummy.onClose).toHaveBeenCalled()

  describe 'extends Backbone.Events', =>
    Then => expect(@prototype.on).toBeDefined()
    Then => expect(@prototype.off).toBeDefined()
    Then => expect(@prototype.trigger).toBeDefined()