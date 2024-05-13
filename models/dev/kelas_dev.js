const mongoose = require('mongoose')
const Schema = mongoose.Schema
const conn = require('../../database/connection')

const kelasDev = new Schema({
  NAMA_SEKOLAH: {
    type: String
  },
  NAMA_KELAS: {
      type: String
  },
  Tingkat: {
    type: String
  },
  Jurusan: {
    type: String
  },
  Jam_Masuk: {
    type: String
  },
  Jam_Pulang: {
    type: String
  },
  ABSENSI: {
      type: Object
  }
}, {
  versionKey: false,
  collection: 'kelas_dev'
})

module.exports = conn.db().model('kelas_dev', kelasDev)