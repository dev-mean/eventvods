module.exports = function(rightsNeeded){
	return function(req, res, next) {
		if (!req.isAuthenticated || !req.isAuthenticated()) {
			if (req.session) {
			  req.session.returnTo = req.originalUrl || req.url;
			}
		  return res.redirect('/users/login');
		}
		else if(req.user.userRights >= rightsNeeded)
			next();
		else {
			//We need an actual user error page to display to user
			var err = new Error('Insufficient Permissions');
		  	err.status = 403;
		  	next(err);
		}
  	};
};
module.exports.checkPriv = function(req, res, next, rightsNeeded, callback){
    var err;
	if( typeof req.user !== undefined && req.user.userRights >= rightsNeeded)
		callback(null, req, res, next);
    else if(typeof req.user !== undefined) {
		err = new Error('Insufficient Permissions');
	  	err.status = 403;
	  	callback(err);
	}
	else {
		err = new Error('Not authenticated');
	  	err.status = 401;
	  	callback(err);
	}
};
