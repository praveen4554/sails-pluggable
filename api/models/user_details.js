module.exports = {
    attributes: {
        firstName: {
            type: 'string',
            required: true
        },
        lastName: {
            type: 'string',
            required: true
        },
        middleName: {
            type: 'string'
        },
        gender: {
            type: 'string',
            required: true,
            enum: ['M', 'F']
        },
        mobileNumber: {
            type: 'string',
            required: true,
            unique: true
        },
        dateOfBirth: {
            type: 'date',
            required: true
        },
        // relations
        users: {
            model: 'login'
        }
    }
};