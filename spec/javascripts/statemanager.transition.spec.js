
describe('StateManager.Transition', function() {
  var _this = this;
  Given(function() {
    return _this.prototype = StateManager.Transition.prototype;
  });
  Then(function() {
    return expect(_this.prototype.idAttribute).toEqual('name');
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
    describe('when pattern attribute is not a string', function() {
      Given(function() {
        return _.isString.andReturn(false);
      });
      When(function() {
        return _this.result = _this.prototype.validate.call(_this.dummy, {});
      });
      return Then(function() {
        return expect(_this.result).toEqual('Must have a pattern');
      });
    });
    describe('when method attribute is not a isFunction', function() {
      Given(function() {
        return _.isFunction.andReturn(false);
      });
      When(function() {
        return _this.result = _this.prototype.validate.call(_this.dummy, {});
      });
      return Then(function() {
        return expect(_this.result).toEqual('Must have a method');
      });
    });
    return describe('when regExp attribute is not a regExp', function() {
      Given(function() {
        return _.isRegExp.andReturn(false);
      });
      When(function() {
        return _this.result = _this.prototype.validate.call(_this.dummy, {});
      });
      return Then(function() {
        return expect(_this.result).toEqual('Must have a valid regexp');
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
      return Then(function() {
        return expect(_this.result).toEqual({
          regExp: 'regExpStateConversion'
        });
      });
    });
  });
});
