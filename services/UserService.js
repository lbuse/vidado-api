'use strict'

import { body } from 'express-validator'
import createError from 'http-errors'
import UserDao from '../dao/UserDao'
import Email from '../helpers/Email'
import { PasswordHelper, TokenHelper } from '../helpers/SecurityHelper'
import TimeCapsule from '../helpers/TimeCapsule'
import Validators from '../helpers/Validators'

class UserService {
  /**
   * @param {UserDao} dao Gerenciador da fonte de dados
   */
  constructor(dao) {
    this.dao = dao
  }

  static inputCommonValidators = {
    email: {
      post: body('email')
        .exists().withMessage('Email é obrigatório')
        .trim()
        .isEmail().withMessage('Email inválido')
    },
    password: {
      post: body('password')
        .exists().withMessage('[password] é obrigatório')
        .matches(Validators.passwordPattern).withMessage(
          '[password] deve conter entre 6 e 50 caracteres'
        )
    },
    newPassword: {
      post: body('new_password')
        .exists().withMessage('[new_password] é obrigatório')
        .matches(Validators.passwordPattern).withMessage(
          '[new_password] deve conter entre 6 e 50 caracteres'
        )
        .custom((value, { req, loc, path }) => {
          if (value !== req.body.confirm_password) {
            throw new Error('Senhas não são iguais')
          } else {
            return value
          }
        })
    }
  }

  static validate = (method) => {
    switch (method) {
      case 'signUp':
        return [
          body('name')
            .exists().withMessage('[name] é obrigatório')
            .trim()
            .matches(Validators.namePattern).withMessage(
              'name deve conter entre 1 e 255 caracteres'
            ),
          this.inputCommonValidators.email.post,
          this.inputCommonValidators.password.post
        ]
      case 'signIn':
        return [
          this.inputCommonValidators.email.post,
          this.inputCommonValidators.password.post
        ]
      case 'changePassword':
        return [
          this.inputCommonValidators.email.post,
          this.inputCommonValidators.password.post,
          this.inputCommonValidators.newPassword.post
        ]
      case 'createPasswordRecoveryCode':
        return [
          this.inputCommonValidators.email.post
        ]
      case 'resetPassword':
        return [
          this.inputCommonValidators.email.post,
          body('code')
            .exists().withMessage('Código de recuperação é obrigatório')
            .isInt({ min: 1000, max: 9999 }).withMessage(
              'Código inválido'
            )
            .toInt().withMessage('Código inválido'),
          this.inputCommonValidators.newPassword.post
        ]
    }
  }

  /**
   * Cadastra um novo usuário.
   */
  signUp = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const domain = req.body.domain

    try {
      const user = await this.dao.findOne(email)
      if (!user) {
        const id = await this.dao.insertOne(
          name,
          email,
          await PasswordHelper.createHash(password),
          domain
        )
        if (id > 0) {
          res.status(201).end()
        } else {
          throw new Error('Falha ao cadastrar novo usuário')
        }
      } else {
        res.status(409).json({
          code: 409,
          message: `Email ${email} já está cadastrado.`
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: 'Falha ao cadastrar novo usuário'
      })
    }
  }

  /**
   * Autentica o usuário.
   */
  signIn = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    const email = req.body.email
    const password = req.body.password

    this.dao.findOne(email)
      .then(async user => {
        if (user) {
          if (await PasswordHelper.isPasswordCorrect(password, user.password)) {
            const token = TokenHelper.createJWT({
              name: user.name,
              email: user.email,
              domain: user.dominio,
              tokenPrivateKey: req.app.locals.tokenPrivateKey
            })
            res.status(200).json({
              token: token,
              expires: new TimeCapsule()
                .add(30, 'days')
                .getMoment()
                .toISOString()
            })
          } else {
            res.status(401).json({
              message: 'Email ou senha inválidos.'
            })
          }
        } else {
          res.status(401).json({
            message: 'Email ou senha inválidos.'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          message: err.text
        })
      })
  }

  /**
   * Atualiza a senha do usuário.
   */
  changePassword = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    const email = req.body.email
    const password = req.body.password
    const newPassword = req.body.new_password

    this.dao.findOne(email)
      .then(async user => {
        if (user) {
          if (await PasswordHelper.isPasswordCorrect(password, user.password)) {
            this.dao.updatePassword(
              email,
              await PasswordHelper.createHash(newPassword)
            ).then(result => {
              if (result > 0) {
                res.status(204).end()
              } else {
                res.status(500).json({
                  message: 'Não foi possível atualizar a senha devido a um erro no servidor.'
                })
              }
            })
          } else {
            res.status(401).json({
              message: 'Senha atual incorreta'
            })
          }
        } else {
          res.status(404).json({
            message: 'Email não encontrado'
          })
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: err.text
        })
      })
  }

  /**
   * Gera o código de recuperação de senha e envia para o email cadastrado.
   */
  createPasswordRecoveryCode = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    let email = req.body.email

    this.dao.findOne(email)
      .then(user => {
        if (user) {
          const min = Math.ceil(1000)
          const max = Math.floor(9999)
          const recoveryCode = Math.floor(Math.random() * (max - min)) + min
          const expires = new TimeCapsule()
            .add(1, 'day')
            .format(TimeCapsule.dbfIsoFormat)

          this.dao.createRecoveryCode(user.id, recoveryCode, expires)
            .then(result => {
              if (result > 0) {
                new Email().sendRecoveryCode({
                  code: recoveryCode,
                  name: user.name,
                  to: user.email
                })
                  .then(_ => res.status(201).end())
                  .catch(err => {
                    console.log(err)
                    res.status(500).json({
                      message: 'Ocorreu uma falha ao enviar o email com o código de recuperação.'
                    })
                  })
              } else {
                throw new Error('Inserção do código de recuperação falhou.')
              }
            })
            .catch(err => {
              console.log(err)
              res.status(500).json({
                message: 'Ocorreu uma falha durante o processo de recuperação de senha.'
              })
            })
        } else {
          res.status(404).json('Email não foi encontrado')
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: 'Ocorreu uma falha ao iniciar o processo de recuperação de senha'
        })
      })
  }

  /**
   * Executa a atualização senha no processo de reset da senha.
   */
  resetPassword = async (req, res, next) => {
    if (Validators.haltOnValidationErrors(req, res))
      return

    const email = req.body.email
    const code = req.body.code
    const newPassword = req.body.new_password

    this.dao.checkRecoveryCode(
      email,
      code
    )
      .then(async recoveryCode => {
        if (recoveryCode) {
          const currentTime = new TimeCapsule().getMoment()
          if (currentTime.isBefore(recoveryCode.expires)) {
            const passwordHashed = await PasswordHelper.createHash(newPassword)

            this.dao.updatePassword(email, passwordHashed)
              .then(result => {
                if (result > 0) {
                  res.status(204).end()
                } else {
                  throw new Error('Falha ao atualizar a senha.')
                }
              })
              .catch(err => {
                console.log(err)
                res.status(500).json({
                  message: 'Ocorreu uma falha ao atualizar a senha.'
                })
              })
          } else {
            res.status(401).json({
              message: 'Código expirou'
            })
          }
        } else {
          res.status(401).json({
            message: 'Código inválido.'
          })
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          message: 'Ocorreu uma falha ao tentar verificar o código de recuperação.'
        })
      })
  }
}

export default UserService
