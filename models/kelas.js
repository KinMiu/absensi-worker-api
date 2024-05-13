const mongoose = require('mongoose')
const Schema = mongoose.Schema
const conn = require('../database/connection')

const KelasSchema = new Schema({
  nama_kelas: {
    type: String
  },
  tingkat: {
    type: String
  },
  jurusan: {
    type: String
  },
  sekolah: {
    type: String
  },
  jam_masuk: {
    type: String
  },
  jam_pulang: {
    type: String
  }
}, {
  versionKey: false,
  collection: 'kelas_dev'
})

module.exports = conn.db().model('kelas_dev', KelasSchema)