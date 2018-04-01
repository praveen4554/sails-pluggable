

var supertest = require('supertest');
var assert = require('assert');

require('../../bootstrap.test');

describe('The AuthController', function () {

    var token;
    var createdUserId;

    /* test for login */
    it('should signup', function (done) {
        var agent = supertest.agent(sails.hooks.http.app);
        agent
            .post('/signup')
            .set('Accept', 'application/json')
            .send({"userName": "user1", "password": "password1"})
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) {
                    done(err);
                } else {
                    result.body.should.be.an('object');
                    assert.equal(result.body.user.userName,'user1');
                    token = result.body.token;
                    done();
                }
            });
    });

    it('should create a user', function (done) {
        var agent = supertest.agent(sails.hooks.http.app);
        agent
            .post('/create_user')
            .set('Accept', 'application/json')
            .send({"userName": "user1", "password": "password1"})
            .set('api_key', token)
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, result) {
                if (err) {
                    done(err);
                } else {
                    result.body.should.be.an('object');
                    assert.equal(result.body.userName, 'user1');
                    assert.equal(result.body.password, 'password1');
                    createdUserId = result.body.id;
                    done();
                }
            });
    });

    it('should get all users', function (done) {
        var agent = supertest.agent(sails.hooks.http.app);
        agent
            .get('/users_list')
            .set('Accept', 'application/json')
            .set('api_key', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) {
                    done(err);
                } else {
                    result.body.should.be.an('array');
                    result.body.should.have.length(1);
                    done();
                }
            });
    });

    it('should edit user created', function (done) {
        var agent = supertest.agent(sails.hooks.http.app);
        agent
            .put('/update_user/' + createdUserId)
            .set('Accept', 'application/json')
            .send({"userName": "user11", "password": "password11"})
            .set('api_key', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) {
                    done(err);
                } else {
                    result.body.should.be.an('object');
                    result.body.should.have.property('id', createdUserId);
                    result.body.should.have.property('userName', 'user11');
                    result.body.should.have.property('password', 'password11');
                    done();
                }
            });
    });

    it('should delete user created', function (done) {
        var agent = supertest.agent(sails.hooks.http.app);
        agent
            .delete('/delete_user/' + createdUserId)
            .set('Accept', 'application/json')
            .set('api_key', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) {
                    return done(err);
                } else {
                    result.body.should.be.an('object');
                    result.body.should.have.property('id', createdUserId);
                    result.body.should.have.property('userName', 'user11');
                    result.body.should.have.property('password', 'password11');
                    return done();
                }
            });
    });


});