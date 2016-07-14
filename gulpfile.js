var autoprefixer 	= require('autoprefixer');
var cssnano 		= require('cssnano');
var gulp 			= require('gulp');
var less 			= require('gulp-less');
var postcss 		= require('gulp-postcss');
var sourcemaps 		= require('gulp-sourcemaps');

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
		.pipe(postcss([ autoprefixer({ browsers: ['last 3 versions'] }) ]))
		//.pipe(postcss([ autoprefixer({ browsers: ['last 3 versions'] }), cssnano() ]))
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest('public/css'));
});

