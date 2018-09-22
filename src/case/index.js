var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var md5 = require('md5')

const tools = require('../tools')

const paramsFilename = '.params'
const bodyFilename = '.body'

class Case {
  constructor () {
    this.channel = 'undefined'
    this.agent = 'undefined'
    this.id = crypto.randomBytes(48).toString('hex')
  }
  static createSync (inParams) {
    let cs = new Case()
    cs._folder = path.join(inParams.tmpFolder, cs.id)
    fs.mkdirSync(cs._folder)
    return cs
  }
  static fromCatalog (inPath, onDone) {
    let cs = new Case()
    cs._folder = inPath
    cs.loadParams((err) => {
      if (err) { return onDone(err) }
      return onDone(null, cs)
    })
  }

  clean (onDone = (err) => { if (err) console.log(err) }) {
    return tools.unlinkFolder(this._folder, (err) => {
      onDone(err)
    })
  }

  getField (inField) {
    let val = this[inField]
    if (val !== undefined) { return val }
    if (inField === 'body') { return fs.readFileSync(path.join(this._folder, bodyFilename), 'utf8') }
    return undefined
  }

  storeParams () {
    fs.writeFile(path.join(this._folder, paramsFilename), JSON.stringify(this, '\t'), 'utf8')
  }

  loadParams (onDone) {
    fs.readFile(path.join(this._folder, paramsFilename), 'utf8', (err, data) => {
      if (err) { return onDone(err) }
      try {
        let params = JSON.parse(data)
        this.channel = undefined
        this.agent = undefined
        this.id = undefined
        Object.assign(this, params)
        return onDone()
      } catch (error) {
        return onDone(err)
      }
    })
  }

  getParams () {
    return this
  }

  setParams (inParams) {
    Object.assign(this, inParams)
    this.storeParams()
  }

  setBody (inString, onDone) {
    fs.writeFile(path.join(this._folder, bodyFilename), inString, 'utf8', onDone)
  }

  getBody (onDone) {
    fs.readFile(path.join(this._folder, bodyFilename), onDone)
  }

  createBodyStream () {
    return fs.createWriteStream(path.join(this._folder, bodyFilename))
  }

  calcMD5 () {
    let buf = JSON.stringify(this)
    return md5(buf)
  }

  hasBodyStream () {
    return fs.existsSync(path.join(this._folder, bodyFilename))
  }

  getBodyStream () {
    return fs.createReadStream(path.join(this._folder, bodyFilename))
  }

  ensureFolder (inPath, onDone) {
    fs.stat(inPath, (err, stat) => {
      if (err) {
        return fs.mkdir(inPath, onDone)
      }
      return onDone()
    })
  }
}

module.exports = Case
