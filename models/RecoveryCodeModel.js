'use strict'

class RecoveryCodeModel {
  constructor(userId, code, expires) {
    this.userId = userId
    this.code = code
    this.expires = expires
  }
}

export default RecoveryCodeModel
