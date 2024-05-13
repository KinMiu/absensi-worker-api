require('dotenv').config()

const Sekolah_dev = require('../models/dev/sekolah_dev')
const Kelas_dev = require('../models/dev/kelas_dev')
const Pengguna_dev = require('../models/pengguna')

const moment = require('moment')
const fs = require('fs-extra')
const chalk = require('chalk')
const sekolah = require('../models/sekolah')
const sekolah_dev = require('../models/dev/sekolah_dev')

const ObjectId = require('mongodb').ObjectId
exports.parse = (msg, channel) => {
  let message = JSON.parse(msg.content.toString())
  if (message.CMD_TYPE === 0) {
    this.create(msg, channel)
  } else {
    console.log(chalk.bgRed(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] ${msg.fields.routingKey} - WRONG CMD_TYPE`))
  }
}


exports.create_mac_address = async function (req, res) {
  var inputNamaSekolah = req.body.nama_sekolah
  var inputNamaMesin = req.body.nama_mesin
  var inputMesin = req.body.mesin
  var inputDeskripsi = req.body.deskripsi

  var dataMac = {
    "Mesin": {
      "nama_mesin": inputNamaMesin,
      "address": inputMesin,
      "deskripsi": inputDeskripsi
    }
  }
  try {
    Sekolah_dev.updateOne(
      { NAMA_SEKOLAH: inputNamaSekolah },
      { $push: dataMac },
      { upsert: true, new: true }
    ).exec(function (error, result) {
      if (error) {
        return res.json({ success: false, data: error })
      } else {
        operateFile(process.env.MAC_ADDRESS_DIR, inputNamaSekolah)
        return res.json({ success: true, data: result })
      }
    })
  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}

exports.getSekolah = async function (req, res) {
  try {
    const dataSekolah = await sekolah_dev.find()
    res.json(dataSekolah)
  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}

exports.pull_mac_address = async function (req, res) {
  var inputNamaSekolah = req.body.nama_sekolah
  var inputMesin = req.body.mesin

  try {
    Sekolah_dev.updateOne({
      NAMA_SEKOLAH: inputNamaSekolah
    }, { $pull: { "Mesin": { "address": inputMesin } } }).exec(function (error, result) {
      if (error) {
        return res.json({ success: false, data: error })
      } else {
        operateFile(process.env.MAC_ADDRESS_DIR, inputNamaSekolah)
        return res.json({ success: true, data: result })
      }
    })
  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}



function operateFile(path, message) {
  Sekolah_dev.find({ NAMA_SEKOLAH: message }).lean().exec((err, result) => {
    fs.writeFileSync(path + message + '_sekolah.json', JSON.stringify(result))
  })
}
