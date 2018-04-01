import util = require('util');
import Rxjs = require('rxjs');
import sails = require('sails');
import dbUtilies = require('../services/dbUtils');

var requestValidator = require('../helper/requestValidator');
var JsonUtils = require('../helper/JsonUtils');
var maskData = require('../helper/maskData');
var ResponseUtils = require('../helper/ResponseUtils');

// Get Users
export function get_users(req: any, res: any, next: Function): any {
    let name = req.query['name'];
    let id = req.query['id'];
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
        let reqObj = {userName: name};
        dbUtilies.getOne('user_details', reqObj).subscribe(
            data => {
                res.status(200).send(data);
            },
            err => {
                res.status(404).send(err);
            }
        );
    } else if (id) {
        let reqObj = {id: id};
        dbUtilies.getOne('user_details', reqObj).subscribe(
            data => {
                res.status(200).send(data);
            },
            err => {
                res.notFound(err);
                // res.status(404).send(err);
            }
        );
    } else {
        // res.json(sanitizer.escape('your dirty string'));
        // res.json(sanitizer.normalizeRCData('your dirty string'));
        /*maskData.maskReqData({"data":"data","name":"name"});*/
        dbUtilies.getAll('user_details')
            .subscribe(
                data => {
                    res.status(200).send(data);
                },
                err => {
                    res.status(500).send(err);
                }
            );
    }
}

// Create New User
export function create_user(req: any, res: any, next: Function) {
    let reqBody = req.body;
    dbUtilies.create('user_details', reqBody).subscribe(
        data => {
            res.status(201).send(data);
        },
        err => {
            res.status(400).send(err);
        }
    );
}

// Update The User
export function update_user(req: any, res: any, next: Function) {
    let id = req.params['id'];
    let reqObj = {id: id};
    let reqBody = req.body;
    dbUtilies.update('user_details', reqObj, reqBody).subscribe(
        data => {
            res.status(200).send(data);
        },
        err => {
            res.status(404).send(err);
        }
    );
}

//Delete The User
export function delete_user(req: any, res: any, next: Function) {
    let id = req.params['id'];
    let reqObj = {id: id};
    dbUtilies.destroy('user_details', reqObj).subscribe(
        data => {
            res.status(200).send(data);
        },
        err => {
            res.status(404).send(err);
        }
    );
}