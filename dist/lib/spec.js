/**
 * https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#dataTypeFormat
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var types = {
  integer: {
    type: 'integer',
    format: 'int32'
  },
  float: {
    type: 'number',
    format: 'float'
  },
  double: {
    type: 'number',
    format: 'double'
  },
  string: {
    type: 'string',
    format: 'string'
  },
  binary: {
    type: 'string',
    format: 'binary'
  },
  boolean: {
    type: 'boolean'
  },
  date: {
    type: 'string',
    format: 'date'
  },
  datetime: {
    type: 'string',
    format: 'date-time'
  }
};

var typeMap = {
  text: 'string',
  json: 'string'
};

var Spec = {
  getPropertyType: function getPropertyType(wltype) {
    return types[typeMap[wltype] || wltype];
  }
};

exports['default'] = Spec;
module.exports = exports['default'];