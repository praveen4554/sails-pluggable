module.exports = function (req, res, next) {
    var token;
    if (req.isSocket && req.query.api_key) {
        token = req.query.api_key;
        // We delete the token from param to not mess with blueprints
        delete req.query.token;
    } else if (!req.isSocket && req.headers.api_key) {
        token = req.headers.api_key;
        delete req.query.token;
    } else {
        return res.json(401, {err: {status: 'danger', message: res.i18n('auth.policy.noAuthorizationHeaderFound')}});
    }

    TokenAuth.verifyToken(token, function (err, decodedToken) {
        if (err) return res.json(401, {
            err: {
                status: 'UNAUTHORIZED ACCESS',
                message: res.i18n('auth.policy.invalidToken'),
                detail: err
            }
        });
        req.decodeAuth = decodedToken.sub;
        next();
    });
};