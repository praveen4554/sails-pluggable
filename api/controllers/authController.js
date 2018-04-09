var requestValidator = require('../helper/requestValidator');
var maskData = require('../helper/maskData');
var maskData = require('../Helper/maskData');
 var logger = require('../services/logger');
module.exports = {
    login: function (req, res) {
         logger.info('Logger Is Enabled');
        // );
        // Validate request paramaters
        var params = requestValidator.validateReqParams(req, ['emailId', 'password']);
        if (!params) return null;
        if (!req.body.emailId || !req.body.emailId) {
            return res.json(400, {
                err: {
                    status: 'danger',
                    message: res.i18n('auth.login.badRequest')
                }
            });
        }

        login.findOne({emailId: req.body.emailId}, function (err, user) {
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
                console.log(bool);
                var token = TokenAuth.issueToken({
                    sub: {
                        userName: user.userName,
                         roleName: 'admin'
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
                        console.log(user);
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
        var params = requestValidator.validateReqParams(req, ['emailId', 'password']);
        if (!params) return null;
        if (!req.body.emailId || !req.body.password) {
            return res.json(400, {
                err: {
                    status: 'danger',
                    message: res.i18n('auth.signup.badRequest')
                }
            });
        }
        var newUser = {
            emailId: req.body.emailId,
            password: req.body.password
        };
        if (sails.config.jwt.requireAccountActivation) {
            if (!sails.config.jwt.sendAccountActivationEmail) {
                sails.log.error('sails-hook-jwt:: An email function must be implemented through `sails.config.jwt.sendAccountActivationEmail` in order to enable the account activation feature. This will receive two parameters (user, activationLink).');
                return res.json(500);
            }

        }


                login.create(newUser).exec(function (err, user) {
                    if (err) {
                        if (err.ValidationError) {
                            console.log("error");
                            // return helper.convertWaterlineError(err, res);
                        }

                        return res.json(err.status, {err: err});
                    }
                        return res.json({
                            user: user, token: TokenAuth.issueToken({
                                sub: {
                                    userName: user.userName, tenant: 'ddn'
                                    , roleName: 'admin'
                                }
                            }, {expiresIn: 60 * 60 * 24})
                        });

                    // return sails.config.jwt.sendAccountActivationEmail(res, user, helper.createActivationLink( user ));
                });
    }
};
