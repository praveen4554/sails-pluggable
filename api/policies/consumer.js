var kafka = require('kafka-node');
var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;
var client = new Client('localhost:2181');
var topicsService = require('../services/kafkaTopics');
var topics = [{
    topic: 'node-test'
}];
var options = {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'buffer'
};
var consumer = new HighLevelConsumer(client, topics, options);
consumer.on('message', function (message) {
    console.log(message.value);
    var buf = new Buffer(message.value, 'binary'); // Read string into a buffer.
    var buffer = new Buffer.from(JSON.stringify(message.value));
    // var decodedMessage = type.fromBuffer(buf.slice(0)); // Skip prefix.
    var mes = buf.toString('utf8');
    var temp = JSON.stringify(buffer);
    // TokenAuth.verifyToken(message.api_key,function(err, decodedToken){
    //     console.log(err);
    //     console.log(decodedToken);
    // });
    var bufferOriginal = Buffer.from(JSON.parse(temp).data);
    console.log(bufferOriginal);
    console.log(bufferOriginal.toString('utf8'));
    console.log(typeof mes);
    console.log(JSON.stringify(mes));
    console.log(typeof JSON.stringify(mes));
    console.log(typeof temp);
    console.log(JSON.parse(JSON.stringify(temp)));
    console.log(typeof JSON.parse(JSON.stringify(temp)));
});

consumer.on('error', function (err) {
    console.log('error', err);
});

process.on('SIGINT', function () {
    consumer.close(true, function () {
        process.exit();
    });
});
consumer.on('rebalanced', function (err) {
    console.log(err);

});
module.exports.createTopics = function (topic) {
    client.loadMetadataForTopics([], function (error, results) {
        if (Object.keys(results[1].metadata).indexOf(topic) == -1) {
            consumer.addTopics([topic], function (err, added) {
                console.log(err);
                console.log(added);
            });
        }
    });
}