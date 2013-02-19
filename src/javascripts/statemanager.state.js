(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  StateManager.State = (function(_super) {

    __extends(State, _super);

    function State() {
      return State.__super__.constructor.apply(this, arguments);
    }

    State.prototype.idAttribute = 'pattern';

    State.prototype.validate = function(attrs, options) {
      switch (true) {
        case !_.isString(attrs.pattern):
          return 'Must have a pattern';
        case !attrs.transitions instanceof StateManager.Transitions:
          return 'Transitions must be a valid collection';
        case !_.isRegExp(attrs.regExp):
          return 'Must have a valid regexp';
        case attrs.enter && !_.isFunction(attrs.enter):
          return 'Must have a valid enter method';
        case attrs.exit && !_.isFunction(attrs.exit):
          return 'Must have a valid exit method';
      }
    };

    State.prototype.matchTransitions = function(type, stateName) {
      return _.pluck(this.get('transitions').matchTransitions(type, stateName), 'method');
    };

    State.prototype.parse = function(attrs) {
      var _ref;
      attrs.transitions = new StateManager.Transitions(attrs.transitions);
      if ((_ref = attrs.regExp) == null) {
        attrs.regExp = StateManager.regExpStateConversion(attrs.pattern);
      }
      return attrs;
    };

    return State;

  })(Backbone.Model);

}).call(this);
