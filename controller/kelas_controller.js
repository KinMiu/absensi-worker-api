require('dotenv').config()
const Kelas = require('../models/kelas')
const Kelas_dev = require('../models/dev/kelas_dev')
const moment = require('moment')
const fs = require('fs-extra')
const chalk = require('chalk')

const ObjectId = require('mongodb').ObjectId
exports.parse = (msg, channel) => {
  let message = JSON.parse(msg.content.toString())
  if (message.CMD_TYPE === 0) {
    this.create(msg, channel)
  } else {
    console.log(chalk.bgRed(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] ${msg.fields.routingKey} - WRONG CMD_TYPE`))
  }
}

exports.create = async function (req, res) {
  try {
    let kelasItem = new Kelas({
      nama_kelas: req.body.nama_kelas,
      tingkat: req.body.tingkat,
      jurusan: req.body.jurusan,
      sekolah: req.body.sekolah,
      jam_masuk: req.body.jam_masuk,
      jam_pulang: req.body.jam_pulang
    })

    await kelasItem.save()
    operateFile(process.env.MAC_ADDRESS_DIR, kelasItem)

    // channel.ack(msg)
  }
  catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}

exports.update = async function (req, res) {
  try {
    var sekolah = req.body.sekolah
    Kelas.updateOne({ _id: ObjectId(req.body._id) }, {
      nama_kelas: req.body.nama_kelas,
      tingkat: req.body.tingkat,
      jurusan: req.body.jurusan,
      jam_masuk: req.body.jam_masuk,
      jam_pulang: req.body.jam_pulang
    }).exec(function (err, result) {
      if (err) {
        return res.json({ success: false, data: err })
      } else {
        operateFile(process.env.MAC_ADDRESS_DIR, sekolah)
        return res.json({ success: true, data: result })
      }
    })
  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}

//--------------------------------REVISI DEV--------------------------------------------//

exports.getKelas = async function (req, res) {
  try {
    const dataKelas = await Kelas_dev.find()
    res.json(dataKelas)
  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}

exports.createKelas_dev = async function (req, res) {
  try {

    let kelasItem = new Kelas_dev({
      NAMA_SEKOLAH: req.body.nama_sekolah,
      NAMA_KELAS: req.body.nama_kelas,
      Tingkat: req.body.tingkat,
      Jurusan: req.body.jurusan,
      Jam_Masuk: req.body.jam_masuk,
      Jam_Pulang: req.body.jam_pulang
    })

    kelasItem.save(function (err, result) {
      if (err) {
        return res.json({ success: false, data: err })
      } else {
        operateFile_dev(process.env.MAC_ADDRESS_DIR, kelasItem)
        return res.json({ success: true, data: result })
      }
    })

  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}

exports.updateKelas_dev = async function (req, res) {
  try {

    var sekolah = req.body.sekolah

    Kelas_dev.updateOne({ _id: ObjectId(req.body._id) }, {
      NAMA_KELAS: req.body.nama_kelas,
      Tingkat: req.body.tingkat,
      Jurusan: req.body.jurusan,
      Jam_Masuk: req.body.jam_masuk,
      Jam_Pulang: req.body.jam_pulang
    }).exec(function (err, result) {
      if (err) {

        console.log("tambah kelas dev" + err)
        return res.json({ success: false, data: err })
      } else {
        console.log("tambah kelas dev")
        operateFile_dev(process.env.MAC_ADDRESS_DIR, sekolah)
        return res.json({ success: true, data: result })
      }
    })
  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}

exports.deleteKelas_dev = async function (req, res) {
  try {
    Kelas_dev.deleteOne({ _id: ObjectId(req.body._id) }).exec(function (err, result) {
      if (err) {
        return res.json({ success: false, data: err })
      } else {
        return res.json({ success: true, data: result })
      }
    })
  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}

function operateFile(path, message) {
  Kelas.find({ sekolah: message.sekolah }, { _id: false }).lean().exec((err, result) => {
    if (err) throw new Error(err)
    else {
      fs.writeFileSync(path + message.sekolah + '_kelas.json', JSON.stringify(result))
    }
  })
}

// testinng
function operateFile_dev(path, message) {
  Kelas_dev.find({ NAMA_SEKOLAH: message.NAMA_SEKOLAH }).lean().exec((err, result) => {
    if (err) throw new Error(err)
    else {
      fs.writeFileSync(path + message.NAMA_SEKOLAH + '_kelas.json', JSON.stringify(result))
    }
  })
}