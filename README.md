# Node Worker Template

Repository ini berguna untuk mengambil base-template untuk worker menggunakan Node.JS

## Apa isinya?

- amqplib ^0.5.3
- dotenv ^7.0.0
- mongodb ^3.2.3
- mongoose ^5.5.1

## Penjelasan

Repository ini dasarnya menggunakan RabbitMQ dengan utamanya protokol AMQP sebagai message brokernya. Lalu dilanjutkan MongoDB sebagai penyimpanan data.

## Penggunaan

Ada dua library MongoDB yang tersedia. Ini untuk menangani dua kasus yang berbeda. Author menggunakan library mongoose untuk menangani kasus data yang struktural dan statis, mongodb untuk menangani kasus data yang dinamis. Kenapa? Karena mongoose pada dasarnya adalah ORM (object relational mapping) jadi untuk per-collection perlu pendefinisian model.

### mongodb
File-file yang perlu diperhatikan jika ingin menggunakan library mongodb adalah `.env`, `./config.js`, `./services/database.js`, dan `./models/mongodb`. Pada `./config.js` berisi broker URL untuk MongoDB yang akan digunakan pada `./database/connection.js`. `./database/connection.js` digunakkan sebagai method untuk koneksi ke database setiap pemanggilan method.

### mongoose
Perbedaan antara mongodb dan mongoose dalam file yang digunakan adalah `./database/connection.js` dan `./models/mongoose.js`.  Selebihnya sama.