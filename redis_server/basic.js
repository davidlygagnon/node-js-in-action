// connect to redis
var redis = require('redis'),
  client = redis.createClient(6379, '127.0.0.1');

client.on('error', function (err) {
  console.log('Error', + err);
});

// storage and retrieval of a key/value pair
client.set('color', 'red', redis.print); //redis.print prints result of an operation
client.get('color', function (err, value) {
  if (err) throw err;
  console.log('Got: ' + value);
});

// storing and retrieving values using a hash table
client.hmset('camping', {
  'shelter': '2-person tent',
  'cooking': 'campstove'
}, redis.print);

client.hget('camping', 'cooking', function (err, value) {
  if (err) throw err;
  console.log('Will be cooking with: ' + value);
});

client.hkeys('camping', function (err, keys) {
  if (err) throw err;
  keys.forEach(function (key, i) {
    console.log(' ' + key);
  });
});

// storing and retrieving data using the list
client.lpush('tasks', 'Paint the bikeshed red.', redis.print);
client.lpush('tasks', 'Paint the bikeshed green', redis.print);
client.lrange('tasks', 0, -1, function (err, items) {
  if (err) throw err;
  items.forEach(function(item, i ) {
    console.log(' ' + item);
  });
});

// storing and retrieving data with sets
client.sadd('ip_addresses', '204.10.37.96', redis.print);
// repeating here, when displaying, will contain only since we are using set
client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '72.32.231.8', redis.print);
client.smembers('ip_addresses', function (err, members) {
  if (err) throw err;
  console.log(members);
});

// example of redis pub/sub
var redis = require('redis')
  , clientA = redis.createClient();
  , clientB = redis.createClient();

clientA.on('message', function(channel, message) {
  console.log('Client A got message from %s: $s', 
    channel,
    message
    );
});

clientA.on('subscribe', function(channel, count) {
  clientB.publish('main_chat_room', 'Hello World');
});

clientA.subscribe('main_chat_room');