"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

/**
 * Use this method when request params are not sufficient to service the request
 * Typically validations that are performed in our logic should use this method.
 * @param message
 * @returns {{status: number, error: number, message: *}}
 */
function badRequest(message) {
    return {'status': 400, 'error': 400, 'message': message};
}

exports.badRequest = badRequest;

/**
 * Use this method when error is received from sails components such a DB calls.
 * @param error
 * @returns {*}
 */
function internalError(error) {
    if (error.invalidAttributes) {
        return {'status': 400, 'error': 400, 'message': 'Validation Error', details: error.Errors};
    }
    return {'status': 500, 'error': 500, 'message': 'Internal server error ', details: error.details};
}

exports.internalError = internalError;
