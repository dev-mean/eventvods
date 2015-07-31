module.exports = {
    databaseUrl : 'mongodb://' + process.env.IP + ':27017',
    port : process.env.PORT || 3000,
    ip : process.env.IP || "localhost",
}