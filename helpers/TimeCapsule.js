'use strict'
import moment from 'moment-timezone'

/**
 * Responsável por fornecer data e horário no
 * fuso do Brasil/Brasilia
 */
class TimeCapsule {
  static dbfIsoFormat = 'YYYY-MM-DDTHH:mm:ss'
  static brFormat = 'DD/MM/YYYY HH:mm:ss'

  constructor(timezone) {
    moment.tz.setDefault(timezone || 'America/Sao_Paulo')
    this.currentMoment = moment()
  }

  getMoment() {
    return this.currentMoment
  }

  add(unit, duration) {
    this.currentMoment.add(unit, duration)
    return this
  }

  subtract(unit, duration) {
    this.currentMoment.subtract(unit, duration)
    return this
  }

  format(format) {
    return this.currentMoment.format(format)
  }

  static isStringDateValid = (date, format) =>
    moment(date, format, true).isValid()

}

export default TimeCapsule
