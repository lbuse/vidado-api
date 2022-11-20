'use strict'

import DatabaseHelper from '../helpers/DatabaseHelper'
import UserModel from '../models/UserModel'
import RecoveryCodeModel from '../models/RecoveryCodeModel'
import debug from 'debug'

class UserDao {
  /**
   * @param {DatabaseHelper} databaseHelper Conexão com o banco de dados
   */
  constructor(databaseHelper) {
    this.databaseHelper = databaseHelper
  }

  /**
   * Retorna informações do usuário especificado
   * @param {string} email Email do usuário que deve ser retornado
   * @returns {Promise<UserModel|null>} Retorna um usuário ou nulo
   */
  async findOne(email) {
    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      `SELECT
        id,
        nome,
        email,
        senha,
        dominio,
        ativo
      FROM Usuario
      WHERE UPPER(email) = UPPER(?)
      LIMIT 1 `,
      [email]
    )
      .then(rows => {
        let user = null
        for (const row of rows) {
          user = new UserModel(
            row.id,
            row.nome,
            row.email,
            row.senha,
            row.dominio,
            row.ativo === 1
          )
        }
        return user
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Retorna informações do usuário especificado
   * @param {number} id Código do usuário
   * @returns {Promise<UserModel|null>} Retorna um usuário ou nulo
   */
  async findById(id) {
    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      `SELECT
        id,
        nome,
        email,
        senha,
        dominio,
        ativo
      FROM Usuario
      WHERE id = ?
      LIMIT 1 `,
      id
    )
      .then(rows => {
        let user = null
        for (const row of rows) {
          user = new UserModel(
            row.id,
            row.nome,
            row.email,
            row.senha,
            row.dominio,
            row.ativo === 1
          )
        }
        return user
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Cadastra um novo usuário.
   * @param {string} name Nome do usuário
   * @param {string} email Email do usuário
   * @param {string} password Senha do usuário
   * @param {string} domain Domínio da empresa a qual o usuário pertence
   * @returns {Promise<number>} Retorna id de inserção ou 0 em caso de falha
   */
  async insertOne(name, email, password, domain) {
    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      'INSERT INTO Usuario (nome, email, senha, dominio, ativo) VALUES(?, ?, ?, ?, 1)',
      [name, email, password, domain]
    )
      .then(result => {
        if (result.affectedRows > 0) {
          return result.insertId
        } else {
          return 0
        }
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Atualiza dados de um usuário.
   * @param {number} id Código do usuário
   * @param {string} name Nome do usuário
   * @param {string} email Email do usuário
   * @returns {Promise<number>} Retorna nº de linhas afetadas
   */
   async updateOne(id, name, email) {
    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      'UPDATE Usuario SET nome = ?, email = ? WHERE id = ?',
      [name, email, id]
    )
      .then(result => result.affectedRows)
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Atualiza a senha do usuário
   * @param {string} id Código do usuário
   * @param {string} newPassword Nova senha do usuário
   * @returns {Promise<number>} Retorna o numero de linhas afetadas
   */
   async updatePasswordById(id, newPassword) {
    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      'UPDATE Usuario SET senha = ? WHERE id = ?',
      [newPassword, id]
    )
      .then(async result => result.affectedRows)
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Atualiza a senha do usuário
   * @param {string} email Email do usuário
   * @param {string} newPassword Nova senha do usuário
   * @returns {Promise<number>} Retorna o numero de linhas afetadas
   */
  async updatePasswordByEmail(email, newPassword) {
    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      'UPDATE Usuario SET senha = ? WHERE UPPER(email) = UPPER(?)',
      [newPassword, email]
    )
      .then(async result => {
        try {
          await conn.query(
            `DELETE rs.* FROM Recuperacao_senha AS rs
                INNER JOIN Usuario AS u
                    ON rs.id_usuario = u.id
              WHERE UPPER(u.email) = UPPER(?)`,
            email
          )
        } catch (err) {
          debug(err)
        }
        return result.affectedRows
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Salva código de recuperação no usuário que a solicitou
   * @param {number} userId Id do usuário que solicitou a recuperação da senha
   * @param {integer} code Código para validar a redefinição da senha
   * @param {Date} expireDate Data em que o código irá expirar
   * @returns {Promise<number>} Retorna o numero de linhas afetadas
   */
  async createRecoveryCode(userId, code, expireDate) {
    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      `DELETE FROM Recuperacao_senha WHERE id_usuario = ${userId}`
    )
      .then((_) => {
        return conn.query(
          `INSERT INTO Recuperacao_senha VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE codigo = ?, expiracao = ?`,
          [userId, code, expireDate, code, expireDate]
        )
          .then(result => result.affectedRows)
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }

  /**
   * Verifica se usuário possui o código de recuperação informado.
   * @param {string} userId ID do usuário
   * @param {integer} code Código de recuperação da senha
   * @returns {Promise<RecoveryCodeModel|null>} Retorna o código de recuperação ou nulo
   */
  async checkRecoveryCode(userId, code) {
    let conn = await this.databaseHelper.getConnection()
    return conn.query(
      `SELECT
        rs.id_usuario,
        rs.codigo,
        rs.expiracao
      FROM Recuperacao_senha AS rs
        INNER JOIN Usuario AS u
          ON u.id = rs.id_usuario
      WHERE UPPER(u.email) = UPPER(?)
        AND rs.codigo = ?
      LIMIT 1`,
      [userId, code]
    )
      .then(rows => {
        let recoveryCode = null
        for (const row of rows) {
          recoveryCode = new RecoveryCodeModel(
            row.id_usuario,
            row.codigo,
            row.expiracao
          )
        }
        return recoveryCode
      })
      .finally(() => {
        if (conn) conn.release()
      })
  }
}

export default UserDao
