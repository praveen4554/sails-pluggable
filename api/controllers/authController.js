var bcrypt = require('bcrypt');
var requestValidator = require('../helper/requestValidator');
var maskData = require('../helper/maskData');
var maskData = require('../Helper/maskData');
var logger = require('../services/logger');
module.exports = {
    login: function (req, res) {
        logger.info('Logger Is Enabled');
        // );
        // Validate request paramaters
        var params = requestValidator.validateReqParams(req, ['userName', 'password']);
        if (!params) return null;
        if (!req.body.userName || !req.body.password) {
            return res.json(400, {
                err: {
                    status: 'danger',
                    message: res.i18n('auth.login.badRequest')
                }
            });
        }

        User.findOne({userName: req.body.userName}, function (err, user) {
            if (err) {
                res.json(500, {err: err});
            }

            if (!user) {
                return res.json(401, {
                    err: {
                        status: 'warn',
                        message: res.i18n('auth.login.noUserFound')
                    }
                });
            }

            user.isPasswordValid(req.body.password, function (err, bool) {
                if (err) return res.serverError(err);
                var token = TokenAuth.issueToken({
                    sub: {
                        userName: user.userName, tenant: 'ddn'
                        , roleName: 'admin'
                    }
                }, {expiresIn: 60 * 60 * 24});
                if (bool) {
                    if (req.isSocket) {
                        sails.io.on('connect', function (newlyConnectedSocket) {
                            console.log('Connected Successfully...!')
                        });
                        sails.sockets.join(req.socket, user.userName, function (err) {
                            if (err) {
                                return res.serverError(err);
                            }
                            return res.json({
                                user: maskData.maskReqData(user), token: token
                            });
                        });
                        sails.sockets.broadcast(user.userName, 'data', {greeting: 'Hola!'});
                        // sails.sockets.leave(req.socket, user.userName, function(){
                        //     if (err) {
                        //         return res.serverError(err);
                        //     }
                        //     console.log(sails.sockets.rooms());
                        // });
                    } else {
                        return res.json({
                            user: maskData.maskReqData(user), token: token
                        });
                    }
                } else {
                    return res.json(401, {
                        err: {
                            status: 'danger',
                            message: res.i18n('auth.login.invalidPassword')
                        }
                    });
                }
            });
        });

    },

    signup: function (req, res) {
        // Validate request paramaters
        var params = requestValidator.validateReqParams(req, ['userName', 'password']);
        if (!params) return null;
        if (!req.body.userName || !req.body.password) {
            return res.json(400, {
                err: {
                    status: 'danger',
                    message: res.i18n('auth.signup.badRequest')
                }
            });
        }
        var newUser = {
            userName: req.body.userName,
            password: req.body.password,
            active: true
        };
        if (sails.config.jwt.requireAccountActivation) {
            if (!sails.config.jwt.sendAccountActivationEmail) {
                sails.log.error('sails-hook-jwt:: An email function must be implemented through `sails.config.jwt.sendAccountActivationEmail` in order to enable the account activation feature. This will receive two parameters (user, activationLink).');
                return res.json(500);
            }

            newUser.active = false;
        }

        // Encrypt password before saving to database
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) {
                    return res.json(500, {err: err});
                }

                newUser.password = hash;

                User.create(newUser).exec(function (err, user) {
                    if (err) {
                        if (err.ValidationError) {
                            console.log("error");
                            // return helper.convertWaterlineError(err, res);
                        }

                        return res.json(err.status, {err: err});
                    }
                    if (newUser.active) {
                        return res.json({
                            user: user, token: TokenAuth.issueToken({
                                sub: {
                                    userName: user.userName, tenant: 'ddn'
                                    , roleName: 'admin'
                                }
                            }, {expiresIn: 60 * 60 * 24})
                        });
                    }

                    // return sails.config.jwt.sendAccountActivationEmail(res, user, helper.createActivationLink( user ));
                });
            });
        });
    }
};
