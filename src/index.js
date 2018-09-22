var Options = require('./options')
var Backend = require('./backend')
var Agent = require('./agent')
var path = require('path')
var debug = require('debug')('printer-monitor')
var opts = new Options(path.join(process.cwd(), 'config'))

var backend = new Backend(opts)
var agentManager
Agent.createAgentManager(opts, (err, am) => {
  if (err) { debug(err) }
  agentManager = am
})

process.on('uncaughtException', (err) => {
  console.error(err.message)
  if (err.stack) {
    console.error(err.stack)
  }
  process.exit(1)
})
