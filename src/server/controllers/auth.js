module.exports = function(privRequired){
	return function(req, res, next) {
		if (!req.isAuthenticated || !req.isAuthenticated()) {
			if (req.session) {
			  req.session.returnTo = req.originalUrl || req.url;
			}
		  return res.redirect('/login');
		}
		else if(req.user.priv >= privRequired)
			next();
		else {
			//We need an actual user error page to display to user
			var err = new Error('Insufficient Permissions');
	  		err.status = 401;
	  		next(err);
		}
  	}
}
module.exports.checkPriv = function(req, res, next, privRequired, callback){
	if( typeof req.user !== undefined && req.user.priv >= privRequired)
		callback(req, res, next);
	else {
		var err = new Error('Insufficient Permissions');
	  	err.status = 401;
	  	next(err);
	}
}