var app = require('express');
var router = app.Router();
var validateRouter = require('./validateRouter.js');
var authRouter = require('./authRouter.js');

router.use('/validate', validateRouter);
router.use('/auth', authRouter);

var auth = require('../controllers/auth');
var path = require('path');
var AWS = require('../controllers/aws');
var Staff = require('../models/staff');
var Event = require('../models/event');
var Link = require('../models/link');
var Map = require('../models/map');
var Match = require('../models/match');
var EventModule = require('../models/module');
var Organization = require('../models/organization');
var Round = require('../models/round');
var SocialMedia = require('../models/socialmedia');
var Sponsor = require('../models/sponsor');
var Team = require('../models/team');
var User = require('../models/user');
var async = require('async');
var Validators = require('../controllers/validation');
var Indicative = require('indicative');
var logger = require('bristol');
var APIKey = require('../models/APIKey');
var League = require('../models/league');
var Game = require('../models/game');
var keygen = require('keygenerator');
var config = require('../../config/config');
var moment = require('moment');
var Q = require('q');
// Redis is magic basically
var redis = require('redis')
    .createClient(config.redis.port, config.redis.host, {
        auth_pass: config.redis.auth,
        prefix: 'api'
    });
redis.on('connect', function() {
    logger.info('Redis server online.');
});
// Set up caching middleware
var cache = require('express-redis-cache')({
    client: redis,
    prefix: ':cache',
    expire: 43200
});
cache.on('error', function(err) {
        logger.error(err);
    })
    // Set up ratelimit middleware
var RateLimitjs = require('ratelimit.js')
    .RateLimit;
var ExpressMiddleware = require('ratelimit.js')
    .ExpressMiddleware;
// Essentially:
// Max 12 requests per second (one full update of all API routes = 12 calls)
// & 24 requests per minute
// & 192 requests per hour
var limiter = new RateLimitjs(redis, [{
    interval: 1,
    limit: 12
}, {
    interval: 60,
    limit: 24
}, {
    interval: 3600,
    limit: 192
}], {
    prefix: ':limiter'
});
var middlewareFactory = new ExpressMiddleware(limiter, {
    ignoreRedisErrors: true
});
var rateLimit = middlewareFactory.middleware({
    extractIps: function(req) {
        return req.apiKey;
    }
}, function(req, res, next) {
    var err = new Error("Rate Limit Exceeded");
    err.status = 429;
    next(err);
});
function rateLimitCheck(req, res, next){
    if(req.ignoreRatelimit){
        next();
    } else {
        return rateLimit;
    }
}
function time(name, end){
    return function (req, res, next){
        if(!end) req.timer = new Date();
        var time = new Date() - req.timer;
        if(end) console.log(name + ' = ' +time+'ms');
        return next();
    };
}
// This router is mounted at /api....so /events here translates to /api/events
// Enable CORS for /api routing.
// TODO: Consider whitelist / blacklisting domains?
router.all('*', function(req, res, next) {
    var oneof = false;
    req.ignoreRatelimit = true;
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if (req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if (req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if (oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 31);
    }
    // intercept OPTIONS method for pre-flight CORS check
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
/*router.all('*', function(req, res, next) {
    var time = new Date();
        if (process.env.NODE_ENV === 'development') {
            if (!req.isAuthenticated()) {
                console.log('No user detected, trying to authenticate');
                User.authenticate()('simon_dev', 'password', function(err, user, options) {
                    if (err) console.log(err);
                    if (user === false) {
                        console.log('ERROR: Set up dev admin account!');
                    } else {
                        req.login(user, function(err) {
                            if (err) console.log(err);
                            console.log('Dev login success!');
                            return next();
                        });
                    }
                });
            } else {
                res.locals.user = req.user;
                return next();
            }
        } else {
            res.locals.user = req.user;
            return next();
        }
    });*/

//Specific static data
router.get('/data/staffRoles', auth.public_api(), function(req, res, next){
    res.json(config.staffRoles);
});

//User sessions
router.get('/session', function(req, res, next){
    console.log(req.isAuthenticated());
    if(!req.isAuthenticated()) res.sendStatus('401');
    else res.json({
        "uid": req.user._id,
        "username": req.user.username,
        "rights": req.user.userRights
    });
})

//OVERVIEW
router.get('/overview', auth.public_api(), rateLimitCheck, cache.route('overview', 3600), function(req, res, next) {
    var today = moment()
        .format();
    var last_week = moment()
        .subtract(7, 'days')
        .format();
    async.parallel({
        upcoming: function(callback) {
            Event.find({
                    "eventStartDate": {
                        $gte: today
                    }
                })
                .sort('-eventStartDate')
                .limit(1)
                .exec(function(err, docs) {
                    if (err) callback(err);
                    else callback(null, docs);
                });
        },
        ongoing: function(callback) {
            Event.find({
                    "eventEndDate": {
                        $gte: today
                    },
                    "eventStartDate": {
                        $lte: today
                    }
                })
                .sort('eventStartDate')
                .exec(function(err, docs) {
                    if (err) callback(err);
                    else callback(null, docs);
                });
        },
        finished: function(callback) {
            Event.find({
                    "eventEndDate": {
                        $lte: today
                    }
                })
                .sort('eventEndDate')
                .limit(1)
                .exec(function(err, docs) {
                    if (err) callback(err);
                    else callback(null, docs);
                });
        },
        staff: function(callback) {
            Staff.count(function(err, count) {
                if (err) callback(err);
                else callback(null, count);
            });
        },
        maps: function(callback) {
            Map.count(function(err, count) {
                if (err) callback(err);
                else callback(null, count);
            });
        },
        teams: function(callback) {
            Team.count(function(err, count) {
                if (err) callback(err);
                else callback(null, count);
            });
        },
        users: function(callback) {
            User.count(function(err, count) {
                if (err) callback(err);
                else callback(null, count);
            });
        },
        registrations: function(callback) {
            User.find({
                    "signupDate": {
                        $gte: last_week
                    }
                })
                .count()
                .exec(function(err, count) {
                    if (err) callback(err);
                    else callback(null, count);
                });
        },
        updaters: function(callback) {
            User.find({
                    "userRights": {
                        $gte: 2
                    }
                })
                .count()
                .exec(function(err, count) {
                    if (err) callback(err);
                    else callback(null, count);
                });
        },
        admins: function(callback) {
            User.find({
                    "userRights": {
                        $gte: 3
                    }
                })
                .count()
                .exec(function(err, count) {
                    if (err) callback(err);
                    else callback(null, count);
                });
        },
    }, function(err, results) {
        if (err) next(err);
        else {
            res.json(results);
        }
    });
});
//Games
router.route('/games')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        var time = new Date();
        Game.find(function(err, games) {
            if (err) next(err);
            else res.json(games);
        });
    })
    .post(auth.updater(), AWS.handleUpload(['gameIcon', 'gameBanner']), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.game, Validators.messages)
            .then(function() {
                Game.create(req.body, function(err, game) {
                    if (err) console.log(err);
                    if (err) next(err);
                    else res.json(game);
                });
            })
            .catch(function(errors) {
                console.log('catch triggered');
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/game/:game_id')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        Game.findById(req.params.game_id, function(err, game) {
            if (err) next(err);
            if (!game) {
                err = new Error("Game Not Found");
                err.status = 404;
                next(err);
            }
            res.json(game);
        });
    })
    .delete(auth.updater(), function(req, res, next) {
        Game.findById(req.params.game_id, function(err, doc) {
            Q.all([AWS.deleteImage(doc.gameIcon), AWS.deleteImage(doc.gameBanner)])
                .then(function() {
                    doc.remove(function(err) {
                        if (err) next(err);
                        else res.sendStatus(204);
                    })
                }, function(err) {
                    next(err);
                })
        });
    })
    .put(auth.updater(), AWS.handleUpload(['gameIcon', 'gameBanner']), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.game, Validators.messages)
            .then(function() {
                Game.findByIdAndUpdate(req.params.game_id, req.body, function(err, game) {
                    if (err) next(err);
                    if (!game) {
                        err = new Error("Game not found");
                        err.status = 404;
                        next(err);
                    } else res.json(game);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//Leagues
router.route('/leagues')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        League.find()
            .populate('leagueGame')
            .exec(function(err, leagues) {
                if (err) next(err);
                else res.json(leagues);
            });
    })
    .post(auth.updater(), AWS.handleUpload(['leagueLogo', 'leagueHeader']), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.league, Validators.messages)
            .then(function() {
                League.create(req.body, function(err, league) {
                    if (err) console.log(err);
                    if (err) next(err);
                    else res.json(league);
                });
            })
            .catch(function(errors) {
                console.log('catch triggered');
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.get('/leagues/game/:game_id', auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
    Game.findOne({
        gameAlias: req.params.game_id
    }, function(err, game) {
        if (err) next(err);
        if (!game) {
            err = new Error("League Not Found");
            err.status = 404;
            next(err);
        }
        League.find({
                leagueGame: game._id
            })
            .exec(function(err, leagues) {
                if (err) next(err);
                res.json(leagues);
            });
    })
});
router.route('/league/:league_id')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        League.findById(req.params.league_id)
            .populate('leagueGame')
            .exec(function(err, league) {
                if (err) next(err);
                if (!league) {
                    err = new Error("League Not Found");
                    err.status = 404;
                    next(err);
                }
                res.json(league);
            });
    })
    .delete(auth.updater(), function(req, res, next) {
        League.findById(req.params.league_id, function(err, doc) {
            Q.all([AWS.deleteImage(doc.leagueLogo), AWS.deleteImage(doc.leagueBanner)])
                .then(function() {
                    doc.remove(function(err) {
                        if (err) next(err);
                        else res.sendStatus(204);
                    })
                }, function(err) {
                    next(err);
                })
        });
    })
    .put(auth.updater(), AWS.handleUpload(['leagueLogo', 'leagueHeader']), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.league, Validators.messages)
            .then(function() {
                League.findByIdAndUpdate(req.params.league_id, req.body, function(err, league) {
                    if (err) next(err);
                    if (!league) {
                        err = new Error("League not found");
                        err.status = 404;
                        next(err);
                    } else res.json(league);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//EVENTS
router.route('/events')
    .get(auth.public_api(), rateLimit, cache.route('events'), function(req, res, next) {
        Event.find(function(err, events) {
            if (err) next(err);
            else res.json(events);
        });
    })
    .post(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.event, Validators.messages)
            .then(function() {
                Event.create(req.body, function(err, event) {
                    if (err) next(err);
                    else res.json(event);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/event/:event_id')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        Event.findById(req.params.event_id, function(err, event) {
            if (err) next(err);
            if (!event) {
                err = new Error("Event Not Found");
                err.status = 404;
                next(err);
            }
            res.json(event);
        });
    })
    .delete(auth.updater(), function(req, res, next) {
        Event.remove({
            _id: req.params.event_id
        }, function(err) {
            if (err) next(err);
            else res.sendStatus(204);
        });
    })
    .put(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.event, Validators.messages)
            .then(function() {
                Event.findByIdAndUpdate(req.params.event_id, req.body, function(err, event) {
                    if (err) next(err);
                    if (!event) {
                        err = new Error("Event not found");
                        err.status = 404;
                        next(err);
                    } else res.json(event);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//APIKEYS
router.route('/keys')
    .get(auth.admin(), function(req, res, next) {
        APIKey.find(function(err, keys) {
            if (err) next(err);
            res.json(keys);
        });
    })
    .post(auth.admin(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.api, Validators.messages)
            .then(function() {
                auth.generate_key(req, res, function(err, key) {
                    if (err) next(err);
                    res.json(key);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/key/:keyid')
    .delete(auth.admin(), function(req, res, next) {
        APIKey.remove({
            _id: req.params.keyid
        }, function(err) {
            if (err) next(err);
            else res.sendStatus(204);
        });
    })
    .put(auth.admin(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.api, Validators.messages)
            .then(function() {
                APIKey.findByIdAndUpdate(req.params.keyid, req.body, function(err, key) {
                    if (err) next(err);
                    if (!key) {
                        err = new Error("APIKey Not Found");
                        err.status = 404;
                        next(err);
                    } else res.json(key);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//Staff routes
router.route('/staff')
    .get(auth.public_api(), rateLimit, cache.route('staff'), function(req, res, next) {
        Staff.find(function(err, staff) {
            if (err) next(err);
            res.json(staff);
        });
    })
    .post(auth.updater(), AWS.handleUpload(['staffPhoto']), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.staff, Validators.messages)
            .then(function() {
                Staff.create(req.body, function(err, staff) {
                    if (err) next(err);
                    res.json(staff);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/staff/:staff_id')
    .delete(auth.updater(), function(req, res, next) {
        Staff.findById(req.params.staff_id, function(err, doc) {
            AWS.deleteImage(doc.staffPhoto)
                .then(function() {
                    doc.remove(function(err) {
                        if (err) next(err);
                        else res.sendStatus(204);
                    })
                }, function(err) {
                    next(err);
                })
        });
    })
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        Staff.findById(req.params.staff_id, function(err, staff) {
            if (err) next(err);
            if (!staff) {
                err = new Error("Staff Not Found");
                err.status = 404;
                next(err);
            }
            res.json(staff);
        });
    })
    .put(auth.updater(), AWS.handleUpload(['staffPhoto']),  function(req, res, next) {
        Indicative.validateAll(req.body, Validators.staff, Validators.messages)
            .then(function() {
                Staff.findByIdAndUpdate(req.params.staff_id, req.body, function(err, staff) {
                    if (err) next(err);
                    if (!staff) {
                        err = new Error("Staff Not Found");
                        err.status = 404;
                        next(err);
                    } else res.json(staff);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//Link routes
router.route('/links')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        Link.find(function(err, links) {
            if (err) next(err);
            res.json(links);
        });
    })
    .post(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.link, Validators.messages)
            .then(function() {
                Link.create(req.body, function(err, link) {
                    if (err) next(err);
                    else res.json(link);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/links/:link_id')
    .delete(auth.updater(), function(req, res, next) {
        Link.remove({
            _id: req.params.link_id
        }, function(err) {
            if (err) next(err);
            else res.sendStatus(204);
        });
    })
    .put(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.link, Validators.messages)
            .then(function() {
                Link.findByIdAndUpdate(req.params.link_id, req.body, function(err, link) {
                    if (err) next(err);
                    if (!link) {
                        err = new Error("Link Not Found");
                        err.status = 404;
                        next(err);
                    } else res.json(link);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//Map routes
router.route('/maps')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        Map.find()
            .populate('mapGame')
            .exec(function(err, maps) {
                if (err) next(err);
                else res.json(maps);
            });
    })
    .post(auth.updater(), AWS.handleUpload(['mapImage']), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.map, Validators.messages)
            .then(function() {
                Map.create(req.body, function(err, map) {
                    if (err) next(err);
                    res.json(map);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/maps/:map_id')
    .delete(auth.updater(), function(req, res, next) {
        Map.findById(req.params.map_id, function(err, doc) {
            AWS.deleteImage(doc.mapImage)
                .then(function() {
                    doc.remove(function(err) {
                        if (err) next(err);
                        else res.sendStatus(204);
                    })
                }, function(err) {
                    next(err);
                })
        });
    })
    .get(auth.public_api(), function(req, res, next) {
        Map.findById(req.params.map_id)
        .populate('mapGame')
        .exec(function(err, map) {
            if (err) next(err);
            if (!map) {
                err = new Error("Map Not Found");
                err.status = 404;
                return next(err);
            }
            res.json(map);
        });
    })
    .put(auth.updater(), AWS.handleUpload(['mapImage']), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.map, Validators.messages)
            .then(function() {
                Map.findByIdAndUpdate(req.params.map_id, req.body, function(err, map) {
                    if (err) next(err);
                    if (!map) {
                        err = new Error("Map Not Found");
                        err.status = 404;
                        next(err);
                    } else res.json(map);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//Match routes
router.route('/matches')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        Match.find(function(err, matches) {
            if (err) next(err);
            res.json(matches);
        });
    })
    .post(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.match, Validators.messages)
            .then(function() {
                Match.create(req.body, function(err, match) {
                    if (err) next(err);
                    res.json(match);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/matches/:match_id')
    .delete(auth.updater(), function(req, res, next) {
        Match.remove({
            _id: req.param.match_id
        }, function(err, map) {
            if (err) next(err);
            res.sendStatus(204);
        });
    })
    .put(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.match, Validators.messages)
            .then(function() {
                Match.findByIdAndUpdate(req.params.match_id, req.body, function(err, match) {
                    if (err) next(err);
                    if (!match) {
                        err = new Error("Match Not Found");
                        err.status = 404;
                        next(err);
                    } else res.json(match);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//Organization routes
router.route('/organizations')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        Organization.find(function(err, organizations) {
            if (err) next(err);
            res.json(organizations);
        });
    })
    .post(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.organization, Validators.messages)
            .then(function() {
                Organization.create(req.body, function(err, org) {
                    if (err) next(err);
                    res.json(org);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/organizations/:organization_id')
    .delete(auth.updater(), function(req, res, next) {
        organization.remove({
            _id: req.params.organization_id
        }, function(err) {
            if (err) next(err);
            res.sendStatus(204);
        });
    })
    .put(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.organization, Validators.messages)
            .then(function() {
                Match.findByIdAndUpdate(req.params.organization_id, req.body, function(err, org) {
                    if (err) next(err);
                    if (!org) {
                        err = new Error("Organization Not Found");
                        err.status = 404;
                        next(err);
                    } else res.json(org);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//Round routes
router.route('/rounds')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        Round.find(function(err, rounds) {
            if (err) next(err);
            res.json(rounds);
        });
    })
    .post(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.round, Validators.messages)
            .then(function() {
                Round.create(req.body, function(err, round) {
                    if (err) next(err);
                    res.json(round);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/rounds/:round_id')
    .delete(auth.updater(), function(req, res, next) {
        Round.remove({
            _id: req.params.round_id
        }, function(err) {
            if (err) next(err);
            res.sendStatus(204);
        });
    })
    .put(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.round, Validators.messages)
            .then(function() {
                Match.findByIdAndUpdate(req.params.round_id, req.body, function(err, round) {
                    if (err) next(err);
                    if (!round) {
                        err = new Error("Round Not Found");
                        err.status = 404;
                        next(err);
                    } else res.json(round);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//Social media routes
router.route('/socialmedia')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        SocialMedia.find(function(err, socialmedia) {
            if (err) next(err);
            res.json(socialmedia);
        });
    })
    .post(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.socialMedia, Validators.messages)
            .then(function() {
                SocialMedia.create(req.body, function(err, socialmedia) {
                    if (err) next(err);
                    res.json(socialmedia);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/socialmedia/:socialmedia_id')
    .delete(auth.updater(), function(req, res, next) {
        SocialMedia.remove({
            _id: req.params.socialmedia_id
        }, function(err) {
            if (err) next(err);
            res.sendStatus(204);
        });
    })
    .put(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.socialMedia, Validators.messages)
            .then(function() {
                SocialMedia.findByIdAndUpdate(req.params.socialmedia_id, req.body, function(err, socialmedia) {
                    if (err) next(err);
                    if (!socialmedia) {
                        err = new Error("SocialMedia Not Found");
                        err.status = 404;
                        next(err);
                    } else res.json(socialmedia);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//Sponsor routes
router.route('/sponsors')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        Sponsor.find(function(err, sponsors) {
            if (err) next(err);
            res.json(sponsors);
        });
    })
    .post(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.sponsor, Validators.messages)
            .then(function() {
                Sponsor.create(req.body, function(err, sponsor) {
                    if (err) next(err);
                    res.json(sponsor);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/sponsors/:sponsor_id')
    .delete(auth.updater(), function(req, res, next) {
        Sponsor.remove({
            _id: req.params.sponsor_id
        }, function(err) {
            if (err) next(err);
            res.sendStatus(204);
        });
    })
    .put(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.sponsor, Validators.messages)
            .then(function() {
                Sponsor.findByIdAndUpdate(req.params.sponsor_id, req.body, function(err, sponsor) {
                    if (err) next(err);
                    if (!sponsor) {
                        err = new Error("Sponsor Not Found");
                        err.status = 404;
                        next(err);
                    } else res.json(sponsor);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//Team routes
router.route('/teams')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        Team.find(function(err, teams) {
            if (err) next(err);
            res.json(teams);
        });
    })
    .post(auth.updater(), AWS.handleUpload(['teamIcon']), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.team, Validators.messages)
            .then(function() {
                Team.create(req.body, function(err, team) {
                    if (err) next(err);
                    res.json(team);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/teams/:team_id')
    .delete(auth.updater(), function(req, res, next) {
        Team.findById(req.params.team_id, function(err, doc) {
            AWS.deleteImage(doc.teamIcon)
                .then(function() {
                    doc.remove(function(err) {
                        if (err) next(err);
                        else res.sendStatus(204);
                    })
                }, function(err) {
                    next(err);
                })
        });
    })
    .get(auth.public_api(), function(req, res, next) {
        Team.findById(req.params.team_id, function(err, team) {
            if (err) next(err);
            if (!team) {
                err = new Error("Team Not Found");
                err.status = 404;
                next(err);
            }
            res.json(team);
        });
    })
    .put(auth.updater(), AWS.handleUpload(['teamIcon']), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.team, Validators.messages)
            .then(function() {
                Team.findByIdAndUpdate(req.params.team_id, req.body, function(err, team) {
                    if (err) next(err);
                    if (!team) {
                        err = new Error("Team Not Found");
                        err.status = 404;
                        next(err);
                    } else res.json(team);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
//Event module routes
router.route('/eventmodules')
    .get(auth.public_api(), rateLimit, cache.route(), function(req, res, next) {
        EventModule.find(function(err, eventmodules) {
            if (err) next(err);
            res.json(eventmodules);
        });
    })
    .post(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.module, Validators.messages)
            .then(function() {
                EventModule.create(req.body, function(err, module) {
                    if (err) next(err);
                    res.json(module);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
router.route('/eventmodules/:eventmodule_id')
    .delete(auth.updater(), function(req, res, next) {
        EventModule.remove({
            _id: req.params.eventmodule_id
        }, function(err) {
            if (err) next(err);
            res.sendStatus(204);
        });
    })
    .put(auth.updater(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.module, Validators.messages)
            .then(function() {
                EventModule.findByIdAndUpdate(req.params.eventmodule_id, req.body, function(err, module) {
                    if (err) next(err);
                    if (!module) {
                        err = new Error("EventModule Not Found");
                        err.status = 404;
                        next(err);
                    } else res.json(module);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
// User stuff
router.route('/users')
    .get(auth.admin(), function(req, res, next) {
        User.find({}, 'username userRights', function(err, users) {
            if (err) next(err);
            res.json(users);
        });
    });
router.route('/users/:user_id')
    .delete(auth.admin(), function(req, res, next) {
        User.remove({
            _id: req.params.user_id
        }, function(err) {
            if (err) next(err);
            res.sendStatus(204);
        });
    })
    .put(auth.admin(), function(req, res, next) {
        Indicative.validateAll(req.body, Validators.user, Validators.messages)
            .then(function() {
                User.findByIdAndUpdate(req.params.user_id, req.body, function(err, user) {
                    if (err) next(err);
                    if (!user) {
                        err = new Error("User Not Found");
                        err.status = 404;
                        next(err);
                    } else res.json(user);
                });
            })
            .catch(function(errors) {
                var err = new Error("Bad Request");
                err.status = 400;
                err.errors = errors;
                next(err);
            });
    });
// 404 handler
router.use(function(req, res, next) {
    var err = new Error("Invalid API route");
    err.status = 404;
    next(err);
});
// prints stacktrace only in dev mode
router.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (err.status == 403 || err.status == 401 || err.status == 404 || err.status == 429) logger.warn(err);
    else logger.error(err);
    if (process.env.NODE_ENV == "development" || app.get('env') == "development") res.json({
        "status": err.status,
        "message": err.message,
        "errors": err.errors,
        "stack": err.stack
    });
    else res.json({
        "status": err.status,
        "errors": err.errors,
        "message": err.message
    });
});
module.exports = router;
