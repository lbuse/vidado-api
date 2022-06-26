'use strict'

class Validators {
    static isValidDate(date) {
        if(date !== null && date !== undefined) {
            try {
                date = new Date(date)
                return date instanceof Date && !isNaN(date.getTime())
            } catch(e) {
                return false
            }
        } else {
            return false
        }
    }

    static isValidDateRange(dataInicial, dataFinal) {
        return Validators.isValidDate(dataInicial) && Validators.isValidDate(dataFinal) && dataInicial <= dataFinal
    }

    static isValidaArray(array) {
        return array !== null && array !== undefined && array.length > 0
    }

    static isInteger(value) {
        return value !== null && value !== undefined && value % 1 === 0
    }

    static isIntegerArray(array) {
        if (Validators.isValidaArray(array)) {
            for (let i = 0; i < array.length; i++) {
                if (!Validators.isInteger(array[i])) {
                    return false
                }
            }
            return true
        } else {
            return false
        }
    }
}

export default Validators