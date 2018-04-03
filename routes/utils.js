module.exports.retrieveUser = function(db, email) {
  return db.collection('users').find( { email: email } );
}

module.exports.getSession = function(req) {
  return module.exports.parseCookies(req).session;
}

module.exports.createSession = function(newUser, newLoggedIn) {
  return { loggedIn: newLoggedIn, user: newUser };
}

module.exports.parseCookies = function(req) {
  var list = {},
    rc = req.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}
