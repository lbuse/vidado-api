'use strict'

class UserModel {
  constructor(id, name, email, password, domain, active) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.domain = domain
    this.active = active
  }
}

export default UserModel
