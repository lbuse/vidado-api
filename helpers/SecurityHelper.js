'use strict'
import bcrypt from 'bcryptjs'
import { checkSchema } from 'express-validator'
import jwt from 'jsonwebtoken'
import Validators from './Validators'
import createError from 'http-errors'

export class TokenHelper {
  /**
   * Executa validações dos campos especificados
   */
  static validate() {
    return checkSchema({
      authorization: {
        in: ['headers', 'body'],
        trim: true,
        customSanitizer: {
          options: (value, { location }) => {
            return location === 'headers' && value && value.startsWith('Bearer ')
              ? value.split(' ')[1]
              : value
          }
        },
        isJWT: true,
        errorMessage: 'Token não informado ou inválido'
      }
    })
  }

  /**
   * Checa Token na rota para liberar ou não o acesso ao
   * método
   */
  static check(req, res, next) {
    if (Validators.haltOnValidationErrors(req, res)) { return }

    let _token = req.headers.authorization

    // Remove Bearer from string
    if (_token && _token.startsWith('Bearer ')) {
      _token = _token.split(' ')[1]
    }

    jwt.verify(_token, req.app.locals.tokenPrivateKey,
      (err, decoded) => {
        if (err) {
          res.status(401).json({
            message: 'Token inválido'
          })
        } else {
          req.decoded = decoded
          next()
        }
      })
  }

  /**
   * Cria um novo token com informações do usuário que
   * executou o login com sucesso
   *  @param {number} id ID do usuário
   * @param {string} name Nome do usuário
   * @param {string} email Email do usuário
   * @param {integer} domain Domínio identificador da empresa a que o usuário pertence
   * @param {string} tokenPrivateKey Chave privada de geração do token (opcional)
   *
   * @retutns Retorna o token gerado
   */
  static createJWT({ id, name, email, domain, tokenPrivateKey }) {
    return jwt.sign(
      {
        id: id,
        name: name,
        email: email,
        domain: domain
      },
      tokenPrivateKey || process.env.API_TOKEN_PRIVATE_KEY,
      {
        expiresIn: '30d'
      }
    )
  }
}

export class PasswordHelper {
  /**
   * Criptografa senha com bcrypt
   *
   * @param {string} password Senha que será criptografada
   * @returns Retorna senha criptografada
   */
  static createHash(password) {
    return bcrypt.hash(
      password,
      parseInt(process.env.API_PASSWORD_HASH_SALT_ROUNDS)
    )
  }

  /**
   * Verifica se [password] é igual ao obtido no banco de dados
   *
   * @param {string} password Senha preenchida pelo usuário
   * @param {string} passwordHashed Senha criptografada armazenada no banco de dados
   *
   * @returns Retorna verdadeiro quando são iguais
   */
  static isPasswordCorrect(password, passwordHashed) {
    return bcrypt.compare(password, passwordHashed)
  }
}
