"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

function validateReqParams(req, params) {
    return req.validator(params);
}

exports.validateReqParams = validateReqParams;

function isContains(jsonObj, key, value) {
    var result = -1;
    jsonObj.forEach(function (data, index) {
        if (data[key] === value)
            result = index;
    });
    return result;
}

exports.isContains = isContains;
