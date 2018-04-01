"use strict";
exports.__esModule = true;
var Rxjs = require("rxjs");
var sails = require("sails");
function getAll(modelName) {
    return Rxjs.Observable.fromPromise(sails.models[modelName].find());
}
exports.getAll = getAll;
function getOne(modelName, obj) {
    return Rxjs.Observable.fromPromise(sails.models[modelName].find(obj))
        .mergeMap(function (data) { return responseValidation(data); });
}
exports.getOne = getOne;
function getOneWithPopulate(modelName, populateName, obj) {
    return Rxjs.Observable.fromPromise(sails.models[modelName].find(obj).populate(populateName))
        .mergeMap(function (data) { return responseValidation(data); });
}
exports.getOneWithPopulate = getOneWithPopulate;
function create(modelName, obj) {
    return Rxjs.Observable.fromPromise(sails.models[modelName].create(obj));
}
exports.create = create;
function update(modelName, obj, reqBody) {
    return Rxjs.Observable.fromPromise(sails.models[modelName].update(obj, reqBody))
        .mergeMap(function (data) { return responseValidation(data); });
}
exports.update = update;
function destroy(modelName, obj) {
    return Rxjs.Observable.fromPromise(sails.models[modelName].destroy(obj))
        .mergeMap(function (data) { return responseValidation(data); });
}
exports.destroy = destroy;
function responseValidation(res) {
    if (res['length'] > 0) {
        return Rxjs.Observable.from(res);
    }
    else {
        return Rxjs.Observable["throw"]('No Data Found From The Given Object');
    }
}
