var express = require('express')
var router = express.Router()

var penggunaController = require('../controller/pengguna_controller')

router.post('/tambahPengguna', penggunaController.create)
router.post('/editPengguna', penggunaController.update)
router.post('/deletePengguna', penggunaController.delete)
router.post('/tampilPerkelasPengguna', penggunaController.tampilPenggunaPerkelas)
router.post('/monitoringPengguna', penggunaController.monitoringPengguna)
router.post('/dataharianPengguna', penggunaController.dataHarianPengguna)
router.post('/status_harianPengguna', penggunaController.statusMonitoringPengguna)
router.post('/status_bulananPengguna', penggunaController.statusBulananPengguna)

router.post('/updateTahunPengguna', penggunaController.updateTahunPengguna) 
// router.post('/updatedev_pengguna', penggunaController)
// Login

router.post('/login', penggunaController.login)

module.exports = router