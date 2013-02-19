var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

StateManager.Transitions = (function(_super) {

  __extends(Transitions, _super);

  function Transitions() {
    return Transitions.__super__.constructor.apply(this, arguments);
  }

  Transitions.prototype.model = StateManager.Transition;

  Transitions.prototype.matchTransitions = function(type, stateName) {
    return this.filter(function(transition) {
      return transition.get('type') === type && transition.get('regExp').test(stateName) !== transition.get('inverse');
    });
  };

  Transitions.prototype.parse = function(attrs) {
    var key, transitions, value;
    transitions = [];
    if (_.isObject(attrs)) {
      for (key in attrs) {
        value = attrs[key];
        transitions.push({
          pattern: key,
          method: value
        });
      }
    }
    return transitions;
  };

  return Transitions;

})(Backbone.Collection);
