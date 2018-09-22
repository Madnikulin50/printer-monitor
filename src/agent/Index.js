const storeLoader = require('../store')
class Agent {
  constructor (inOptions) {
    this._options = inOptions.options
  }

  get name () {
    return this.title || 'Unknown'
  }

  get options () {
    return this._options
  }

  start (inParams, onDone) {
    let storeAllOptions = this.options.store
    let storeOptions = storeAllOptions[storeAllOptions.active]
    storeLoader(storeOptions, (err, store) => {
      if (err) { return onDone(err) }
      this._store = store
      return onDone()
    })
  }

  stop (inParams, onDone) {

  }

  get store () {
    return this._store
  }
  static createAgentManager (inOptions, onDone) {
    const AgentManager = require('./manager.js')
    return AgentManager.create(inOptions, onDone)
  }
}

module.exports = Agent
