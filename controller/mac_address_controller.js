require('dotenv').config()
const MacAddress = require('../models/mac_address')
const Sekolah = require('../models/sekolah')
const moment = require('moment')
const fs = require('fs-extra')
const chalk = require('chalk')

const type = 'MAC ADDRESS MESIN'

const ObjectId = require('mongodb').ObjectId

// --------------------REVISI DEV-----------------------//
const Macaddress_dev = require('../models/dev/mac_address_dev')
const sekolah_dev = require('../models/dev/sekolah_dev')
const mac_address = require('../models/mac_address')

// exports.parse = (msg, channel) => {
//   let message = JSON.parse(msg.content.toString())
//   if (message.CMD_TYPE === 0) {
//     this.create(msg, channel)
//   } else {
//     console.log(chalk.bgRed(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] ${msg.fields.routingKey} - WRONG CMD_TYPE`))
//   }
// }

exports.create = async function (req, res) {
  // let message = JSON.parse(msg.content.toString())
  try {
    let macItem = new MacAddress({
      lokasi: req.body.lokasi,
      address: req.body.address,
      nama: req.body.nama,
      nama_sekolah: req.body.nama_sekolah,
      deskripsi: req.body.deskripsi
    })
    let nama_sekolah = req.body.nama_sekolah
    macItem.save(function (err, result) {
      if (err) {
        return res.json({ success: false, data: err })
      } else {
        sekolah_dev.updateOne({ NAMA_SEKOLAH: req.body.nama_sekolah }, { $push: { mac_address_absensi: req.body.address } })
        operateFile(process.env.MAC_ADDRESS_DIR, nama_sekolah)
        return res.json({ success: true, data: result })
      }
    })
    // channel.ack(msg)
  }
  catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}

exports.delete = async function (req, res) {
  try {
    var nama_sekolah = req.body.nama_sekolah
    var mac_address = req.body.address
    var id_mac = req.body.id_mac
    sekolah_dev.updateOne({ 'NAMA_SEKOLAH': nama_sekolah },
      { $pull: { 'mac_address_absensi': mac_address } }
    ).exec(function (err, result) {
      if (err) {
        return res.json({ success: false, data: err })
      } else {
        operateFile(process.env.MAC_ADDRESS_DIR, nama_sekolah)
        return res.json({ success: true, data: result })
      }
    })

  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}


//--------------------------------REVISI DEV--------------------------------------------//

// error, { ADDRESS: [], _id: 6605199cd6ad183318a10bad }
exports.createDev = async function (req, res) {
  try {
    let macItem = new Macaddress_dev({
      NAMA_MESIN: req.body.nama_mesin,
      SEKOLAH: req.body.nama_sekolah,
      DESKRIPSI: req.body.deskripsi
    })

    Macaddress_dev.updateOne({ SEKOLAH: req.body.nama_sekolah },
      { $push: { ADDRESS: req.body.address } }).exec(function (err, ress) {
        if (err) {
          return res.json({ success: false, data: err })
        } else {
          operateFile_dev(process.env.MAC_ADDRESS_DIR, macItem.SEKOLAH)
          console.log(macItem)
          return res.json({ success: true, data: ress })
        }
      })
  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}

exports.getMesin = async function (req, res) {
  try {
    const dataMesin = await mac_address.find()
    console.log(dataMesin)
    res.json(dataMesin)
  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}


function operateFile(path, sekolah) {
  Sekolah.find({ nama_sekolah: sekolah }, { nama_sekolah: true, mac_address_absensi: true, '_id': false }).lean().exec((err, result) => {
    console.log(result)
    fs.writeFile(path + sekolah + '_mesin.json', JSON.stringify(result))
  })
}

function operateFile_dev(path, sekolah) {
  Macaddress_dev.find({ SEKOLAH: sekolah }).lean().exec((err, result) => {
    console.log(result + sekolah)
    fs.writeFile(path + sekolah + '_mesin.json', JSON.stringify(result))
  })
}