'use strict'

class StoreModel {
  constructor(
    id,
    headQuarterId,
    name,
    status,
    country,
    state,
    city,
    address
  ) {
    this.id = id
    this.headQuarterId = headQuarterId
    this.name = name
    this.status = status
    this.country = country
    this.state = state
    this.city = city
    this.address = address
  }
}

export default StoreModel
