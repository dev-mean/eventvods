var fs = require('fs');
var path = require('path');
var filetype = require('file-type');
var Indicative = require('indicative');
var Q = require('q');
var id = require('shortid');
var file_type = require('file-type');
var Intimidate = require('intimidate');
var config = require('../../config/config.js');
var aws = require('aws-sdk');
var gm = require('gm');

const tmp = path.resolve(__dirname, '../../tmp');

var uploader = new Intimidate({
	key: config.aws.key,
	secret: config.aws.secret,
	bucket: config.aws.bucket
});
aws.config.update({
	accessKeyId: config.aws.key,
	secretAccessKey: config.aws.secret
});
var S3 = new aws.S3();

function jpegify(opts){
	var $promise = Q.defer();
	gm(opts.data)
		.setFormat("jpg")
		.toBuffer(function(err, res) {
			if (err) $promise.reject(err);
			opts.data = res;
			opts.type="image/jpeg";
			$promise.resolve(opts);
		})
	return $promise.promise;
}

function uploadImageBuffer(opts) {
	var $promise = Q.defer();
	uploader.uploadBuffer(opts.data, {
			'Content-Type': opts.type,
			'x-amz-acl': 'public-read'
		},
		opts.key,
		function(err) {
			if (err) $promise.reject(err);
			else $promise.resolve(opts);
		});
	return $promise.promise;
}

function headerBlur(opts) {
	var $promise = Q.defer();
	gm(opts.data).size(function(err, value) {
		var width = value.width;
		gm(opts.data)
			.crop(width, 100, 0, 0)
			.blur(25, 5)
			.toBuffer(function(err, res) {
				if (err) $promise.reject(err);
				opts.data = res;
				opts.key = opts.blur_key;
				$promise.resolve(opts);
			})
	});
	return $promise.promise;
}

function deleteOldImages(opts){
	return Q.all(
		[
			deleteImage(opts.oldURL),
			deleteImage(opts.oldBlurURL)
		]
	);
}

function handleImage(fileData, process) {
	var $promise = Q.defer();
	if (typeof fileData.image == "undefined" || typeof fileData.image === "string" || fileData.image == null) $promise.resolve(fileData);
	else {
		fileData.image.data = fileData.image.data.split(";base64,")[1];
		var data = new Buffer(fileData.image.data, 'base64');
		var type = file_type(data);
		if (type.mime.match('image')) {
			var filename = id.generate() + id.generate();
			var key = fileData.field + "/" + filename + "." + type.ext;
			if (process) {
				var opts ={
					data: data,
					key: key,
					blur_key: fileData.field + "/" + filename + "_b." + type.ext,
					oldURL: fileData.image.oldURL,
					oldBlurURL: (typeof fileData.image.oldURL === "string") ? fileData.image.oldURL.replace(".", "_b.") : null
				}
				jpegify(opts)
					.then(uploadImageBuffer)
					.then(headerBlur)
					.then(uploadImageBuffer)
					.then(deleteOldImages)
					.then(function() {
						fileData.image = config.aws.cdn + key;
						fileData.image_blur = config.aws.cdn + opts.blur_key;
						$promise.resolve(fileData);
					})
					.catch(function(err) {
						$promise.reject(err);
					});
			} else
				uploadImageBuffer({
					data: data,
					key: key,
					type: type.mime,
					oldURL: fileData.image.oldURL,
					oldBlurURL: null
				})
				.then(deleteOldImages)
				.then(function() {
					fileData.image = config.aws.cdn + key;
					$promise.resolve(fileData);
				})
		} else $promise.reject("Invalid or corrupt image provided for image: " + fileData.field);
	};
	return $promise.promise;
}
module.exports.handleUpload = function(fields) {
	return function(req, res, next) {
		Q.all(fields.map(function(field) {
				return handleImage({
					field: field,
					image: req.body[field]
				}, (field === 'header') ? true : false)
			}))
			.then(function(fileData) {
				fileData.forEach(function(item) {
					req.body[item.field] = item.image;
					if (typeof item.image_blur !== "undefined") req.body[item.field + "_blur"] = item.image_blur;
				});
				next();
			}, function(error) {
				console.log(error);
				var err = new Error("Bad Request");
				err.status = 400;
				err.errors = {
					message: error,
				};
				next(err);
			});
	}
}
var deleteImage = function(key) {
	var $promise = Q.defer();
	if (typeof key === "undefined" || key == null) $promise.resolve();
	else {
		key = key.replace(config.aws.cdn, "");
		S3.deleteObject({
			"Bucket": config.aws.bucket,
			"Key": key
		}, function(err, data) {
			if (err) $promise.reject(err);
			else $promise.resolve();
		});
	}
	return $promise.promise;
}
module.exports.deleteImage = deleteImage;
