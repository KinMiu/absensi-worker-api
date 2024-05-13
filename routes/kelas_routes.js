var express = require('express')
var router = express.Router()

var kelasController = require('../controller/kelas_controller')

router.post('/kelasTambah', kelasController.create)
router.get('/getKelas', kelasController.getKelas)
router.post('/updateKelas', kelasController.update)
router.post('/dev_TambahKelas', kelasController.createKelas_dev)
router.post('/dev_EditKelas', kelasController.updateKelas_dev)
router.post('/dev_DeleteKelas', kelasController.deleteKelas_dev)

module.exports = router