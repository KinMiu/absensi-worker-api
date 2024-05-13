var express = require('express')
var router = express.Router()
var mesinController = require('../controller/mac_address_controller')

router.post('/tambahMacAddress', mesinController.create)
router.post('/deleteMacAddress', mesinController.delete)
router.get('/getmesin', mesinController.getMesin)

router.post('/tambahdevMacAddress', mesinController.createDev)

module.exports = router