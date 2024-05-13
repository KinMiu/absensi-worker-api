var express = require('express')
var router = express.Router()

var sekolahController = require('../controller/sekolah_controller')

router.post('/create_MacAddress', sekolahController.create_mac_address)
router.get('/get_MacAddress', sekolahController.getSekolah)
router.post('/delete_MacAddress', sekolahController.pull_mac_address)
// Login

module.exports = router