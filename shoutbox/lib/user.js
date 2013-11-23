var redis = require('redis');
var bcrypt = require('bcrypt');
var db = redis.createClient();

module.exports = User; // export user function from the module

// iterate keys in the passed in object and merge values
function User(obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
}

User.prototype.toJSON = function () {
  return {
    id: this.id,
    name: this.name
  }
};

User.prototype.save = function(fn) {
  if (this.id) {
    // user already exists
    this.update(fn);
  } else {
    var user = this;

    // create unique ID
    db.incr('user:ids', function(err, id) {
      if (err) return fn(err);

      user.id = id; // set ID so it will be saved

      user.hashPassword(function(err) { // hash password
        if (err) return fn(err);
        user.update(fn);
      });
    });
  }
}

User.prototype.update = function(fn) {
  var user = this;
  var id = user.id;

  // index user ID by name
  db.set('user:id:' + user.name, id, function(err) {
    if (err) return fn(err);

    // use Redis hash to store data
    db.hmset('user:' + id, user, function(err) {
      fn(err);
    });
  });
}

User.prototype.hashPassword = function(fn) {
  var user = this;

  // generate a 12-character salt
  bcrypt.genSalt(12, function(err, salt) {
    if (err) return fn(err);

    user.salt = salt; // set salt so it will be saved

    bcrypt.hash(user.pass, salt, function(err, hash) {
      if (err) return fn(err);
      user.pass = hash; // set hash so it will be saved
      fn();
    });
  });
}

// look up user ID by name
User.getByName = function (name, fn) {
  User.getId(name, function(err, id) {
    if (err) return fn(err);

    // grab user with id
    User.get(id, fn);
  });
}

// get ID indexed by name
User.getId = function(name, fn) {
  db.get('user:id:' + name, fn);
}

// fetch plain object hash
User.get = function(id, fn) {
  db.hgetall('user:' + id, function(err, user) {
    if (err) return fn(err);

    // convert plain object to new User
    fn(null, new User(user));
  });
}

User.authenticate = function(name, pass, fn) {
  // lookup user by name
  User.getByName(name, function (err, user) {
    if (err) return fn(err);

    // user doesn't exists
    if (!user.id) return fn();

    bcrypt.hash(pass, user.salt, function(err, hash) {
      if (err) return fn(err);

      // match found
      if (hash == user.pass) return fn(null, user);

      // invalid password
      fn();
    });
  });
}

// Testing the user model

// var tobi = new User({
//   name: 'Tobi',
//   pass: 'test1234',
//   age: '2'
// });

// tobi.save(function (err) {
//   if (err) throw err;

//   console.log('user id %d', tobi.id);
// });

