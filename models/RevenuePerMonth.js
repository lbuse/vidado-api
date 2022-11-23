'use strict'

class RevenuePerMonth {
  constructor(
    storeId,
    storeName,
    quantityOfSales,
    totalRevenue,
    quantityOfClients,
    averageTicket,
    dateOfLastSellOfTheMonth,
    month,
    year
  ) {
    this.storeId = storeId
    this.storeName = storeName
    this.quantityOfSales = quantityOfSales
    this.totalRevenue = totalRevenue
    this.quantityOfClients = quantityOfClients
    this.averageTicket = averageTicket
    this.dateOfLastSellOfTheMonth = dateOfLastSellOfTheMonth
    this.month = month
    this.year = year
  }
}

export default RevenuePerMonth
