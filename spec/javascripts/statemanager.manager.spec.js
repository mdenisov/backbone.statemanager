
describe('StateManager.Manager', function() {
  var buildDummy, buildDummyCollection, buildDummyModel,
    _this = this;
  buildDummy = function() {
    var methods;
    methods = ['initialize', 'getCurrentStateName', 'exitState', 'enterState', 'trigger', 'executeStateTransitions', 'setCurrentStateName', 'beforeClose', 'onClose'];
    _this.dummy = jasmine.createSpyObj('manager', methods);
    return _this.dummy.states = buildDummyCollection();
  };
  buildDummyCollection = function() {
    return jasmine.createSpyObj('collection', ['add', 'get', 'match']);
  };
  buildDummyModel = function() {
    return jasmine.createSpyObj('model', ['destroy', 'get', 'matchTransitions']);
  };
  Given(function() {
    return _this.prototype = StateManager.Manager.prototype;
  });
  Given(function() {
    return buildDummy();
  });
  describe('constructor', function() {
    Given(function() {
      return _this.klass = spyOnConstructor(StateManager, 'States');
    });
    When(function() {
      return new StateManager.Manager('states', 'options');
    });
    Then(function() {
      return expect(_this.klass.constructor).toHaveBeenCalledWith('states', 'options');
    });
    return describe('with initialize', function() {
      When(function() {
        return _this.prototype.constructor.call(_this.dummy, 'foo');
      });
      return Then(function() {
        return expect(_this.dummy.initialize).toHaveBeenCalledWith('foo');
      });
    });
  });
  describe('addState', function() {
    When(function() {
      return _this.prototype.addState.call(_this.dummy, 'pattern', {
        foo: 'bar'
      });
    });
    return Then(function() {
      return expect(_this.dummy.states.add).toHaveBeenCalledWith({
        foo: 'bar',
        pattern: 'pattern'
      });
    });
  });
  describe('removeState', function() {
    Given(function() {
      return _this.model = buildDummyModel();
    });
    Given(function() {
      return _this.dummy.states.get.when('pattern').thenReturn(_this.model);
    });
    When(function() {
      return _this.prototype.removeState.call(_this.dummy, 'pattern');
    });
    return Then(function() {
      return expect(_this.model.destroy).toHaveBeenCalled();
    });
  });
  describe('triggerState', function() {
    Given(function() {
      return _this.dummy.getCurrentStateName.andReturn('current');
    });
    describe('new state name is not current', function() {
      When(function() {
        return _this.prototype.triggerState.call(_this.dummy, 'new');
      });
      Then(function() {
        return expect(_this.dummy.exitState).toHaveBeenCalledWith('current', {
          newStateName: 'new'
        });
      });
      return Then(function() {
        return expect(_this.dummy.enterState).toHaveBeenCalledWith('new', {
          prevStateName: 'current'
        });
      });
    });
    describe('same state name and no override', function() {
      When(function() {
        return _this.prototype.triggerState.call(_this.dummy, 'current');
      });
      Then(function() {
        return expect(_this.dummy.exitState).not.toHaveBeenCalled();
      });
      return Then(function() {
        return expect(_this.dummy.enterState).not.toHaveBeenCalled();
      });
    });
    return describe('same state name, with override', function() {
      When(function() {
        return _this.prototype.triggerState.call(_this.dummy, 'current', {
          reEnter: true
        });
      });
      Then(function() {
        return expect(_this.dummy.exitState).toHaveBeenCalledWith('current', {
          reEnter: true,
          newStateName: 'current'
        });
      });
      return Then(function() {
        return expect(_this.dummy.enterState).toHaveBeenCalledWith('current', {
          reEnter: true,
          prevStateName: 'current'
        });
      });
    });
  });
  describe('enterState', function() {
    describe('no state name', function() {
      When(function() {
        return _this.prototype.enterState.call(_this.dummy);
      });
      return Then(function() {
        return expect(_this.dummy.states.match).not.toHaveBeenCalled();
      });
    });
    describe('no state match', function() {
      When(function() {
        return _this.prototype.enterState.call(_this.dummy, 'name');
      });
      return Then(function() {
        return expect(_this.dummy.trigger).not.toHaveBeenCalled();
      });
    });
    return describe('valid state', function() {
      Given(function() {
        return _this.state = buildDummyModel();
      });
      Given(function() {
        return _this.state.get.when('enter').thenReturn(_this.enter = jasmine.createSpy('enter'));
      });
      Given(function() {
        return _this.dummy.states.match.andReturn(_this.state);
      });
      describe('no previous state', function() {
        When(function() {
          return _this.prototype.enterState.call(_this.dummy, 'name');
        });
        Then(function() {
          return expect(_this.dummy.trigger).toHaveBeenCalledWith("before:enter:state", _this.state, 'name', {});
        });
        Then(function() {
          return expect(_this.dummy.executeStateTransitions).not.toHaveBeenCalled();
        });
        Then(function() {
          return expect(_this.enter).toHaveBeenCalled();
        });
        Then(function() {
          return expect(_this.dummy.setCurrentStateName).toHaveBeenCalledWith('name');
        });
        return Then(function() {
          return expect(_this.dummy.trigger).toHaveBeenCalledWith("enter:state", _this.state, 'name', {});
        });
      });
      return describe('previous state', function() {
        Given(function() {
          return _this.options = {
            prevStateName: 'prev'
          };
        });
        When(function() {
          return _this.prototype.enterState.call(_this.dummy, 'name', _this.options);
        });
        Then(function() {
          return expect(_this.dummy.executeStateTransitions).toHaveBeenCalledWith('onBeforeEnterFrom', 'prev', _this.state, 'name', _this.options);
        });
        return Then(function() {
          return expect(_this.dummy.executeStateTransitions).toHaveBeenCalledWith('onEnterFrom', 'prev', _this.state, 'name', _this.options);
        });
      });
    });
  });
  describe('exitState', function() {
    describe('no state name', function() {
      When(function() {
        return _this.prototype.exitState.call(_this.dummy);
      });
      return Then(function() {
        return expect(_this.dummy.states.match).not.toHaveBeenCalled();
      });
    });
    describe('no state match', function() {
      When(function() {
        return _this.prototype.exitState.call(_this.dummy, 'name');
      });
      return Then(function() {
        return expect(_this.dummy.trigger).not.toHaveBeenCalled();
      });
    });
    return describe('valid state', function() {
      Given(function() {
        return _this.state = buildDummyModel();
      });
      Given(function() {
        return _this.state.get.when('exit').thenReturn(_this.exit = jasmine.createSpy('exit'));
      });
      Given(function() {
        return _this.dummy.states.match.andReturn(_this.state);
      });
      describe('no previous state', function() {
        When(function() {
          return _this.prototype.exitState.call(_this.dummy, 'name');
        });
        Then(function() {
          return expect(_this.dummy.trigger).toHaveBeenCalledWith("before:exit:state", _this.state, 'name', {});
        });
        Then(function() {
          return expect(_this.dummy.executeStateTransitions).not.toHaveBeenCalled();
        });
        Then(function() {
          return expect(_this.exit).toHaveBeenCalled();
        });
        Then(function() {
          return expect(_this.dummy.setCurrentStateName).toHaveBeenCalledWith(null);
        });
        return Then(function() {
          return expect(_this.dummy.trigger).toHaveBeenCalledWith("exit:state", _this.state, 'name', {});
        });
      });
      return describe('previous state', function() {
        Given(function() {
          return _this.options = {
            newStateName: 'new'
          };
        });
        When(function() {
          return _this.prototype.exitState.call(_this.dummy, 'name', _this.options);
        });
        Then(function() {
          return expect(_this.dummy.executeStateTransitions).toHaveBeenCalledWith('onBeforeExitTo', 'new', _this.state, 'name', _this.options);
        });
        return Then(function() {
          return expect(_this.dummy.executeStateTransitions).toHaveBeenCalledWith('onExitTo', 'new', _this.state, 'name', _this.options);
        });
      });
    });
  });
  describe('executeStateTransitions', function() {
    Given(function() {
      return spyOn(_, 'each');
    });
    Given(function() {
      return _this.state = buildDummyModel();
    });
    Given(function() {
      return _this.state.matchTransitions.andReturn('transitions');
    });
    describe('no name', function() {
      When(function() {
        return _this.prototype.executeStateTransitions.call(_this.dummy);
      });
      return Then(function() {
        return expect(_.each).not.toHaveBeenCalled();
      });
    });
    return describe('with name', function() {
      When(function() {
        return _this.prototype.executeStateTransitions.call(_this.dummy, 'type', 'matchName', _this.state, 'stateName', 'options');
      });
      Then(function() {
        return expect(_this.state.matchTransitions).toHaveBeenCalledWith('type', 'matchName');
      });
      Then(function() {
        return expect(_.each).toHaveBeenCalledWith('transitions', jasmine.any(Function));
      });
      return describe('_.each callback', function() {
        Given(function() {
          return _this.method = jasmine.createSpy('method');
        });
        When(function() {
          return _.each.mostRecentCall.args[1](_this.method);
        });
        return Then(function() {
          return expect(_this.method).toHaveBeenCalledWith(_this.state, 'stateName', 'options');
        });
      });
    });
  });
  describe('getCurrentStateName', function() {
    Given(function() {
      return _this.dummy.currentStateName = 'name';
    });
    return Then(function() {
      return expect(_this.prototype.getCurrentStateName.call(_this.dummy)).toEqual('name');
    });
  });
  describe('setCurrrentStateName', function() {
    Given(function() {
      return _this.dummy.currentStateName = 'current';
    });
    describe('same', function() {
      When(function() {
        return _this.prototype.setCurrentStateName.call(_this.dummy, 'current');
      });
      Then(function() {
        return expect(_this.dummy.trigger).not.toHaveBeenCalled();
      });
      return Then(function() {
        return expect(_this.dummy.currentStateName).toEqual('current');
      });
    });
    return describe('not the same', function() {
      When(function() {
        return _this.prototype.setCurrentStateName.call(_this.dummy, 'new');
      });
      Then(function() {
        return expect(_this.dummy.trigger).toHaveBeenCalledWith('change:currentStateName', 'new', 'current');
      });
      return Then(function() {
        return expect(_this.dummy.currentStateName).toEqual('new');
      });
    });
  });
  describe('close', function() {
    Given(function() {
      return _this.dummy.getCurrentStateName.andReturn('name');
    });
    When(function() {
      return _this.prototype.close.call(_this.dummy);
    });
    Then(function() {
      return expect(_this.dummy.beforeClose).toHaveBeenCalled();
    });
    Then(function() {
      return expect(_this.dummy.exitState).toHaveBeenCalledWith('name');
    });
    return Then(function() {
      return expect(_this.dummy.onClose).toHaveBeenCalled();
    });
  });
  return describe('extends Backbone.Events', function() {
    Then(function() {
      return expect(_this.prototype.on).toBeDefined();
    });
    Then(function() {
      return expect(_this.prototype.off).toBeDefined();
    });
    return Then(function() {
      return expect(_this.prototype.trigger).toBeDefined();
    });
  });
});
