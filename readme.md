# Backbone.StateManager

Simple, powerful state management for Backbone.js

## About StateManager

Backbone.StateManager is a module for Backbone.js that adds the ability to easily
manage and utilize states in any size JavaScript application. It can be used as
a stand alone object or in conjunction with a target object through it's addStateManager
method.

### Key Benefits

* Modular definitions of states
* Sub/pub architecture with Backbone.Events
* Support for transition events between states
* RegExp matching for states and transitions
* Easy to attach to any object

## Compatibility and Requirements

Backbone.StateManager currently has the following dependencies:

* [Underscore](http://underscorejs.org) v1.4.2
* [Backbone](http://backbonejs.org) v0.9.2

## Source Code and Downloads

Backbone.StateManager is written in CoffeeScript. You can download the raw source code
from the "src" folder or download the JavaScript build in the main directory.

The latest stable releases can be found at the links:

* Development: [backbone.statemanager.js](https://raw.github.com/crashlytics/backbone.statemanager/version-1.0.0rc/backbone.statemanager.js)

* Production: [backbone.statemanager.min.js](https://raw.github.com/crashlytics/backbone.statemanager/version-1.0.0rc/backbone.statemanager.min.js)

## Getting Started

Backbone.StateManager constructor takes two arguments, a state object and an options object, but neither is required.Passed in states will be automatically added and the options are set as an instance property.

```coffee
  stateManager = new Backbone.StateManager.Manager()
  # or
  states =
    foo :
      enter : -> console.log 'enter foo'
      exit : -> console.log 'exit foo'
    bar :
      enter : -> console.log 'enter bar'
      exit : -> console.log 'exit bar'

  stateManager = new Backbone.StateManager.Manager states
```

### Defining a State

A state is intended to be as modular as possible, so each state is expected to contain `enter` and `exit` methods that are used when entering or leaving that state. A state definition can also have a transitions property that contains several methods to be used when moving between specified states.

```coffee
  name :
    enter : -> console.log 'enter'
    exit : -> console.log 'exit'
    transitions :
      'onBeforeExitTo:anotherState' : -> # method to be called before exit to `anotherState`
      'onExitTo:anotherState' : -> # method to be called on exit to `anotherState`
      'onBeforeEnterFrom:anotherState' : -> # method to be called before entering from `anotherState`
      'onEnterFrom:anotherState' : -> # method to be called on entering from `anotherState`
```


### Defining State Transitions

Transitions are used to execute additional functionality when moving between specified states. There are 4 types of transitions that Backbone.StateManager.Manager will defaultly look for: `onBeforeExitTo`, `onExitTo`, `onBeforeEnterFrom`, and `onEnterFrom`. Each transition is a key value pair, where the value is a method and the key defines the transition type and the specified state (eg `onEnterFrom:specifiedState`).


### Defining Initial State



### Using RegExp

The key for each state is a pattern, just like routes in the `Backbone.Router`. A state's pattern is used to create RegExp for matching against requests to enter or exit a state. Likewise, state transitions can be defined with the RegExp shorthand as well.

```coffee
  states =
    pattern*splat :
      enter : -> console.log 'enter'
      exit : -> console.log 'exit'
      transitions :
        'onBeforeExitTo:foo*splat' : -> # method to be called before exit to state that starts with `foo`
```

#### Using not: In Transitions

State transitions provide support for :not prefixes to the state pattern.

```coffee
  pattern*splat :
    enter : -> console.log 'enter'
    exit : -> console.log 'exit'
    transitions :
      'onBeforeExitTo:not:foo*splat' : -> # method to be called before exit to state that does not start with `foo`
```

### Adding a State

New states can be added individually using `addState` and passing a pattern and a state object

```coffee
  definition =
    enter : -> console.log 'enter'
    exit : -> console.log 'exit'

  stateManager.addState pattern, definition
```

### Triggering a State

A state is triggered using `triggerState` and passing the name of the state and options. If the requested state is already the currentState, no methods will be executed. This can be overriden by passing in the option `reEnter : true` to the method.

```coffee
  stateManager.triggerState name, options
```
### Removing a State

A states can be added using `removeState` and passing in the pattern used to define the state.

```coffee
  stateManager.removeState pattern
```

### Using with Objects

StateManager provides an easy method to painlessly add a StateManager to any object. `StateManager.addStateManager` takes a target object and an optional set of options, reads in any states defined on the target, and creates a new StateManager. It also sets a number of methods on target, including `triggerState`, `getCurrentState`, and a reference to the StateManager at `target.stateManager`.

```coffee

View = Backbone.View.extend
  states :
    foo :
      enter : -> console.log 'enter bar'
      exit : -> console.log 'exit foo'
      transitions :
        'onExitTo:bar' : -> 'just exited foo and bar is about to be entered'
    bar :
      enter : -> console.log 'enter bar'
      exit : -> console.log 'exit bar'

  initialize : -> Backbone.StateManager.addStateManager @

```
### [Github Issues](//github.com/crashlytics/backbone.statemanager/issues)