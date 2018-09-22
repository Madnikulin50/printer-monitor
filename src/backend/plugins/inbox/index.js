var storeLoader = require('../../../store')

module.exports = function (inOptions, inBackend) {
  let app = inBackend.app
  let storeAllOptions = inOptions.store
  var storeOptions = storeAllOptions[storeAllOptions.active]
  storeLoader(storeOptions,
    (err, store) => {
      if (err) { throw err }

      app.post('/api/get-prints', (req, res) => {
        var params = req.body || {}
        params = Object.assign(params, req.query)
        let filter = params.filter
        if (filter !== undefined &&
    filter.length === 0) { filter = undefined }
        let start = params.start
        if (start === undefined) { start = 0 } else { start = parseInt(start) }
        store.getIncidents({
          filter: filter,
          start: start
        }, (err, data) => {
          if (err) {
            res.sendStatus(400, err)
          }
          res.json(data)
        })
      })
      app.get('/api/get-info', (req, res) => {
        res.json({})
      })
      app.get('/api/get-print', (req, res) => {
        var id = req.query.id
        store.getIncident({
          id: id
        }, (err, data) => {
          if (err) {
            return res.sendStatus(400, err)
          }
          res.json(data)
        })
      })

      app.post('/api/push-label', (req, res) => {
        var params = req.body || {}
        params = Object.assign(params, req.query)
        store.pushLabel(params, (err) => {
          if (err) { return res.sendStatus(400, err) }
          res.sendStatus(200, 'OK')
        })
      })
      // TODO: fmkdakgmnadkls,

      app.post('/api/pop-label', (req, res) => {
        var params = req.body || {}
        params = Object.assign(params, req.query)
        store.popLabel(params, (err) => {
          if (err) { return res.sendStatus(400, err) }
          res.sendStatus(200, 'OK')
        })
      })

      app.get('/api/enum-labels', (req, res) => {
        var labels = [
          { name: 'Incident', color: 'warning' },
          { name: 'Leak', color: 'danger' },
          { name: 'News', color: 'success' },
          { name: 'Advertising', color: 'success' },
          { name: 'Spam', color: 'success' }
        ]
        res.json(labels)
      })

      let removePrint = (req, res) => {
        let ids = req.body || {}
        ids = Object.assign(ids, req.query)
        if (ids.id === undefined) { return res.sendStatus(400, 'Print identificator not set') }

        store.removePrint({
          ids: Array.isArray(ids.id) ? ids.id : [ids.id]
        }, (err, data) => {
          if (err) {
            return res.sendStatus(400, err)
          }
          res.json(data)
        })
      }

      app.get('/api/remove-print', removePrint)
      app.post('/api/remove-print', removePrint)

      app.get('/api/get-store-info', (req, res) => {
        store.getNumIncidents({
          unreaded: true
        }, (err, data) => {
          if (err) {
            return res.sendStatus(400, err)
          }
          res.json(data)
        })
      })
      app.get('/api/get_print_blob', (req, res) => {
        let params = req.body || {}
        params = Object.assign(params, req.query)
        store.getAttchment(params, (err, stream) => {
          if (err) {
            res.send(400)
            return
          }
          return stream.pipe(res)
        })
      })
    })
}
