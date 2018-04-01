import Rxjs = require('rxjs');
import sails = require('sails');

export function getAll(modelName: string) {
    return Rxjs.Observable.fromPromise(sails.models[modelName].find());
}

export function getOne(modelName: string, obj: any) {
    return Rxjs.Observable.fromPromise(sails.models[modelName].find(obj))
        .mergeMap(data => responseValidation(data));
}


export function getOneWithPopulate(modelName: string, populateName: string, obj: any) {
    return Rxjs.Observable.fromPromise(sails.models[modelName].find(obj).populate(populateName))
        .mergeMap(data => responseValidation(data));
}

export function create(modelName: string, obj: any) {
    return Rxjs.Observable.fromPromise(sails.models[modelName].create(obj));
}

export function update(modelName: string, obj: any, reqBody: any) {
    return Rxjs.Observable.fromPromise(sails.models[modelName].update(obj, reqBody))
        .mergeMap(data => responseValidation(data));
}

export function destroy(modelName: string, obj: any) {
    return Rxjs.Observable.fromPromise(sails.models[modelName].destroy(obj))
        .mergeMap(data => responseValidation(data));
}

function responseValidation(res: any) {
    if (res['length'] > 0) {
        return Rxjs.Observable.from(res);
    } else {
        return Rxjs.Observable.throw('No Data Found From The Given Object');
    }
}