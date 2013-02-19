var _this = this;

describe('StateManager.regExpStateConversion', function() {
  var _this = this;
  Given(function() {
    return spyOn(Backbone.Router.prototype, '_routeToRegExp').andReturn('regexp');
  });
  When(function() {
    return _this.response = StateManager.regExpStateConversion('foo');
  });
  Then(function() {
    return expect(Backbone.Router.prototype._routeToRegExp).toHaveBeenCalledWith('foo');
  });
  return Then(function() {
    return expect(_this.response).toEqual('regexp');
  });
});

describe('StateManager.addStateManager', function() {
  var _this = this;
  Given(function() {
    return _this.states = jasmine.createSpy('states');
  });
  Given(function() {
    return spyOn(_, 'extend');
  });
  Given(function() {
    return spyOn(StateManager, 'prepareTargetStates');
  });
  Given(function() {
    var methods;
    methods = ['triggerState', 'getCurrentStateName', 'initialize'];
    return _this.klass = spyOnConstructor(Backbone.StateManager, 'Manager', methods);
  });
  Given(function() {
    return _this.target = {
      states: _this.states,
      stateManager: jasmine.createSpyObj('stateManager', ['initialize'])
    };
  });
  describe('no target', function() {
    return Then(function() {
      return expect(StateManager.addStateManager).toThrow();
    });
  });
  describe('prepare states', function() {
    When(function() {
      return StateManager.addStateManager(_this.target);
    });
    return Then(function() {
      return expect(StateManager.prepareTargetStates).toHaveBeenCalledWith(_this.target);
    });
  });
  describe('new state manager', function() {
    When(function() {
      return StateManager.addStateManager(_this.target, 'options');
    });
    return Then(function() {
      return expect(_this.klass.constructor).toHaveBeenCalledWith(_this.states, 'options');
    });
  });
  describe('extend target', function() {
    When(function() {
      return StateManager.addStateManager(_this.target);
    });
    Then(function() {
      var obj;
      obj = {
        stateManager: jasmine.any(StateManager.Manager),
        triggerState: jasmine.any(Function),
        getCurrentStateName: jasmine.any(Function)
      };
      return expect(_.extend).toHaveBeenCalledWith(_this.target, obj);
    });
    describe('triggerState', function() {
      When(function() {
        return _.extend.mostRecentCall.args[1].triggerState('foo');
      });
      return Then(function() {
        return expect(_this.klass.triggerState).toHaveBeenCalledWith('foo');
      });
    });
    return describe('getCurrentStateName', function() {
      When(function() {
        return _.extend.mostRecentCall.args[1].getCurrentStateName();
      });
      return Then(function() {
        return expect(_this.klass.getCurrentStateName).toHaveBeenCalled();
      });
    });
  });
  return describe('initialize', function() {
    describe('options.initialize = false', function() {
      When(function() {
        return StateManager.addStateManager(_this.target, {
          initialize: false
        });
      });
      return Then(function() {
        return expect(_this.klass.initialize).not.toHaveBeenCalled();
      });
    });
    return describe('options.initialize != false', function() {
      When(function() {
        return StateManager.addStateManager(_this.target, null);
      });
      return Then(function() {
        return expect(_this.target.stateManager.initialize).toHaveBeenCalledWith({});
      });
    });
  });
});

describe('StateManager.prepareStates', function() {
  var _this = this;
  Given(function() {
    return spyOn(StateManager, 'bindMethods').andCallFake(function() {
      return {
        foo: 'bar'
      };
    });
  });
  Given(function() {
    return _this.states = {
      pattern: {
        transitions: 'transitions'
      }
    };
  });
  Given(function() {
    return _this.target = {};
  });
  describe('no target states', function() {
    When(function() {
      return StateManager.prepareTargetStates(_this.target);
    });
    return Then(function() {
      return expect(_this.target.states).toEqual({});
    });
  });
  return describe('with states', function() {
    Given(function() {
      return _this.target.states = _this.states;
    });
    When(function() {
      return StateManager.prepareTargetStates(_this.target);
    });
    Then(function() {
      return expect(StateManager.bindMethods).toHaveBeenCalledWith(_this.target, _this.states.pattern, ['enter', 'exit']);
    });
    Then(function() {
      return expect(StateManager.bindMethods).toHaveBeenCalledWith(_this.target, _this.states.pattern.transitions);
    });
    return Then(function() {
      return expect(_this.target.states.pattern).toEqual({
        foo: 'bar',
        transitions: {
          foo: 'bar'
        }
      });
    });
  });
});

describe('StateManager.bindMethods', function() {
  Given(function() {
    return spyOn(_, 'isFunction');
  });
  Given(function() {
    return spyOn(_, 'clone');
  });
  Given(function() {
    return spyOn(_, 'isObject');
  });
  Given(function() {
    return spyOn(_, 'pick');
  });
  Given(function() {
    return spyOn(_, 'bind');
  });
  describe('methods are function', function() {
    Given(function() {
      return _this.methods = jasmine.createSpy('methods');
    });
    Given(function() {
      return _.isFunction.andReturn(true);
    });
    When(function() {
      return StateManager.bindMethods('target', _this.methods);
    });
    Then(function() {
      return expect(_this.methods).toHaveBeenCalled();
    });
    return Then(function() {
      return expect(_.clone).not.toHaveBeenCalled();
    });
  });
  describe('methods are not a function', function() {
    Given(function() {
      return _this.methods = 'methods';
    });
    When(function() {
      return StateManager.bindMethods('target', _this.methods);
    });
    return Then(function() {
      return expect(_.clone).toHaveBeenCalledWith('methods');
    });
  });
  describe('methods are not an object', function() {
    When(function() {
      return _this.result = StateManager.bindMethods('target');
    });
    Then(function() {
      return expect(_.isObject).toHaveBeenCalled();
    });
    Then(function() {
      return expect(_.bind).not.toHaveBeenCalled();
    });
    return Then(function() {
      return expect(_this.result).toEqual({});
    });
  });
  return describe('methods are an object', function() {
    Given(function() {
      return _this.methods = jasmine.createSpyObj('methods', ['method']);
    });
    Given(function() {
      return _.clone.andReturn(_this.methods);
    });
    Given(function() {
      return _.isObject.andReturn(true);
    });
    Given(function() {
      return _.bind.andReturn('bound method');
    });
    describe('filtered methods', function() {
      Given(function() {
        return _.pick.andReturn(_this.methods);
      });
      When(function() {
        return StateManager.bindMethods('target', _this.methods, 'filters');
      });
      return Then(function() {
        return expect(_.pick).toHaveBeenCalledWith(_this.methods, 'filters');
      });
    });
    return describe('bind methods', function() {
      Given(function() {
        return _.isFunction.andCallThrough();
      });
      Given(function() {
        return _this.methods.foo = 'bar';
      });
      When(function() {
        return _this.result = StateManager.bindMethods('target', _this.methods);
      });
      Then(function() {
        return expect(_.bind).toHaveBeenCalledWith(_this.methods.method, 'target');
      });
      Then(function() {
        return expect(_.bind).not.toHaveBeenCalledWith(_this.methods.foo, 'target');
      });
      return Then(function() {
        return expect(_this.result).toEqual({
          method: 'bound method'
        });
      });
    });
  });
});
