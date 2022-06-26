'use strict'

class ErrorModel {
    constructor(message, { code, params, stackTrace }) {
        this.code = code
        this.message = message
        this.params = params
        this.stackTrace = stackTrace
    }
}

export default ErrorModel