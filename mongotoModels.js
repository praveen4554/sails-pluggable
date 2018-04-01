var sim = require('sails-inverse-model');

var folder_controllers = ""; //if folder_models == "" then: no generate controllers
var folder_models = "./api/models"; //if folder_models == "" then: no generate models
var folder_views = ""; //if folder_models == "" then: no generate views

//                host       port         database           views         models        controllers
sim.generatemg('localhost', 27017, 'praveen', folder_views, folder_models, folder_controllers);