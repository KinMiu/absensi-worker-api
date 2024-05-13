const mongoose = require('mongoose')
const Schema = mongoose.Schema
const conn = require('../../database/connection')

const macAddress_dev = new Schema({
  NAMA_MESIN: {
    type: String
  },
  SEKOLAH: {
      type: String
  },
  DESKRIPSI: {
      type: String
  },
  ADDRESS: {
      type: Array
  }
}, {
  versionKey: false,
  collection: 'mac_address_dev'
})

module.exports = conn.db().model('mac_address_dev', macAddress_dev)