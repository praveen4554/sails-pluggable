var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
module.exports = {
    attributes: {
        emailId: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true,
        },
        // relations
        userDetails: {
            model: 'user_details'
        },
        isPasswordValid: function (password, cb) {
            decrypt(password, function(err, result){
                if(result === this.password)
                    cb(undefined,true);
                else
                    cb (false,undefined);
            });
            bcrypt.compare(password, this.password, function(err, result) {
                if (err) { cb (err,undefined); }
                cb(undefined,result);
            });
        }
    },
    beforeCreate: function(user, cb) {
         logger.info("Before Create")
        encrypt(user.password,function (err,hash) {
            if(err) {
                cb(err);
            }
            else {
                user.password = hash;
                cb();
            }
        });

    },
    beforeUpdate: function(user, cb) {
        logger.info("Before Update")
        encrypt(user.password, function (err, hash) {
            if (err) {
                cb(err);
            }
            else {
                user.password = hash;
                cb();
            }
        });
    }
};

function encrypt(text,cb){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return cb(undefined,crypted);
}

function decrypt(text,cb){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return cb(undefined,dec);
}