var express = require('express')
var router = express.Router()

var monitorController = require('../controller/monitoring_controller')

router.post('/editMonitoring', monitorController.create)
module.exports = router