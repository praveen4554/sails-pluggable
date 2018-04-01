'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _hoek = require('hoek');

var _hoek2 = _interopRequireDefault(_hoek);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _spec = require('./spec');

var _spec2 = _interopRequireDefault(_spec);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var methodMap = {
    post: 'Create Object(s)',
    get: 'Read Object(s)',
    put: 'Update Object(s)',
    patch: 'Update Object(s)',
    'delete': 'Destroy Object(s)',
    options: 'Get Resource Options',
    head: 'Get Resource headers'
};

function getBlueprintPrefixes() {
    // Add a "/" to a prefix if it's missing
    function formatPrefix(prefix) {
        return (prefix.indexOf('/') !== 0 ? '/' : '') + prefix;
    }

    var prefixes = [];
    // Check if blueprints hook is not removed
    if (sails.config.blueprints) {
        if (sails.config.blueprints.prefix) {
            // Case of blueprints prefix
            prefixes.push(formatPrefix(sails.config.blueprints.prefix));
            if (sails.config.blueprints.rest && sails.config.blueprints.restPrefix) {
                // Case of blueprints prefix + rest prefix
                prefixes.unshift(prefixes[0] + formatPrefix(sails.config.blueprints.restPrefix));
            }
        } else if (sails.config.blueprints.rest && sails.config.blueprints.restPrefix) {
            // Case of rest prefix
            prefixes.push(formatPrefix(sails.config.blueprints.restPrefix));
        }
    }
    return prefixes;
}

var Transformer = {

    getSwagger: function getSwagger(sails, pkg) {
        return {
            swagger: '2.0',
            info: Transformer.getInfo(pkg),
            host: sails.config.swagger.host,
            tags: Transformer.getTags(sails),
            definitions: Transformer.getDefinitions(sails),
            paths: Transformer.getPaths(sails)
        };
    },

    /**
     * Convert a package.json file into a Swagger Info Object
     * http://swagger.io/specification/#infoObject
     */
    getInfo: function getInfo(pkg) {
        return _hoek2['default'].transform(pkg, {
            'title': 'name',
            'description': 'description',
            'version': 'version',

            'contact.name': 'author',
            'contact.url': 'homepage',

            'license.name': 'license'
        });
    },

    /**
     * http://swagger.io/specification/#tagObject
     */
    getTags: function getTags(sails) {
        return _lodash2['default'].map(_lodash2['default'].pluck(sails.controllers, 'globalId'), function (tagName) {
            return {
                name: tagName
                //description: `${tagName} Controller`
            };
        });
    },

    /**
     * http://swagger.io/specification/#definitionsObject
     */
    getDefinitions: function getDefinitions(sails) {
        var definitions = _lodash2['default'].transform(sails.models, function (definitions, model, modelName) {
            definitions[model.identity] = {
                properties: Transformer.getDefinitionProperties(model.definition)
            };
        });

        delete definitions['undefined'];

        return definitions;
    },

    getDefinitionProperties: function getDefinitionProperties(definition) {

        return _lodash2['default'].mapValues(definition, function (def, attrName) {
            var property = _lodash2['default'].pick(def, ['type', 'description', 'format', 'model']);

            return property.model && sails.config.blueprints.populate ? { '$ref': Transformer.generateDefinitionReference(property.model) } : _spec2['default'].getPropertyType(property.type);
        });
    },

    /**
     * Convert the internal Sails route map into a Swagger Paths
     * Object
     * http://swagger.io/specification/#pathsObject
     * http://swagger.io/specification/#pathItemObject
     */
    getPaths: function getPaths(sails) {
        var routes = sails.router._privateRouter.routes;
        var pathGroups = _lodash2['default'].chain(routes).values().flatten().unique(function (route) {
            return route.path + route.method + JSON.stringify(route.keys);
        }).reject({ path: '/*' }).reject({ path: '/__getcookie' }).reject({ path: '/csrfToken' }).reject({ path: '/csrftoken' }).groupBy('path').value();

        pathGroups = _lodash2['default'].reduce(pathGroups, function (result, routes, path) {
            path = path.replace(/:(\w+)\??/g, '{$1}');
            if (result[path]) result[path] = _lodash2['default'].union(result[path], routes);else result[path] = routes;
            return result;
        }, []);

        var inferredPaths = _lodash2['default'].mapValues(pathGroups, function (pathGroup) {
            return Transformer.getPathItem(sails, pathGroup);
        }) || [];
        return _lodash2['default'].merge(inferredPaths, Transformer.getDefinitionsFromRouteConfig(sails));
    },

    /**
     * Convert the swagger routes defined in sails.config.routes to route map
     * Object
     * http://swagger.io/specification/#pathsObject
     * http://swagger.io/specification/#pathItemObject
     */
    getDefinitionsFromRouteConfig: function getDefinitionsFromRouteConfig(sails) {
        var routes = sails.config.routes,
            swaggerdefs = _lodash2['default'].pick(routes, function (routeConfig, route) {
            return _lodash2['default'].has(routeConfig, 'swagger');
        });

        var swaggerDefinitions = _lodash2['default'].chain(routes).pick(function (routeConfig, route) {
            return _lodash2['default'].has(routeConfig, 'swagger');
        }).mapValues(function (route, key) {
            var swaggerdef = route.swagger || {};
            swaggerdef.responses = _lodash2['default'].chain(swaggerdef.responses || {}).mapValues(function (response, responseCode) {
                if (response.schema || response.model) {
                    response.schema = response.schema || response.model;
                    if (typeof response.schema == 'string') {
                        response.schema = {
                            '$ref': '#/definitions/' + (response.schema || '').toLowerCase()
                        };
                    } else if (typeof response.schema == 'object') {
                        if ((response.schema.type || '').toLowerCase() == 'array') {
                            response.schema.items = response.schema.items || {
                                '$ref': '#/definitions/' + (response.schema.model || '').toLowerCase()
                            };
                            delete response.schema.model;
                        }
                    }
                }
                return response;
            }).value();
            swaggerdef.parameters = _lodash2['default'].chain(swaggerdef.parameters || []).map(function (parameter) {

                if (typeof parameter == 'string') {
                    return '#/definitions/' + (parameter || '').toLowerCase();
                } else {
                    parameter.schema = parameter.schema || null;
                    return parameter;
                }
            }).value();

            var methods = swaggerdef.methods || ['get'];
            delete swaggerdef.methods;
            var defs = {};
            _lodash2['default'].map(methods, function (method) {
                defs[(method || '').toLowerCase().trim()] = swaggerdef;
            });
            return defs;
        }).value();

        var swaggerPaths = {};
        for (var defRoute in swaggerDefinitions) {
            var sPath = (defRoute || '').toLowerCase().replace(/(get|post|put|option|delete)? ?/g, '');
            sPath = sPath.replace(/:(\w+)\??/g, '{$1}');
            swaggerPaths[sPath] = _lodash2['default'].merge(swaggerPaths[sPath] || {}, swaggerDefinitions[defRoute]);
        }

        return swaggerPaths || [];
    },

    getModelFromPath: function getModelFromPath(sails, path) {
        var _path$split = path.split('/');

        var _path$split2 = _slicedToArray(_path$split, 5);

        var $ = _path$split2[0];
        var parentModelName = _path$split2[1];
        var parentId = _path$split2[2];
        var childAttributeName = _path$split2[3];
        var childId = _path$split2[4];

        var parentModel = sails.models[parentModelName] || parentModelName ? sails.models[_pluralize2['default'].singular(parentModelName)] : undefined;
        var childAttribute = _lodash2['default'].get(parentModel, ['attributes', childAttributeName]);
        var childModelName = _lodash2['default'].get(childAttribute, 'collection') || _lodash2['default'].get(childAttribute, 'model');
        var childModel = sails.models[childModelName] || childModelName ? sails.models[_pluralize2['default'].singular(childModelName)] : undefined;

        return childModel || parentModel;
    },

    getModelIdentityFromPath: function getModelIdentityFromPath(sails, path) {
        var model = Transformer.getModelFromPath(sails, path);
        if (model) {
            return model.identity;
        }
    },

    /**
     * http://swagger.io/specification/#definitionsObject
     */
    getDefinitionReferenceFromPath: function getDefinitionReferenceFromPath(sails, path) {
        var model = Transformer.getModelFromPath(sails, path);
        if (model) {
            return Transformer.generateDefinitionReference(model.identity);
        }
    },

    generateDefinitionReference: function generateDefinitionReference(modelIdentity) {
        return '#/definitions/' + modelIdentity;
    },

    /**
     * http://swagger.io/specification/#pathItemObject
     */
    getPathItem: function getPathItem(sails, pathGroup) {
        var methodGroups = _lodash2['default'].chain(pathGroup).indexBy('method').pick(['get', 'post', 'put', 'head', 'options', 'patch', 'delete']).value();

        return _lodash2['default'].mapValues(methodGroups, function (methodGroup, method) {
            return Transformer.getOperation(sails, methodGroup, method);
        });
    },

    /**
     * http://swagger.io/specification/#operationObject
     */
    getOperation: function getOperation(sails, methodGroup, method) {
        return {
            summary: methodMap[method],
            consumes: ['application/json'],
            produces: ['application/json'],
            parameters: Transformer.getParameters(sails, methodGroup),
            responses: Transformer.getResponses(sails, methodGroup),
            tags: Transformer.getPathTags(sails, methodGroup)
        };
    },

    /**
     * A list of tags for API documentation control. Tags can be used for logical
     * grouping of operations by resources or any other qualifier.
     */
    getPathTags: function getPathTags(sails, methodGroup) {
        return _lodash2['default'].unique(_lodash2['default'].compact([Transformer.getPathModelTag(sails, methodGroup), Transformer.getPathControllerTag(sails, methodGroup), Transformer.getControllerFromRoute(sails, methodGroup)]));
    },

    getPathModelTag: function getPathModelTag(sails, methodGroup) {
        var model = Transformer.getModelFromPath(sails, methodGroup.path);
        return model && model.globalId;
    },

    getPathControllerTag: function getPathControllerTag(sails, methodGroup) {
        // Fist check if we can find a controller tag using prefixed blueprint routes
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = getBlueprintPrefixes()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var prefix = _step.value;

                if (methodGroup.path.indexOf(prefix) === 0) {
                    var _methodGroup$path$replace$split = methodGroup.path.replace(prefix, '').split('/');

                    var _methodGroup$path$replace$split2 = _slicedToArray(_methodGroup$path$replace$split, 2);

                    var _$ = _methodGroup$path$replace$split2[0];
                    var _pathToken = _methodGroup$path$replace$split2[1];

                    var tag = _lodash2['default'].get(sails.controllers, [_pathToken, 'globalId']);
                    if (tag) return tag;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var _methodGroup$path$split = methodGroup.path.split('/');

        var _methodGroup$path$split2 = _slicedToArray(_methodGroup$path$split, 2);

        var $ = _methodGroup$path$split2[0];
        var pathToken = _methodGroup$path$split2[1];

        return _lodash2['default'].get(sails.controllers, [pathToken, 'globalId']);
    },

    getControllerFromRoute: function getControllerFromRoute(sails, methodGroup) {
        var route = sails.config.routes[methodGroup.method + ' ' + methodGroup.path];
        if (!route) return;

        var pattern = /(.+)Controller/;
        var controller = route.controller || _lodash2['default'].isString(route) && route.split('.')[0];

        if (!controller) return;

        var _Controller$exec = /(.+)Controller/.exec(controller);

        var _Controller$exec2 = _slicedToArray(_Controller$exec, 2);

        var $ = _Controller$exec2[0];
        var name = _Controller$exec2[1];

        return name;
    },

    /**
     * http://swagger.io/specification/#parameterObject
     */
    getParameters: function getParameters(sails, methodGroup) {
        var method = methodGroup.method;
        var routeKeys = methodGroup.keys;

        var canHavePayload = method === 'post' || method === 'put';

        if (!routeKeys.length && !canHavePayload) return [];

        var parameters = _lodash2['default'].map(routeKeys, function (param) {
            return {
                name: param.name,
                'in': 'path',
                required: true,
                type: 'string'
            };
        });

        if (canHavePayload) {
            var path = methodGroup.path;
            var modelIdentity = Transformer.getModelIdentityFromPath(sails, path);

            if (modelIdentity) {
                parameters.push({
                    name: modelIdentity,
                    'in': 'body',
                    required: true,
                    schema: {
                        $ref: Transformer.getDefinitionReferenceFromPath(sails, path)
                    }
                });
            }
        }

        return parameters;
    },

    /**
     * http://swagger.io/specification/#responsesObject
     */
    getResponses: function getResponses(sails, methodGroup) {
        var $ref = Transformer.getDefinitionReferenceFromPath(sails, methodGroup.path);
        var ok = {
            description: 'The requested resource'
        };
        if ($ref) {
            ok.schema = { '$ref': $ref };
        }
        return {
            '200': ok,
            '404': { description: 'Resource not found' },
            '500': { description: 'Internal server error' }
        };
    }
};

exports['default'] = Transformer;
module.exports = exports['default'];