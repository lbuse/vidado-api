'use strict'

import { validationResult } from 'express-validator'

const _namePattern = RegExp(/^[^-\s][\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$([a-zA-Z0-9-_\s]*){1,256}$/)
const _emailPattern = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
const _passwordPattern = RegExp(/^([\w\W]{6,50})$/)
const _hostnamePattern = RegExp(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/)

class Validators {
  static get namePattern() { return _namePattern }

  static get passwordPattern() { return _passwordPattern }

  static isNameValid = name => _namePattern.test(name)

  static isValidEmail = email => _emailPattern.test(email)

  static isValidPassword = password => _passwordPattern.test(password)

  static isValidHostname = hostname => _hostnamePattern.test(hostname)

  // Checa se string está vazia, nula ou indefinida
  static isEmpty = str => (!str || 0 === str.length)

  // Checa se string está em branco, nula ou indefinida
  static isBlank = str => (!str || /^\s*$/.test(str))

  static isValidDate(date) {
    if (date !== null && date !== undefined) {
      try {
        date = new Date(date)
        return date instanceof Date && !isNaN(date.getTime())
      } catch (e) {
        return false
      }
    } else {
      return false
    }
  }

  static isValidDateRange(dataInicial, dataFinal) {
    return Validators.isValidDate(dataInicial) && Validators.isValidDate(dataFinal) && dataInicial <= dataFinal
  }

  static isValidaArray(array) {
    return array !== null && array !== undefined && array.length > 0
  }

  static isInteger(value) {
    return value !== null && value !== undefined && value % 1 === 0
  }

  static isIntegerArray(array) {
    if (Validators.isValidaArray(array)) {
      for (let i = 0; i < array.length; i++) {
        if (!Validators.isInteger(array[i])) {
          return false
        }
      }
      return true
    } else {
      return false
    }
  }

  /**
   * Retorna erro formatado do Express-validator
   */
  static haltOnValidationErrors = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array()[0] })
      return true
    }
  }
}

export default Validators
