(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  StateManager.Transition = (function(_super) {

    __extends(Transition, _super);

    function Transition() {
      return Transition.__super__.constructor.apply(this, arguments);
    }

    Transition.prototype.idAttribute = name;

    Transition.prototype.validate = function(attrs) {
      switch (true) {
        case !_.isString(attrs.pattern):
          return 'Must have a pattern';
        case !_.isFunction(attrs.method):
          return 'Must have a method';
        case !_.isRegExp(attrs.regExp):
          return 'Must have a valid regexp';
      }
    };

    Transition.prototype.parse = function(attrs) {
      var _ref;
      if ((_ref = attrs.regExp) == null) {
        attrs.regExp = StateManager.regExpStateConversion(attrs.pattern);
      }
      return attrs;
    };

    return Transition;

  })(Backbone.Model);

}).call(this);
