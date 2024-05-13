const mongoose = require('mongoose')
const Schema = mongoose.Schema
const conn = require('../database/connection')

const SekolahSchema = new Schema({
  nama_sekolah: {
    type: String
  },
  mac_address_absensi: {
    type: Array
  },
  kelas: {
    type: Array
  }
}, {
  versionKey: false,
  collection: 'sekolah_db'
})

module.exports = conn.db().model('sekolah_db', SekolahSchema)