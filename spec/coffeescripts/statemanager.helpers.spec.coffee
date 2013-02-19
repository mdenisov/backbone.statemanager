describe 'StateManager.regExpStateConversion', ->
  Given => spyOn(Backbone.Router.prototype, '_routeToRegExp').andReturn 'regexp'
  When => @response = StateManager.regExpStateConversion 'foo'
  Then => expect(Backbone.Router.prototype._routeToRegExp).toHaveBeenCalledWith 'foo'
  Then => expect(@response).toEqual 'regexp'

describe 'StateManager.addStateManager', ->
  Given => @states = jasmine.createSpy 'states'
  Given => spyOn _, 'extend'
  Given => spyOn StateManager, 'prepareTargetStates'

  Given =>
    methods = ['triggerState', 'getCurrentStateName', 'initialize']
    @klass = spyOnConstructor Backbone.StateManager, 'Manager', methods

  Given =>
    @target =
      states : @states
      stateManager : jasmine.createSpyObj('stateManager', ['initialize'])

  describe 'no target', =>
    Then => expect(StateManager.addStateManager).toThrow()

  describe 'prepare states', =>
    When => StateManager.addStateManager @target
    Then => expect(StateManager.prepareTargetStates).toHaveBeenCalledWith @target

  describe 'new state manager', =>
    When => StateManager.addStateManager @target, 'options'
    Then => expect(@klass.constructor).toHaveBeenCalledWith @states, 'options'

  describe 'extend target', =>
    When => StateManager.addStateManager @target
    Then =>
      obj =
        stateManager : jasmine.any StateManager.Manager
        triggerState : jasmine.any Function
        getCurrentStateName : jasmine.any Function

      expect(_.extend).toHaveBeenCalledWith @target, obj

    describe 'triggerState', =>
      When => _.extend.mostRecentCall.args[1].triggerState 'foo'
      Then => expect(@klass.triggerState).toHaveBeenCalledWith 'foo'

    describe 'getCurrentStateName', =>
      When => _.extend.mostRecentCall.args[1].getCurrentStateName()
      Then => expect(@klass.getCurrentStateName).toHaveBeenCalled()

  describe 'initialize', =>
    describe 'options.initialize = false', =>
      When => StateManager.addStateManager @target, initialize : false
      Then => expect(@klass.initialize).not.toHaveBeenCalled()

    describe 'options.initialize != false', =>
      When => StateManager.addStateManager @target, null
      Then => expect(@target.stateManager.initialize).toHaveBeenCalledWith {}

describe 'StateManager.prepareStates', ->
  Given => spyOn(StateManager, 'bindMethods').andCallFake -> foo : 'bar'
  Given => @states = pattern : transitions : 'transitions'
  Given => @target = {}

  describe 'no target states', =>
    When => StateManager.prepareTargetStates @target
    Then => expect(@target.states).toEqual {}

  describe 'with states', =>
    Given => @target.states = @states
    When => StateManager.prepareTargetStates @target

    Then => expect(StateManager.bindMethods).toHaveBeenCalledWith @target, @states.pattern, ['enter', 'exit']
    Then => expect(StateManager.bindMethods).toHaveBeenCalledWith @target, @states.pattern.transitions
    Then => expect(@target.states.pattern).toEqual foo : 'bar', transitions : foo : 'bar'

describe 'StateManager.bindMethods', =>
  Given -> spyOn _, 'isFunction'
  Given -> spyOn _, 'clone'
  Given -> spyOn _, 'isObject'
  Given -> spyOn _, 'pick'
  Given -> spyOn _, 'bind'

  describe 'methods are function', =>
    Given => @methods = jasmine.createSpy 'methods'
    Given => _.isFunction.andReturn true
    When => StateManager.bindMethods 'target', @methods
    Then => expect(@methods).toHaveBeenCalled()
    Then => expect(_.clone).not.toHaveBeenCalled()

  describe 'methods are not a function', =>
    Given => @methods = 'methods'
    When => StateManager.bindMethods 'target', @methods
    Then => expect(_.clone).toHaveBeenCalledWith 'methods'

  describe 'methods are not an object', =>
    When => @result = StateManager.bindMethods 'target'
    Then => expect(_.isObject).toHaveBeenCalled()
    Then => expect(_.bind).not.toHaveBeenCalled()
    Then => expect(@result).toEqual {}

  describe 'methods are an object', =>
    Given => @methods = jasmine.createSpyObj 'methods', ['method']
    Given => _.clone.andReturn @methods
    Given => _.isObject.andReturn true
    Given => _.bind.andReturn 'bound method'

    describe 'filtered methods', =>
      Given => _.pick.andReturn @methods
      When => StateManager.bindMethods 'target', @methods, 'filters'
      Then => expect(_.pick).toHaveBeenCalledWith @methods, 'filters'

    describe 'bind methods', =>
      Given => _.isFunction.andCallThrough()
      Given => @methods.foo = 'bar'
      When => @result = StateManager.bindMethods 'target', @methods
      Then => expect(_.bind).toHaveBeenCalledWith @methods.method, 'target'
      Then => expect(_.bind).not.toHaveBeenCalledWith @methods.foo, 'target'
      Then => expect(@result).toEqual method : 'bound method'