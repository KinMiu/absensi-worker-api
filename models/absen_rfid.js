const mongoose = require('mongoose')
const Schema = mongoose.Schema
const conn = require('../database/connection')

const absensiRFIDSchema = new Schema({
  mac_address: {
    type: String
  },
  rfid: {
    type: String
  },
  created_at: {
    type: Date,
    default: () => new Date()
  }
}, {
  versionKey: false,
  collection: 'absensi_rfid_db'
})

module.exports = conn.db().model('absensi_rfid_db', absensiRFIDSchema)