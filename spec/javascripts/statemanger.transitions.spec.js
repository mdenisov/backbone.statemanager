
describe('StateManager.Transitions', function() {
  var buildDummy, buildModel, buildModels,
    _this = this;
  buildDummy = function() {
    return _this.dummy = {
      models: buildModels(),
      filter: spyOn(_this.prototype, 'filter').andCallThrough()
    };
  };
  buildModels = function() {
    return [buildModel('type', /stateName/, false), buildModel('type', /stateName/, true), buildModel('foo', /stateName/, true)];
  };
  buildModel = function(type, regExp, inverse) {
    var model;
    model = jasmine.createSpyObj('model', ['get']);
    model.get.when('type').thenReturn(type);
    model.get.when('regExp').thenReturn(regExp);
    model.get.when('inverse').thenReturn(inverse);
    return model;
  };
  Given(function() {
    return _this.prototype = StateManager.Transitions.prototype;
  });
  Given(function() {
    return buildDummy();
  });
  Then(function() {
    return expect(_this.prototype.model).toEqual(StateManager.Transition);
  });
  describe('matchTransitions', function() {
    When(function() {
      return _this.result = _this.prototype.matchTransitions.call(_this.dummy, 'type', 'stateName');
    });
    Then(function() {
      return expect(_this.dummy.filter).toHaveBeenCalledWith(jasmine.any(Function));
    });
    return Then(function() {
      return expect(_this.result).toEqual(_this.dummy.models.slice(0, 1));
    });
  });
  return describe('parse', function() {
    Given(function() {
      return spyOn(_, 'isObject');
    });
    describe('when attributes passed are not an object', function() {
      Given(function() {
        return _.isObject.andReturn(false);
      });
      When(function() {
        return _this.result = _this.prototype.parse.call(_this.dummy);
      });
      Then(function() {
        return expect(_this.result).toEqual(jasmine.any(Array));
      });
      return Then(function() {
        return expect(_this.result.length).toEqual(0);
      });
    });
    return describe('attributes passed are an object', function() {
      Given(function() {
        return _.isObject.andReturn(true);
      });
      When(function() {
        return _this.result = _this.prototype.parse.call(_this.dummy, {
          key: 'value',
          anotherKey: 'anotherValue'
        });
      });
      Then(function() {
        return expect(_this.result[0]).toEqual({
          pattern: 'key',
          method: 'value'
        });
      });
      return Then(function() {
        return expect(_this.result[1]).toEqual({
          pattern: 'anotherKey',
          method: 'anotherValue'
        });
      });
    });
  });
});
