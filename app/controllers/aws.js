var fs = require( 'fs' );
var path = require( 'path' );
var filetype = require( 'file-type' );
var Indicative = require( 'indicative' );
var Q = require( 'q' );
var id = require( 'shortid' );
var file_type = require( 'file-type' );
var Intimidate = require( 'intimidate' );
var config = require( '../../config/config.js' );
var aws = require( 'aws-sdk' );
var uploader = new Intimidate( {
    key: config.aws.key,
    secret: config.aws.secret,
    bucket: config.aws.bucket
} );
aws.config.update( {
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret
} );
var S3 = new aws.S3();

function handleImage( fileData ) {
    var $promise = Q.defer();
    if ( typeof fileData.image == "undefined" || typeof fileData.image === "string" || fileData.image == null ) $promise.resolve( fileData );
    else {
        fileData.image.data = fileData.image.data.split( ";base64," )[ 1 ];
        var data = new Buffer( fileData.image.data, 'base64' );
        var type = file_type( data );
        if ( type.mime.match( 'image' ) ) {
            var key;
            if ( fileData.image.changed ) key = fileData.image.oldURL.replace( config.aws.cdn, "" );
            else key = fileData.field + "/" + id.generate() + "/" + id.generate() + "." + type.ext;
            uploader.uploadBuffer( data, {
                'Content-Type': type.mime,
                'x-amz-acl': 'public-read'
            }, key, function( err, res ) {
                if ( err ) $promise.reject( "S3 upload error: " + err.message );
                fileData.image = config.aws.cdn + key;
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
                fileData.forEach( function( item ) {
                    req.body[ item.field ] = item.image;
                } );
                next();
            }, function( error ) {
                var err = new Error( "Bad Request" );
                err.status = 400;
                err.errors = {
                    message: error,
                };
                next( err );
            } );
    }
}
module.exports.deleteImage = function( key ) {
    var $promise = Q.defer();
    if ( typeof key === "undefined" ) $promise.resolve();
    else {
        key = key.replace( config.aws.cdn, "" );
        S3.deleteObject( {
            "Bucket": config.aws.bucket,
            "Key": key
        }, function( err, data ) {
            if ( err ) $promise.reject( err );
            else $promise.resolve();
        } );
    }
    return $promise.promise;
}
