
describe('StateManager.States', function() {
  var buildDummy, buildModel, buildModels,
    _this = this;
  buildDummy = function() {
    return _this.dummy = {
      models: buildModels(),
      find: spyOn(_this.prototype, 'find').andCallThrough()
    };
  };
  buildModels = function() {
    return [buildModel(true, 'foo', false), buildModel(false, 'regExp', true)];
  };
  buildModel = function(initial, regExp) {
    var model;
    model = jasmine.createSpyObj('model', ['get']);
    model.get.when('initial').thenReturn(initial);
    model.get.when('regExp').thenReturn(regExp);
    return model;
  };
  Given(function() {
    return _this.prototype = StateManager.States.prototype;
  });
  Given(function() {
    return buildDummy();
  });
  Then(function() {
    return expect(_this.prototype.model).toEqual(StateManager.State);
  });
  describe('findInitial', function() {
    When(function() {
      return _this.result = _this.prototype.findInitial.call(_this.dummy);
    });
    Then(function() {
      return expect(_this.dummy.find).toHaveBeenCalledWith(jasmine.any(Function));
    });
    return Then(function() {
      return expect(_this.result).toEqual(_this.dummy.models[0]);
    });
  });
  return describe('match', function() {
    When(function() {
      return _this.result = _this.prototype.match.call(_this.dummy, /regExp/);
    });
    Then(function() {
      return expect(_this.dummy.find).toHaveBeenCalledWith(jasmine.any(Function));
    });
    return Then(function() {
      return expect(_this.result).toEqual(_this.dummy.models[1]);
    });
  });
});
