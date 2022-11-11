'use strict'

BigInt.prototype.toJSON = function() { return this.toString() }

class StoreScoreModel {
  constructor(storeId, storeName, salesCount, averageScore, standardDeviation) {
    this.storeId = storeId
    this.storeName = storeName
    this.salesCount = salesCount
    this.averageScore = averageScore
    this.standardDeviation = standardDeviation
  }
}

export default StoreScoreModel
