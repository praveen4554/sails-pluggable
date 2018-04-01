module.exports = {

    'post /signup' : {
        controller: 'AuthController',
        action: 'signup',
        skipAssets: 'true',
        //swagger path object
        swagger: {
            methods: ['POST'],
            summary: ' return username and password with token  ',
            description: 'register new user',
            produces: [
                'application/json'
            ],
            responses: {
                '200': {
                    description: 'register new user',
                    schema: 'User', // api/model/Group.js,
                    type: 'array'
                }
            }
        }
    },
}