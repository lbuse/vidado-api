'use strict'

class RevenuePerHourModel {
  constructor(
    storeId,
    storeName,
    quantityOfSales,
    totalRevenue,
    quantityOfClients,
    date
  ) {
    this.storeId = storeId
    this.storeName = storeName
    this.quantityOfSales = quantityOfSales
    this.totalRevenue = totalRevenue
    this.quantityOfClients = quantityOfClients
    this.date = date
  }
}

export default RevenuePerHourModel
