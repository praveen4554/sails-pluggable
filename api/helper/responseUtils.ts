/**
 * Use this method when request params are not sufficient to service the request
 * Typically validations that are performed in our logic should use this method.
 * @param message
 * @returns {{status: number, error: number, message: *}}
 */
export function badRequest(res, message) {
    return res.status(400).json({'error': 'FAILED', 'message': message});
}

export function unAuthorizedRequest(res, message) {
    return res.status(401).json({'error': 'FAILED', 'message': message});
}

export function forbiddenRequest(res, message) {
    return res.status(403).json({'error': 'FAILED', 'message': message});
}

export function internalServerError(res, message) {
    return res.status(500).json({'error': 'FAILED', 'message': message});
}

export function successResponse(res, message) {
    return res.status(200).json({'error': 'none', 'message': 'Success', data: message});
}

export function createResponse(res, message) {
    return res.status(201).json({'error': 'none', 'message': 'Success', data: message});
}

export function noDatefound(res) {
    return res.status(204).json();
}
