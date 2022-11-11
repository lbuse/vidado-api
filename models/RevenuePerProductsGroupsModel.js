'use strict'

class RevenuePerProductsGroupsModel {
  constructor(
    storeId,
    storeName,
    groupId,
    groupName,
    quantityOfSales,
    totalRevenue,
    percentagemOfRevenue
  ) {
    this.storeId = storeId
    this.storeName = storeName
    this.groupId = groupId
    this.groupName = groupName
    this.quantityOfSales = quantityOfSales
    this.totalRevenue = totalRevenue
    this.percentagemOfRevenue = percentagemOfRevenue
  }
}

export default RevenuePerProductsGroupsModel
