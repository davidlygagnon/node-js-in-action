var User = require('../lib/user');

exports.form = function(req, res) {
  res.render('register', {title: 'Register'});
};

exports.submit = function(req, res, next) {
  var data = req.body.user;

  // check if username is unique
  User.getByName(data.name, function(err, user) {
    // defer database connection errors and othe errors
    if (err) return next(err);

    // redis will default it
    if (user.id) {
      res.error('Username already taken!');
    } else {
      // create a user with POST data
      user = new User({
        name: data.name,
        pass: data.pass
      });

      // save new user
      user.save(function(err) {
        if (err) return next(err);

        req.sessionuid = user.id; // store uid for authentication
        res.redirect('/'); // redirect to entry listing page
      });
    }
  });
};
