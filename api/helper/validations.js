'use strict';
Object.defineProperty(exports, "__esModule", {value: true});

/**
 * Takes a field as input and returns a sanitized value, if the input field is object it takes the value of the object.
 * if the field is undefined or the value of the object is undefined it sets the value to 'novalue'.
 * This works in conjunction with hasValue() to check if there is a value on any field.
 * If there is a value then it is sanitized so that SQL injection or some such attacks can be prevented.
 *
 * TODO: Need to confirm if the regular expression below would be sufficient to thwart SQL Injection.
 * @param field
 * @returns {*}
 */
function sanitizeField(field) {
    var result;
    if ((field || 'novalue') !== 'novalue') {
        result = field;
        while (typeof result == 'object')
            result = result.value || 'novalue';
    }
    else
        result = 'novalue';
    if (typeof result === 'string') {
        result = result.replace(/[^\x20-\x7E]+/g, '');
    }
    return result;
}

exports.sanitizeField = sanitizeField;

/**
 * Always uses this method to check if a field has value. Main issues is if we refer to an object/field that is
 * undefined it is possible to crash sailsjs. These scripts take enough precautions and always return a value
 * hence we can avoid this situation.
 * @param field
 * @returns {boolean}
 */
function hasValue(field) {
    var result = field || 'novalue';
    if (typeof result === 'string') {
        if (result === 'novalue' || result.length == 0)
            return false;
    }
    else if (typeof result === 'object') {
        // return false for empty object
        if (Object.keys(result).length === 0)
            return false;
    }
    else if (Array.isArray(result)) {
        if (result.length == 0)
            return false;
    }
    return true;
}

exports.hasValue = hasValue;
