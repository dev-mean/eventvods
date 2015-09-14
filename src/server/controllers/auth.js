module.exports = function(rightsNeeded) {
	return function(req, res, next) {
        //if (process.env.NODE_ENV === 'development') return next();
		if (!req.isAuthenticated || !req.isAuthenticated()) {
			if (req.session) {
			  req.session.returnTo = req.originalUrl || req.url;
			}
		  return res.redirect('/users/login');
		}
		else if(req.user.userRights >= rightsNeeded)
			next();
		else {
			var err = new Error('Insufficient Permissions');
		  	err.status = 403;
            res.render('error', {error: err});
		}
  	};
};

// Auth for API, doesn't try to redirect or anything fancy, as the user should never see these errors
module.exports.apiAuth = function(rightsNeeded) {
    return function(req, res, next) {
        var err;
        //if (process.env.NODE_ENV === 'development') return next();
        if (!req.isAuthenticated || !req.isAuthenticated()) {
		    return res.sendStatus(401);
		}
        else if(req.user.userRights >= rightsNeeded)
			next();
		else {
            return res.sendStatus(403);
		}
    };
};
module.exports.checkPriv = function(req, res, next, rightsNeeded, callback) {
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
