'use strict'
var path = require('path');
var _ = require('lodash');
var Marlinspike = require('marlinspike');
var xfmr = require('../../../lib/xfmr');

class Swagger extends Marlinspike {

  defaults (overrides) {
    return {
      'swagger': {
        pkg: {
          name: 'No package information',
          description: 'You should set sails.config.swagger.pkg to retrieve the content of the package.json file',
          version: '0.0.0'
        },
        ui: {
          url: 'http://localhost:8080/'
        }
      },
      'routes': {
        '/swagger/doc': {
          controller: 'SwaggerController',
          action: 'doc'
        }
      }
    };
  }

  constructor (sails) {
    super(sails, module);
  }

  initialize (next) {
    let hook = this.sails.hooks.swagger
    this.sails.after('lifted', () => {
      hook.doc = xfmr.getSwagger(this.sails, this.sails.config.swagger.pkg)
    })

    next()
  }
}

module.exports = Marlinspike.createSailsHook(Swagger)
