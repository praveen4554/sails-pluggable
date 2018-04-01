var typeDescription = {
    name: 'MyAwesomeType',
    type: 'record',
    fields: [{
        name: 'enumField',
        type: {
            name: 'EnumField',
            type: 'enum',
            symbols: ['sym1', 'sym2', 'sym3']
        }
    }, {
        name: 'id',
        type: 'string'
    }, {
        name: 'timestamp',
        type: 'double'
    }]
};

var avro = require('avsc');
var type = avro.parse(typeDescription);
var kafka = require('kafka-node');
var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;
var client = new Client('localhost:2181');
var topics = [{
    topic: 'node-test',
    topic: 'Group'
}];
var options = {
    autoCommit: false,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'buffer'
};
var consumer = new HighLevelConsumer(client, topics, options);

consumer.on('message', function(message) {
    var buf = new Buffer(message.value, 'binary'); // Read string into a buffer.
     // var decodedMessage = type.fromBuffer(buf.slice(0)); // Skip prefix.
    console.log(buf.toString());
});

consumer.on('error', function(err) {
    console.log('error', err);
});

process.on('SIGINT', function() {
    consumer.close(true, function() {
        process.exit();
    });
});