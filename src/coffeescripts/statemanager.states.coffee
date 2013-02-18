class StateManager.States extends Backbone.Collection
  model : StateManager.State

  findInitial : -> @find (state) -> !!state.get 'initial'

  match : (name) -> @find (state) -> state.get('regExp').match name