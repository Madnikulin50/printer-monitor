const fs = require('fs')
const path = require('path')
const async = require('async')
class AgentManager {
  static create (inOptions, onDone) {
    let agentOpts = inOptions.agents
    if (!fs.existsSync(agentOpts.common.tmp_fld)) {
      fs.mkdirSync(agentOpts.common.tmp_fld)
    }
    let am = new AgentManager()
    am.agents = agentOpts.agents.map((agentDef) => {
      let agentOpt = Object.assign({}, agentDef)
      agentOpt.options = inOptions
      let AgentClass = require(path.join(__dirname, agentOpt.type))
      return new AgentClass(agentOpt)
    })

    return async.eachSeries(am.agents, (agent, agentDone) => {
      return agent.start({}, agentDone)
    }, (err) => onDone(err, am))
  }
}

module.exports = AgentManager
