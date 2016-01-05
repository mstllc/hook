const express = require('express')
const handler = require('./handler.js')
let router = express.Router()

router.route('/list')
  .all(handler.listHostnames)

router.route('/list/:hostname')
  .all(handler.listDates)

router.route('/list/:hostname/:date')
  .all(handler.listTimes)

router.route('/list/:hostname/:date/:time')
  .all(handler.printTimeFile)

router.route('/')
  .all(handler.save)

module.exports = router
