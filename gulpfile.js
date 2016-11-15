var autoprefixer 	= require('autoprefixer');
var cssnano 		= require('cssnano');
var gulp 			= require('gulp');
var less 			= require('gulp-less');
var postcss 		= require('gulp-postcss');
var sourcemaps 		= require('gulp-sourcemaps');
var gm				= require('gulp-gm');
var rename			= require('gulp-rename');
var uglify			= require('gulp-uglify');

gulp.task('watch', function(){
	gulp.watch('public/less/**/*.less', ['less-compile']);
});

gulp.task('default', ['build']);

// Build umbrella task
gulp.task('build', ['less-compile']);

gulp.task('less-compile', function () {
	return gulp.src(['public/less/backend.less','public/less/style.less'])
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(postcss([ autoprefixer({ browsers: ['last 3 versions'] }), cssnano() ]))
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest('public/css'));
});
gulp.task('header_pre', function(){
	return gulp.src("./input.jpg")
		.pipe(gm(function(file){
			return file.setFormat('jpg').quality(95).resize('2560').crop('2560','600');
		}))
		.pipe(rename("header.jpg"))
		.pipe(gulp.dest("./"))
})
gulp.task('header', ['header_pre'], function(){
	return gulp.src("./header.jpg")
		.pipe(gm(function(file){
			return file.crop(2560, 100, 0, 0).blur(25, 5)
		}))
		.pipe(rename("header_blur.jpg"))
		.pipe(gulp.dest("./"))
});
gulp.task('prod-build', function(){
	return gulp.src('public/js/**/*.js')
		.pipe(uglify({mangle: false}))
		.pipe(gulp.dest('public/js'));
})
