'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var SwaggerController = {
    doc: function doc(req, res) {
        res.status(200).jsonx(sails.hooks.swagger.doc);
    },

    ui: function ui(req, res) {
        var docUrl = req.protocol + '://' + req.get('Host') + '/swagger/doc';
        res.redirect(sails.config.swagger.ui.url + '?doc=' + encodeURIComponent(docUrl));
    }
};

exports['default'] = SwaggerController;
module.exports = exports['default'];