const mongoose = require('mongoose')
const Schema = mongoose.Schema
const conn = require('../database/connection')

const MacAddressSchema = new Schema({
  lokasi: {
    type: String
  },
  address: {
    type: String
  },
  nama: {
    type: String
  },
  deskripsi: {
    type: String
  }
}, {
  versionKey: false,
  collection: 'mac_address_db'
})

module.exports = conn.db().model('mac_address_db', MacAddressSchema)