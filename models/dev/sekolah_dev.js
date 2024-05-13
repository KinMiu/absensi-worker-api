const mongoose = require('mongoose')
const Schema = mongoose.Schema
const conn = require('../../database/connection')

const sekolahDev = new Schema({
  NAMA_SEKOLAH: {
    type: String
  },
  ABSENSI: {
    type: Object
  },
  Mesin: {
    type: Array
  }
}, {
  versionKey: false,
  collection: 'sekolah_dev'
})

module.exports = conn.db().model('sekolah_dev', sekolahDev)