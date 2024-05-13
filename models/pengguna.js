const mongoose = require('mongoose')
const Schema = mongoose.Schema
const conn = require('../database/connection')

const PenggunaSchema = new Schema({
  email: {
    type: String
  },
  sandi: {
    type: String
  },
  peran: {
    type: String,
    default: 'Murid'
  },
  mengajar: {
    type: Array,
    default: []
  },
  RFID: {
    serial_number: String,
    status: { type: String, default: '' },
    rekap_rfid: { type: Object, default: '' }
  },
  Kelas: [{
    _id: false,
    nama_kelas: String,
    tahun_Ajaran: String
  }],
  sekolah: {
    type: String
  },
  profil: {
    username: String,
    nama_lengkap: String,
    jenis_kelamin: String,
    bio: { type: String, default: '-' },
    foto: { type: String, default: 'http://filehosting.pptik.id/TESISS2ITB/Vidyanusa/default-profile-picture.png' }
  }
}, {
  versionKey: false,
  collection: 'pengguna'
})

module.exports = conn.db().model('pengguna', PenggunaSchema)