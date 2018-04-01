"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var Validations = require('./Validations');

/**
 * Use changeKey to rename a key in an object while retaining the value in the object. This will facilitate refactoring
 * of the internal structures of the API Server / Can be used in UI as well, with our disturbing the external interface.
 * and vice/versa i.e refactoring API with disturbing the internal structures.
 * @param originalKey
 * @param newKey
 * @param obj
 * @returns {*}
 */
function changeKey(originalKey, newKey, obj) {
    if (Array.isArray(obj)) {
        var newArr = [];
        for (var i = 0; i < obj.length; i++) {
            var result = obj[i];
            result[newKey] = obj[i][originalKey];
            delete (result[originalKey]);
            newArr.push(result);
        }
        return newArr;
    }
    var o = obj;
    o[newKey] = obj[originalKey];
    delete (o[originalKey]);
    return o;
}

exports.changeKey = changeKey;

/**
 * Nested implementation of changeKey, than traverse any depth for originalKey or newKey
 * @param originalKey - is of format a.b.c meaning find a value c by navigating obj.a.b.c
 * @param newKey - is of format x.y where the c will not be palced at a location obj.x.y
 * TODO: Not implemented yet.
 * @param obj
 * @returns {*}
 */
function changeKeyNested(originalKey, newKey, obj) {
    if (Array.isArray(obj)) {
        var newArr = [];
        for (var i = 0; i < obj.length; i++) {
            var result = obj[i];
            result[newKey] = obj[i][originalKey];
            delete (result[originalKey]);
            newArr.push(result);
        }
        return newArr;
    }
    var o = obj;
    o[newKey] = obj[originalKey];
    delete (o[originalKey]);
    return o;
}

exports.changeKeyNested = changeKeyNested;

/**
 * Used to collect query params from Swagger. It takes a list of params with keys (name, required, alias)
 * For each param it checks in fromObj a field with given name, if value exists, sanitizes the value.
 * if value does not exist but is required it will set the valid flag for the field as false.
 * if atleastOneRequired is true, it sets the fromObj.valid=false if non of the params have values.
 * if alias is provided it also makes the value available from fromObj.alias
 *
 * This can be used to extract param values from Swagger, and rename the field names to match the internal
 * representation of the API server. Can be used in UI also to perform such transformation.
 * @param params
 * @param fromObj
 * @param atleastOneRequired
 * @returns sanitized, validated & aliased fromObj. It also proivedes details with any errors i.e required
 * fields not having values, a fieldNames collection and values collection of {name, value} pairs for convenience.
 */
function collectToObj(params, fromObj, atleastOneRequired) {
    var result = {};
    var fieldNames = [];
    var details = [];
    var atleastOneFieldHasValue = false;
    var values = [];
    result['valid'] = true;
    if (!Validations.hasValue(params) || !Validations.hasValue(fromObj) || !(typeof fromObj == 'object')
        || !Array.isArray(params) || params.length == 0) {
        result['valid'] = false;
        result['details'] = ["Cannot process params"];
        return result;
    }
    for (var i = 0; i < params.length; i++) {
        fieldNames.push(params[i].name);
        var value = Validations.sanitizeField(fromObj[params[i].name]);
        var param = {
            name: params[i].name, value: value, required: params[i].required,
            hasValue: Validations.hasValue(value), valid: !(params[i].required && !Validations.hasValue(value))
        };
        result[params[i].name] = param;
        if (params[i].alias)
            result[params[i].alias] = param;
        if (!param.valid) {
            result['valid'] = false;
            details.push("Value is required for field :" + params[i].name);
        }
        if (param.hasValue) {
            atleastOneFieldHasValue = true;
            if (params[i].alias) {
                values.push({name: params[i].alias, value: param.value});
            }
            else {
                values.push({name: params[i].name, value: param.value});
            }
        }
    }
    if (atleastOneRequired && !atleastOneFieldHasValue) {
        details.push("Atleast one of the following fields must have values " + fieldNames);
        result['valid'] = false;
    }
    result['details'] = details;
    result['values'] = values;
    console.log(result);
    return result;
}

exports.collectToObj = collectToObj;

/**
 * Nested object version of collectToObj. Used to sanitize, validate and alias the object recieved as
 * body of the Swagger request.
 */
function collectObjNested(params, input, atleastOneRequired) {
    var fromObj = JSON.parse(JSON.stringify(input));
    var details = [];
    var atleastOneFieldHasValue = false;
    fromObj.valid = true;
    var values = [];
    if (!Validations.hasValue(params) || !Validations.hasValue(fromObj) || !(typeof fromObj == 'object')
        || !Array.isArray(params) || params.length == 0) {
        var result = {};
        result['valid'] = false;
        result['details'] = ["Cannot process params"];
        return result;
    }
    params.forEach(function (param) {
        var originalKeys = param.name.split('.');
        var value = fromObj[originalKeys[0]];
        for (var i = 1; i < originalKeys.length; i++) {
            if (Validations.hasValue(value))
                value = value[originalKeys[i]];
        }
        if (!(typeof value == 'object')) {
            value = Validations.sanitizeField(value);
        }
        if (!Validations.hasValue(value)) {
            if (param.required) {
                details.push({
                    name: param.name,
                    alias: param.alias,
                    message: 'Value is required for field',
                    valid: false
                });
                fromObj.valid = false;
            }
        }
        else {
            if (atleastOneRequired) {
                atleastOneFieldHasValue = true;
            }
            if (Validations.hasValue(param.alias)) {
                var newKeys = param.alias.split('.');
                for (var j = 0; j < newKeys.length; j++) {
                    if (j === (newKeys.length - 1)) {
                        fromObj[newKeys[j]] = value;
                        values.push({name: newKeys[j], value: value});
                    }
                    else if (!Validations.hasValue(fromObj[newKeys[j]]))
                        fromObj[newKeys[j]] = {};
                }
            }
            else {
                values.push({name: originalKeys[originalKeys.length - 1], value: value});
            }
        }
    });
    if (atleastOneRequired && !atleastOneFieldHasValue) {
        var fields = '';
        params.forEach(function (param) {
            if (param.name)
                fields += ',' + param.name;
        });
        fields = fields.replace(/,/, '');
        details.push({name: fields, message: 'Atleast one of the following fields must have values', valid: false});
        fromObj.valid = false;
    }
    fromObj.details = details;
    fromObj.values = values;
    console.log(fromObj);
    return fromObj;
}
