"use strict";
exports.__esModule = true;
var dbUtilies = require("../services/dbUtils");
var requestValidator = require('../helper/requestValidator');
var JsonUtils = require('../helper/JsonUtils');
var maskData = require('../helper/maskData');
var ResponseUtils = require('../helper/ResponseUtils');
// Get Users
function get_users(req, res, next) {
    var name = req.query['name'];
    var id = req.query['id'];
    /* add all fields whic are required for get call. Here we are querying the database with id,name,type,database_acds_id
      if the query params is empty It will be get all call */
    /* collectToObj takes 3 parameters
    1. your params which are used for the get call if the user interested
    2. Query params
    3. atleast one is required.
    Here in my params if everything is false like to call get all so we pass the third argument to true.
    if you like to make any one of the params are required which are defined in params array then change the third
    argument to true
     */
    /*var data = JsonUtils.collectToObj(params, req.query, false);*/
    // validate params
    //var params = requestValidator.validateReqParams(req,['?name', '?password']);
    /*if (!data.valid) {
        return res.negotiate(ResponseUtils.badRequest(data.details));
    }*/
    if (name) {
        var reqObj = { userName: name };
        dbUtilies.getOne('user_details', reqObj).subscribe(function (data) {
            res.status(200).send(data);
        }, function (err) {
            res.status(404).send(err);
        });
    }
    else if (id) {
        var reqObj = { id: id };
        dbUtilies.getOne('user_details', reqObj).subscribe(function (data) {
            res.status(200).send(data);
        }, function (err) {
            res.notFound(err);
            // res.status(404).send(err);
        });
    }
    else {
        // res.json(sanitizer.escape('your dirty string'));
        // res.json(sanitizer.normalizeRCData('your dirty string'));
        /*maskData.maskReqData({"data":"data","name":"name"});*/
        dbUtilies.getAll('user_details')
            .subscribe(function (data) {
            res.status(200).send(data);
        }, function (err) {
            res.status(500).send(err);
        });
    }
}
exports.get_users = get_users;
// Create New User
function create_user(req, res, next) {
    var reqBody = req.body;
    dbUtilies.create('user_details', reqBody).subscribe(function (data) {
        res.status(201).send(data);
    }, function (err) {
        res.status(400).send(err);
    });
}
exports.create_user = create_user;
// Update The User
function update_user(req, res, next) {
    var id = req.params['id'];
    var reqObj = { id: id };
    var reqBody = req.body;
    dbUtilies.update('user_details', reqObj, reqBody).subscribe(function (data) {
        res.status(200).send(data);
    }, function (err) {
        res.status(404).send(err);
    });
}
exports.update_user = update_user;
//Delete The User
function delete_user(req, res, next) {
    var id = req.params['id'];
    var reqObj = { id: id };
    dbUtilies.destroy('user_details', reqObj).subscribe(function (data) {
        res.status(200).send(data);
    }, function (err) {
        res.status(404).send(err);
    });
}
exports.delete_user = delete_user;
