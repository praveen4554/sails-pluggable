# sails-pluggable

for installing the module 
    
    npm install -g sail-application

for starting application with apache-kafka
    
    goto kafka_2.12-0.10.2.0 folder from terminal and run the following commnads
        1) bin/zookeeper-server-start.sh config/zookeeper.properties
        2) for running server 
            bin/kafkas-server-start.sh config/server.properties

    running the application 
        npm install
        npm start
    for creating project
        sag new projectName


   for creating controller 
        sag controller controllerName
    
    
    for creating models
        sag model modelName
    
    
    for creating services
        sag service serviceName
    
    
    for creating policies
        sag policies policieName
    
    
    for changing database name
        sag --config db_name databaseName
    
    mongodb to sails models
     sails-inverse-model -d blog_db -t mg -m -v -c