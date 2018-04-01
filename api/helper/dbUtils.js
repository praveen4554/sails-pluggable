"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var Validations = require('./Validations');

/**
 * Returns a query clause that can be passed on to find/delete method, incorporate hardcoded tenant for now.
 * @param fields
 * @returns {{where}|{}}
 */
function queryClause(fields) {
    return queryClauseTenant(fields, false);
}

exports.queryClause = queryClause;

function queryClauseTenant(fields, retrieveAll) {
    var i = 0;
    var clause = {};
    console.log(fields);
    for (i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (Validations.hasValue(field.value)) {
            clause[field.name] = field.value;
        }
    }
    clause["tenant"] = 'ddn';
    return {where: clause};
}

exports.queryClauseTenant = queryClauseTenant;

/**
 * Returns a update clause that can be passed on to update method, incorporate hardcoded tenant for now.
 */
function updateClause(fields) {
    var i = 0;
    var clause = {};
    for (i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (Validations.hasValue(field.value)) {
            clause[field.name] = field.value;
        }
    }
    return clause;
}
