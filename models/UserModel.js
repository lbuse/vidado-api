'use strict'

class UserModel {
  constructor(id, name, email, password, dominio, ativo) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.dominio = dominio
    this.ativo = ativo
  }
}

export default UserModel
