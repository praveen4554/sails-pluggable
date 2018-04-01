var sails = require('sails');
var _ = require('lodash');
require('ts-node/register');

global.chai = require('chai');
global.should = chai.should();

before(function (done) {

    this.timeout(5000);

    sails.lift({
        log: {
            level: 'silent'
        },
        hooks: {
            session: false
        },
        models: {
            connection: 'unitTestConnection',
            migrate: 'drop'
        },
        connections: {
            unitTestConnection: {
                adapter: 'sails-mongo'
            }
        }
    }, function (err, server) {
        if (err) return done(err);
        done(err, sails);
    });
});

after(function (done) {
    if (sails && _.isFunction(sails.lower)) {
        sails.lower(done);
    }
});