var fs = require( 'fs' );
var path = require( 'path' );
var filetype = require( 'file-type' );
var Indicative = require( 'indicative' );
var Q = require( 'q' );
var id = require( 'shortid' );
var file_type = require( 'file-type' );
const FS_BASE = path.resolve( 'public/images' );
const WEB_BASE = '/assets/images';

function handleImage( fileData ) {
    var $promise = Q.defer();
    if ( typeof fileData.image == "undefined"  || fileData.image == null || !fileData.image.match( 'base64' ) ) $promise.resolve( fileData );
    else {
        fileData.image = fileData.image.split( ";base64," )[ 1 ];
        var file = new Buffer( fileData.image, 'base64' );
        var type = file_type( file );
        if ( type.mime.match( 'image' ) ) {
            fileData.image = file
            var sid = id.generate();
            var rel = '/' + fileData.field + '/' + sid + '.' + type.ext;
            var full_path = path.resolve( FS_BASE + rel );
            var web_path = WEB_BASE + rel;
            fs.writeFile( full_path, fileData.image, function( err ) {
                if ( err ) $promise.reject( err.message );
                fileData.image = web_path;
                $promise.resolve( fileData );
            } );
        } else $promise.reject( "Invalid or corrupt image provided for field " + fileData.field );
    };
    return $promise.promise;
}
module.exports.handleUpload = function( fields ) {
    return function( req, res, next ) {
        Q.all( fields.map( function( field ) {
                return handleImage( {
                    field: field,
                    image: req.body[ field ]
                } )
            } ) )
            .then( function( fileData ) {
            	fileData.forEach(function(item){
            		req.body[ item.field ] = item.image;
            	});
                next();
            }, function( error ) {
                var err = new Error( "Bad Request" );
                err.status = 400;
                err.errors = {
                    message: error,
                };
                console.log( err );
                next( err );
            } );
    }
}