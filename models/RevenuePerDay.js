'use strict'

class RevenuePerDay {
  constructor(
    storeId,
    storeName,
    quantityOfSales,
    totalRevenue,
    quantityOfClients,
    averageTicket,
    date
  ) {
    this.storeId = storeId
    this.storeName = storeName
    this.quantityOfSales = quantityOfSales
    this.totalRevenue = totalRevenue
    this.quantityOfClients = quantityOfClients
    this.averageTicket = averageTicket
    this.date = date
  }
}

export default RevenuePerDay
