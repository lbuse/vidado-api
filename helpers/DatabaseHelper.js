'use strict'
import mariadb from 'mariadb'

class DatabaseHelper {
  constructor() {
    this.pool = mariadb.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_BASE
    })
  }

  async getConnection() {
    return await this.pool.getConnection()
  }
}

export default DatabaseHelper
