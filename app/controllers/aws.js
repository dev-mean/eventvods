var Indicative = require('indicative');
var Q = require('q');
var id = require('shortid');
var file_type = require('file-type');
var Intimidate = require('intimidate');
var config = require('../../config/config.js');
var aws = require('aws-sdk');
var gm = require('gm');

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
		.setFormat("jpeg")
		.quality(95)
		.toBuffer(function(err, res) {
			if (err) $promise.reject(err);
			opts.data = res;
			opts.type="image/jpeg";
			$promise.resolve(opts);
		})
	return $promise.promise;
}
function headerCrop(opts){
	var $promise = Q.defer();
	gm(opts.data)
		.resize(2560)
		.crop(2560, 600, 0, 0)
		.toBuffer(function(err, res) {
			if (err) $promise.reject(err);
			opts.data = res;
			$promise.resolve(opts);
		})
	return $promise.promise;
}
function iconCrop(opts){
	var $promise = Q.defer();
	gm(opts.data)
		.resize(300)
		.crop(300, 300, 0, 0)
		.toBuffer(function(err, res) {
			if (err) $promise.reject(err);
			opts.data = res;
			$promise.resolve(opts);
		})
	return $promise.promise;
}
function uploadImageBuffer(opts) {
	var key = opts.key + "." + opts.ext;
	var $promise = Q.defer();
	uploader.uploadBuffer(opts.data, {
			'Content-Type': opts.type,
			'x-amz-acl': 'public-read'
		},
		key,
		function(err) {
			if (err) $promise.reject(err);
			else $promise.resolve(opts);
		});
	return $promise.promise;
}

function headerBlur(opts) {
	var $promise = Q.defer();
	gm(opts.data)
		.crop(2560, 100, 0, 0)
		.blur(25, 5)
		.toBuffer(function(err, res) {
			if (err) $promise.reject(err);
			opts.data = res;
			opts.key = opts.blur_key;
			$promise.resolve(opts);
		})
	return $promise.promise;
}

var deleteImage = function(key, del) {
	var $promise = Q.defer();
	if (typeof key === "undefined" || key == null || !del) $promise.resolve();
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

function deleteOldImages(opts){
	return Q.all(
		[
			deleteImage(opts.oldURL, opts.deleteOld),
			deleteImage(opts.oldBlurURL, opts.deleteOld),
			deleteImage(opts.oldBlurURL, opts.deleteOld)
		]
	);
}

function handleImage(fileData, process, func) {
	var $promise = Q.defer();
	if (typeof fileData.image == "undefined" || typeof fileData.image === "string" || fileData.image == null) $promise.resolve(fileData);
	else {
		fileData.image.data = fileData.image.data.split(";base64,")[1];
		var data = new Buffer(fileData.image.data, 'base64');
		var type = file_type(data);
		if (type.mime.match('image')) {
			var filename = id.generate() + id.generate();
			var key = fileData.field + "/" + filename;
			if (process && func === "header") {
				var opts ={
					data: data,
					key: key,
					blur_key: fileData.field + "/" + filename + "_b",
					ext: 'jpg',
					oldURL: fileData.image.oldURL,
					oldBlurURL: (typeof fileData.image.oldURL === "string") ? fileData.image.oldURL.replace(".jpg", "_b.jpg") : null,
					deleteOld: true
				}
				jpegify(opts)
					.then(headerCrop)
					.then(uploadImageBuffer)
					.then(headerBlur)
					.then(uploadImageBuffer)
					.then(deleteOldImages)
					.then(function() {
						fileData.image = config.aws.cdn + key + ".jpg";
						fileData.image_blur = config.aws.cdn + opts.blur_key + ".jpg";
						$promise.resolve(fileData);
					})
					.catch(function(err) {
						$promise.reject(err);
					});
			}
			else if (process && func === "photo"){
				var filename = id.generate() + id.generate();
				var key = fileData.field + "/" + filename;
				var opts ={
					data: data,
					key: key,
					ext: 'jpg',
					oldURL: fileData.image.oldURL,
					oldBlurURL: null,
					deleteOld: true
				}
				jpegify(opts)
					.then(iconCrop)
					.then(uploadImageBuffer)
					.then(deleteOldImages)
					.then(function() {
						fileData.image = config.aws.cdn + key + ".jpg";
						$promise.resolve(fileData);
					})
					.catch(function(err) {
						$promise.reject(err);
					});
			}
			else
				uploadImageBuffer({
					data: data,
					key: key,
					ext: type.ext,
					type: type.mime,
					oldURL: fileData.image.oldURL,
					oldBlurURL: null,
					deleteOld: true
				})
				.then(deleteOldImages)
				.then(function() {
					fileData.image = config.aws.cdn + key + "."+ type.ext;
					$promise.resolve(fileData);
				})
		} else $promise.reject("Invalid or corrupt image provided for image: " + fileData.field);
	};
	return $promise.promise;
}
module.exports.handleUpload = function(fields) {
	return function(req, res, next) {
		Q.all(fields.map(function(field) {
				switch(field){
					case "header":
						return handleImage({
							field: field,
							image: req.body[field]
						}, true, "header");
					case "photo":
						return handleImage({
							field: field,
							image: req.body[field]
						}, true, "photo");
					default:
						return handleImage({
							field: field,
							image: req.body[field]
						}, false)
				}
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
module.exports.deleteImage = deleteImage;
