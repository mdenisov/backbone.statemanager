
describe('StateManager.State', function() {
  var _this = this;
  Given(function() {
    return _this.prototype = StateManager.State.prototype;
  });
  Then(function() {
    return expect(_this.prototype.idAttribute).toEqual('pattern');
  });
  describe('validate', function() {
    Given(function() {
      return spyOn(_, 'isString').andReturn(true);
    });
    Given(function() {
      return spyOn(_, 'isFunction').andReturn(true);
    });
    Given(function() {
      return spyOn(_, 'isRegExp').andReturn(true);
    });
    Given(function() {
      return _this.args = {
        transitions: Object.create(StateManager.Transitions.prototype)
      };
    });
    describe('when pattern attribute is not a string', function() {
      Given(function() {
        return _.isString.andReturn(false);
      });
      When(function() {
        return _this.result = _this.prototype.validate.call(_this.dummy, _this.args);
      });
      return Then(function() {
        return expect(_this.result).toEqual('Must have a pattern');
      });
    });
    describe('when transitions attribute is not a collection of state manager transitions', function() {
      When(function() {
        return _this.result = _this.prototype.validate.call(_this.dummy, {});
      });
      return Then(function() {
        return expect(_this.result).toEqual('Transitions must be a valid collection');
      });
    });
    describe('when regExp attribute is not a regExp', function() {
      Given(function() {
        return _.isRegExp.andReturn(false);
      });
      When(function() {
        return _this.result = _this.prototype.validate.call(_this.dummy, _this.args);
      });
      return Then(function() {
        return expect(_this.result).toEqual('Must have a valid regexp');
      });
    });
    describe('when enter method attribute exists and is not a isFunction', function() {
      Given(function() {
        return _.isFunction.andReturn(false);
      });
      When(function() {
        return _this.result = _this.prototype.validate.call(_this.dummy, _.extend(_this.args, {
          enter: 'enter'
        }));
      });
      return Then(function() {
        return expect(_this.result).toEqual('Must have a valid enter method');
      });
    });
    return describe('when exit method attribute exists and is not a isFunction', function() {
      Given(function() {
        return _.isFunction.andReturn(false);
      });
      When(function() {
        return _this.result = _this.prototype.validate.call(_this.dummy, _.extend(_this.args, {
          exit: 'exit'
        }));
      });
      return Then(function() {
        return expect(_this.result).toEqual('Must have a valid exit method');
      });
    });
  });
  return describe('parse', function() {
    Given(function() {
      return spyOn(StateManager, 'regExpStateConversion').andReturn('regExpStateConversion');
    });
    describe('when attributes already have a regexp', function() {
      Given(function() {
        return _this.args = {
          regExp: 'regExp'
        };
      });
      When(function() {
        return _this.result = _this.prototype.parse.call(_this.dummy, _this.args);
      });
      return Then(function() {
        return expect(_this.result).toEqual(_this.args);
      });
    });
    return describe('attributes passed are an object', function() {
      When(function() {
        return _this.result = _this.prototype.parse.call(_this.dummy, {});
      });
      Then(function() {
        return expect(_this.result.regExp).toEqual('regExpStateConversion');
      });
      return Then(function() {
        return expect(_this.result.transitions instanceof StateManager.Transitions).toBe(true);
      });
    });
  });
});
