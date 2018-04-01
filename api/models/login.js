var bcrypt = require('bcrypt');
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
        role: {
            type: 'string',
            required: true,
            enum: ['Admin', 'Employee', 'Employeer'],
        },
        // relations
        userDetails: {
            model: 'user_details'
        },
        isPasswordValid: function (passwordHash, cb) {
            bcrypt.compare(passwordHash, this.passwordHash, function(err, result) {
                if (err) { cb (err,undefined); }
                cb(undefined,result);
            });
        }
    },
    beforeCreate: function(user, cb) {
        logger.info("Before Create")
        Hashing(user.passwordHash,function (err,hash) {
            if(err) {
                cb(err);
            }
            else {
                user.passwordHash = hash;
                cb();
            }
        });

    },
    beforeUpdate: function(user, cb) {
        logger.info("Before Update")
        Hashing(user.passwordHash, function (err, hash) {
            if (err) {
                cb(err);
            }
            else {
                user.passwordHash = hash;
                cb();
            }
        });
    }
};
function Hashing(passwordHash,cb){
    logger.info("Hashing......te")
    if ( passwordHash == null ) {
        return process.nextTick(function() {
            cb();
        });
    }
    bcrypt.hash(passwordHash, 10, function(err, hash) {
        if (err) {
            console.log(err);
            cb(err,undefined);
        } else {
            cb(undefined,hash);
        }

    });
}