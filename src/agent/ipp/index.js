var Agent = require('../index.js')
var Case = require('../../case')
var Printer = require('ipp-printer')
var debug = require('debug')('printer-monitor')
class IppAgent extends Agent {
  constructor (inOptions) {
    super(inOptions)
    this.title = inOptions.title
    this.port = inOptions.port
    this.next = inOptions.next
    this.id = inOptions.id
  }
  onJob (job) {
    debug('[job %d] Printing document: %s', job.id, job.name)
    let cs = Case.createSync({
      tmpFolder: this.options.agents.common.tmp_fld
    })

    var file = cs.createBodyStream()

    job.on('end', () => {
      debug([job %d] Document saved as %s', job.id)
      cs.setParams({
        user: job.userName,
        document: job.name,
        jobId: job.id
      })

      this.store.doStore({
        case: cs
      }, () => {
        debug('[job %d] Document stored %s', job.id)
      })
    })

    job.pipe(file)
  }

  start (inParams, onDone) {
    return super.start(inParams, (err) => {
      if (err) return onDone(err)
      var printer = new Printer({ name: this.name })
      printer.on('job', this.onJob.bind(this))
      return onDone()
    })
  }
}

module.exports = IppAgent
