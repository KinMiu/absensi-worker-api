require('dotenv').config()
const Pengguna = require('../models/pengguna')
const Absensi_rfid = require('../models/absen_rfid')
const sekolah_Dev = require('../models/dev/sekolah_dev')
const moment = require('moment')
const fs = require('fs-extra')
const md5 = require('md5')
const chalk = require('chalk')

let salt = 'LkywIKIDJk'
const ObjectId = require('mongodb').ObjectId

exports.parse = (msg, channel) => {
  let message = JSON.parse(msg.content.toString())
  if (message.CMD_TYPE === 0) {
    this.create(msg, channel)
  } else {
    this.create(msg, channel)
    // console.log(chalk.bgRed(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] ${msg.fields.routingKey} - WRONG CMD_TYPE`))
  }
}

exports.delete = async function (req, res) {
  try {
    Pengguna.findOne({ "profil.nama_lengkap": req.body.nama_lengkap }).exec(function (errors, resultOne) {
      if (errors) {
        Pengguna.deleteOne({ "profil.nama_lengkap": req.body.nama_lengkap }).exec(function (err, result) {
          if (err) {
            return res.json({ success: false, data: err })
          } else {
            var dataSekolah = {
              "sekolah": resultOne.sekolah
            }
            operateFile(process.env.MAC_ADDRESS_DIR, dataSekolah)
            return res.json({ success: true, data: result })
          }
        })
      } else {
        console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
      }
    })

  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}

exports.create = async function (req, res) {
  try {
    // console.log(req.body.tahun_Ajaran)
    let penggunaItem = new Pengguna({
      email: req.body.email,
      sandi: md5(req.body.sandi + salt),
      RFID: {
        serial_number: req.body.rfid,
        status: '',
        rekap_rfid: {}
      },
      Kelas: [{
        nama_kelas: req.body.nama_kelas,
        tahun_ajaran: req.body.tahun_Ajaran
      }],
      sekolah: req.body.sekolah,
      profil: {
        username: req.body.username,
        nama_lengkap: req.body.nama_lengkap,
        jenis_kelamin: req.body.jenis_kelamin
      }
    })

    penggunaItem.save(function (err, result) {
      if (err) {
        return res.json({ success: false, data: err })
      } else {
        operateFile(process.env.MAC_ADDRESS_DIR, penggunaItem)
        return res.json({ success: true, data: result })
      }
    })


    // channel.ack(msg)
  }
  catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Terjadi Error: ${error}`)
  }
}

exports.update = async function (req, res) {
  try {
    let penggunaItem = new Pengguna({
      RFID: {
        serial_number: req.body.rfid
      },
      Kelas: [{
        nama_kelas: req.body.nama_kelas,
        tahun_ajaran: req.body.tahun_Ajaran
      }],
      profil: {
        nama_lengkap: req.body.nama_lengkap
      },
      sekolah: req.body.sekolah
    })

    Pengguna.updateOne({ 'profil.nama_lengkap': req.body.nama_lengkap }, {
      RFID: {
        serial_number: req.body.rfid
      },
      Kelas: [{
        nama_kelas: req.body.nama_kelas,
        tahun_ajaran: req.body.tahun_ajaran
      }],
      profil: {
        nama_lengkap: req.body.nama_lengkap
      }
    }).exec(function (err, result) {
      if (err) {
        return res.json({ success: false, data: err })
      } else {

        operateFile(process.env.MAC_ADDRESS_DIR, penggunaItem)
        return res.json({ success: true, data: result })
      }
    })
  } catch (error) {
    console.log(`[${moment().utcOffset("+07:00").format('DD-MM-YYYY HH:mm:ss')}] Error: ${error}`)
  }
}

exports.updateTahunPengguna = async function (req, res) {
  Pengguna.update({ "Kelas.tahun_ajaran": "2018" },
    { $set: { "Kelas.$[elem].tahun_ajaran": "2018/2019" } },
    { multi: true, arrayFilters: [{ "elem.tahun_ajaran": "2018" }] }, function (error, result) {
      if (error) {
        return res.json({ success: false, data: error })
      } else {
        return res.json({ success: true, data: result })
      }
    })
}

exports.monitoringPengguna = async function (req, res) {
  var nama_sekolah = req.body.sekolah
  var kelas = req.body.kelas
  var jamAwal = new Date(req.body.jam_awal)
  let startTime = new Date(jamAwal.getFullYear(), jamAwal.getMonth(), jamAwal.getDate() + 1);
  var tahun = req.body.tahun
  startTime.setUTCHours(0, 0, 0, 0)
  var resultArray = []
  console.log(startTime)
  Pengguna.aggregate([
    {
      $match: {
        "sekolah": nama_sekolah,
        "Kelas.tahun_ajaran": tahun
      }
    },
    {
      $lookup: {
        "from": "absensi_rfid_db",
        "localField": "RFID.serial_number",
        "foreignField": "rfid",
        "as": "rfid_siswa"
      }
    },
    {
      $project: {
        Absensi_rfid: {
          $filter: {
            input: "$rfid_siswa",
            as: "itemRFID",
            cond: {
              $and: [
                { $gte: ["$$itemRFID.created_at", new Date(startTime)] },
                { $lte: ["$$itemRFID.created_at", new Date(startTime.getTime() + 86399999)] }
              ]
            }
          }
        },
        "profil": 1,
        "Kelas": 1,
        "RFID": 1
      }
    }
  ])
    .exec(function (err, result) {
      if (err) {
        return res.json({ success: false, data: err })
      } else {
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            var d = result[i].Absensi_rfid
            if (typeof (d[0]) === 'undefined') {
              for (let x = 0; x < result[i].Kelas.length; x++) {
                const KelasArray = result[i].Kelas[x];

                if (KelasArray.tahun_ajaran === tahun) {
                  resultTidakHadir = {
                    nama_lengkap: result[i].profil.nama_lengkap,
                    kelas: KelasArray.nama_kelas,
                    rfid: result[i].RFID.serial_number,
                    created_at: "Belum Melakukan Absensi"
                  }
                  resultArray.push(resultTidakHadir)
                }
              }
            }
          }
        }
        return res.json({ success: true, data: resultArray })
      }
    })
}

exports.dataHarianPengguna = async function (req, res) {
  var nama_sekolah = req.body.sekolah
  var kelas = req.body.kelas
  var jamAwal = new Date(req.body.jam_awal)
  let startTime = new Date(jamAwal.getFullYear(), jamAwal.getMonth(), jamAwal.getDate() + 1);
  var tahun = req.body.tahun
  startTime.setUTCHours(0, 0, 0, 0)
  var resultArray = []

  Pengguna.aggregate([
    {
      $match: {
        "sekolah": nama_sekolah,
        "Kelas.tahun_ajaran": tahun
      }
    },
    {
      $lookup: {
        "from": "absensi_rfid_db",
        "localField": "RFID.serial_number",
        "foreignField": "rfid",
        "as": "rfid_siswa"
      }
    },
    {
      $project: {
        Absensi_rfid: {
          $filter: {
            input: "$rfid_siswa",
            as: "itemRFID",
            cond: {
              $and: [
                { $gte: ["$$itemRFID.created_at", new Date(startTime)] },
                { $lte: ["$$itemRFID.created_at", new Date(startTime.getTime() + 86399999)] }
              ]
            }
          }
        },
        "profil": 1,
        "Kelas": 1
      }
    }
  ])
    .exec(function (err, result) {
      if (err) {
        return res.json({ success: false, data: err })
      } else {
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            var d = result[i].Absensi_rfid
            if (typeof (d[0]) === 'undefined') {
              for (let x = 0; x < result[i].Kelas.length; x++) {
                const KelasArray = result[i].Kelas[x];
                if (KelasArray.tahun_ajaran == tahun) {
                  resultTidakHadir = {
                    nama_lengkap: result[i].profil.nama_lengkap,
                    kelas: KelasArray.nama_kelas,
                    created_at: "Belum Melakukan Absensi"
                  }
                  resultArray.push(resultTidakHadir)
                }
              }
            } else {
              for (let x = 0; x < result[i].Kelas.length; x++) {
                const KelasArray = result[i].Kelas[x];
                if (KelasArray.tahun_ajaran == tahun) {
                  resultTidakHadir = {
                    nama_lengkap: result[i].profil.nama_lengkap,
                    kelas: KelasArray.nama_kelas,
                    created_at: moment(result[i].Absensi_rfid[0].created_at).format('MMMM Do, h:mm:ss')
                  }
                  resultArray.push(resultTidakHadir)
                }
              }
            }
          }
        }
        return res.json({ success: true, data: resultArray })
      }
    })
}
exports.login = async function (req, res) {
  var email = req.body.email
  var pass = req.body.pass
  var passwordMD5 = md5(pass + salt)
  Pengguna.findOne({ "email": email }).exec(function (err, result) {
    if (err) {
      return res.json({ success: false, data: err })
    } else {
      if (result != null) {
        if (result.email === email) {
          if (result.sandi === passwordMD5) {
            sekolah_Dev.findOne({ "NAMA_SEKOLAH": result.sekolah }).exec(function (err, resultTwo) {
              try {
                if (resultTwo === null) {
                  return res.json({ success: false, data: "result sekolah tidak ada" })
                } else {
                  var dataKeluaran = {
                    username: result.profil.username,
                    sekolah: result.sekolah,
                    _id: result._id,
                    mac_address: resultTwo.Mesin
                  }
                  return res.json({ success: true, data: dataKeluaran })
                }
              } catch (error) {
                return res.json({ success: false, data: "result sekolah tidak ada, terjadi error " + error })
              }
            })
          } else {
            return res.json({ success: false, data: "Sandi Anda Salah" })
          }
        } else {
          return res.json({ success: false, data: "User Tidak Di Temukan" })
        }
      } else {
        return res.json({ success: false, data: "Email Tidak Di Temukan" })
      }
    }
  })
}
exports.tampilPenggunaPerkelas = async function (req, res) {
  var sekolah = req.body.sekolah
  var kelas = req.body.kelas

  Pengguna.find({ "Kelas": kelas, "sekolah": sekolah }).exec(function (err, result) {
    if (err) {

      console.log(err)
      return res.json({ success: false, data: err })
    } else {
      console.log(result)
      return res.json({ success: true, data: result })
    }
  })
}
exports.statusMonitoringPengguna = async function (req, res) {
  var tahun = "_" + req.body.tahun
  var bulan = req.body.bulan
  var tanggal = "_" + req.body.tanggal
  var status = req.body.status

  var data = `{"RFID.rekap_rfid.${tahun}.${bulan}.${tanggal}.Status_kehadiran": "${status}"}`
  Pengguna.find(JSON.parse(data)).exec(function (err, result) {
    if (err) {
      return res.json({ success: false, data: err })
    } else {
      return res.json({ success: true, data: result.length })
    }
  })
}

exports.statusBulananPengguna = async function (req, res) {
  var tahun = "_" + req.body.tahun
  var bulan = req.body.bulan
  var status = req.body.status
  var arrayTotalBulanan = []

  var DateBulanTahun = new Date()
  var dataBulanIni = DateBulanTahun.getMonth()
  var dataTahunIni = DateBulanTahun.getFullYear()
  console.log(dataBulanIni + dataTahunIni)
  var dataTest = getDayInMonth(4, 2019)
  for (let i = 0; i <= dataTest; i++) {
    const hari = i;
    var data = `{"RFID.rekap_rfid.${tahun}.${bulan}._${hari}.Status_kehadiran": "${status}"}`
    Pengguna.find(JSON.parse(data)).exec(function (err, result) {
      if (err) {
        return res.json({ success: false, data: err })
      } else {
        if (result.length > 0) {
          console.log(result.length)
          arrayTotalBulanan.push(result.length)
          console.log(arrayTotalBulanan)
        }
      }
    })
  }
  setTimeout(() => {
    return res.json({ success: true, data: arrayTotalBulanan.reduce(getSum) })
  }, 1000)
}

function operateFile(path, message) {
  Pengguna.find({ sekolah: message.sekolah, peran: 'Murid' }, { profil: true, sekolah: true, Kelas: true, RFID: true, _id: false }).lean().exec((err, result) => {
    fs.writeFileSync(path + message.sekolah + '_siswa.json', JSON.stringify(result))
  })
}

function getSum(total, num) {
  return total + num;
}

var getDayInMonth = function (month, year) {
  return new Date(year, month, 0).getDate()
}