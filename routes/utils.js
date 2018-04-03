module.exports.retrieveUser = function(db, email) {
  return db.collection('users').find( { email: email } );
}

module.exports.getSession = function(cookie) {
  var cookieSesh = cookie.get('session');
  if(cookieSesh) return cookieSesh;
  else return null;
}

module.exports.createSession = function(newUser, newLoggedIn) {
  console.log("NewUser: " + newUser);
  return { loggedIn: newLoggedIn, user: newUser };
}

