var User = require('../lib/user');

exports.form = function(req, res) {
  res.render('login', {title: 'Login'});
};

exports.submit = function(req, res, next) {
  var data = req.body.user;

  // check credentials
  User.authenticate(data.name, data.pass, function(err, user) {
    if (err) return next(err);

    // handle a user with valid credentials
    if (user) {

      // store uid for authentication
      req.session.uid = user.id;
      res.redirect('/');
    } else {
      // expose an error message
      res.error('Sorry ! invalid credentials.');
      // redirect back to login form
      res.redirect('back');
    }
  });
};

exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    if (err) throw err;
    res.redirect('/');
  });
};