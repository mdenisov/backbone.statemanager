var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

StateManager.States = (function(_super) {

  __extends(States, _super);

  function States() {
    return States.__super__.constructor.apply(this, arguments);
  }

  States.prototype.model = StateManager.State;

  States.prototype.findInitial = function() {
    return this.find(function(state) {
      return !!state.get('initial');
    });
  };

  States.prototype.match = function(name) {
    return this.find(function(state) {
      return state.get('regExp').match(name);
    });
  };

  return States;

})(Backbone.Collection);
