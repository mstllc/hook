const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))
const path = require('path')
const url = require('url')
const moment = require('moment')
const parameterResponse = require('../parameter-responder.js')
const buildRequestObject = require('../request-object-builder.js')
const ROOT = path.resolve(__dirname, '../../..')
const LOG_DIR = path.join(ROOT, 'data/save')

// Create LOG_DIR if not exists
try {
  let stat = fs.statSync(LOG_DIR)
  if (!stat.isDirectory()) {
    console.log('Log directory path exists, but is not a writeable directory')
    process.exit(1)
  }
} catch (e) {
  if (e.code === 'ENOENT') {
    fs.mkdirSync(LOG_DIR)
  } else {
    console.log('Error creating log directory')
    console.log(e)
    process.exit(1)
  }
}

function createDirectory(pathname) {
  return fs.statAsync(pathname)
    .then(stat => {
      if (!stat.isDirectory()) {
        throw new Error('Log directory path exists, but is not a writeable directory')
      }
    })
    .catch({code: 'ENOENT'}, (error) => {
      return fs.mkdirAsync(pathname)
    })
}

exports.save = function(req, res) {
  let ro = buildRequestObject(req)
  let date = moment()
  createDirectory(path.join(LOG_DIR, ro.hostname))
    .then(() => {
      return createDirectory(path.join(LOG_DIR, ro.hostname, date.format('YYYY-MM-DD')))
    })
    .then(() => {
      return fs.writeFileAsync(path.join(LOG_DIR, ro.hostname, date.format('YYYY-MM-DD'), `${date.format('HH:mm:ss')}.json`), JSON.stringify(ro, null, 2))
    })
    .catch(error => {
      console.log('ERROR', error)
    })

  return parameterResponse(req, res)
}

exports.listHostnames = function(req, res) {
  fs.readdirAsync(LOG_DIR)
    .then(files => {
      if (req.query.format === 'json') {
        res.json(files)
      } else {
        res.render('file-list', {files: files, title: 'Hostnames', linkBase: '/save/list'})
      }
    })
    .catch(error => {
      console.log('ERROR', error)
      res.status(403).json(error)
    })
}

exports.listDates = function(req, res) {
  fs.readdirAsync(path.join(LOG_DIR, req.params.hostname))
    .then(files => {
      if (req.query.format === 'json') {
        res.json(files)
      } else {
        res.render('file-list', {files: files, title: `${req.params.hostname} - Dates`, linkBase: `/save/list/${req.params.hostname}`})
      }
    })
    .catch(error => {
      console.log('ERROR', error)
      res.status(403).json(error)
    })
}

exports.listTimes = function(req, res) {
  fs.readdirAsync(path.join(LOG_DIR, req.params.hostname, req.params.date))
    .then(files => {
      if (req.query.format === 'json') {
        res.json(files)
      } else {
        res.render('file-list', {files: files, title: `${req.params.hostname} - ${req.params.date} - Times`, linkBase: `/save/list/${req.params.hostname}/${req.params.date}`})
      }
    })
    .catch(error => {
      console.log('ERROR', error)
      res.status(403).json(error)
    })
}

exports.printTimeFile = function(req, res) {
  fs.readFileAsync(path.join(LOG_DIR, req.params.hostname, req.params.date, req.params.time))
    .then(data => {
      res.json(JSON.parse(data.toString()))
    })
    .catch(error => {
      console.log('ERROR', error)
      res.status(403).json(error)
    })
}
