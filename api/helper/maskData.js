"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

/**
 * Use this method when request params contains any fields which should not exposed .
 * @param message
 * @returns {{status: number, error: number, message: *}}
 */
function maskReqData(params) {
    let result = [];
    let keys = [];
    let data = {};
    if (params.length > 0) {
        params.forEach((res) => {
            keys.push(Object.keys(res));
            data = {};
            for (var i = 0; i < keys.length; i++) {
                data[keys[i]] = '*******';
            }
            result.push(data);
        });
        return result;
    }
    keys = Object.keys(params);
    data = {};
    for (var i = 0; i < keys.length; i++) {
        data[keys[i]] = '*******';
    }
    // console.log(e);
    return data;
}

exports.maskReqData = maskReqData;
