'use strict'
import fs from 'fs'
import mustache from 'mustache'
import nodemailer from 'nodemailer'
import path from 'path'
import Validators from './Validators'
// TODO: Resolver problema de autenticação com o provedor de email AOL
class Email {
  constructor(host, port, secure, user, password) {
    this.host = host || process.env.EMAIL_SMTP
    if (!this.host || !Validators.isValidHostname(this.host))
      throw new Error('[host] must be a valid domain')

    this.port = port || parseInt(process.env.EMAIL_PORT)
    if (!this.port || !Number.isInteger(this.port) || this.port <= 0)
      throw new Error('[port] must be a positive Integer')

    this.secure = secure || process.env.EMAIL_SECURE.toLowerCase() === 'true'
    if (typeof this.secure !== 'boolean')
      throw new Error('[secure] must be a boolean')

    this.user = user || process.env.EMAIL_USER_FROM
    if (!this.user || !Validators.isValidEmail(this.user))
      throw new Error('[user] must be a valid email')

    this.password = password || process.env.EMAIL_PASSWORD

    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.secure, // true for 465, false for other ports
      auth: {
        user: this.user,
        pass: this.password
      }
    })
  }

  /**
   * Envia erro capturado para o email dos responsáveis pela API.
   *
   * @param {string} error Stack do erro capturado
   *
   * @returns Retorna uma `Promise` com o sucesso ou falha do envio
   */
  async sendError(error) {
    if (process.env.EMAIL_ERROR_ENABLED.toLowerCase() === 'false')
      return 'Envio de erro por email está desabilitado'

    return await this.transporter.sendMail({
      from: `"Error Report 👻" <${this.user}>`,
      to: this.user,
      subject: "💥 Falha na API do Sultão 💥",
      html: `<h1>${error.message}</h1>
            <h2>${error.status}</h2>
            <pre>${error.stack}</pre>`
    })
  }

  /**
   * Envia o código de redefinição de senha para o email do usuário.
   *
   * @param {integer} code Código validador de redefinição de senha
   * @param {string} name Nome do usuário que solicitou a redefinição
   * @param {string} to Destinatário que receberá o código de redefinição
   *
   * @returns Retorna uma `Promise` com o sucesso ou falha do envio
   */
  async sendRecoveryCode({ code, name, to }) {
    let emailHtml = fs.readFileSync(
      path.join(__dirname, '../views') + '/password_reset.html',
      'utf8'
    )

    return await this.transporter.sendMail({
      from: `"Vidado - Não responda" <${this.user}>`,
      to: to,
      subject: "Recuperação de senha",
      html: mustache.render(emailHtml, { code, name })
    })
  }
}

export default Email
