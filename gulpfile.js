var gulp 			= require('gulp');
var gutil 		= require('gulp-util');
var jshint 		= require('gulp-jshint');
var concat 		= require('gulp-concat');
var uglify 		= require('gulp-uglify');
var rename 		= require('gulp-rename');
var less 			= require('gulp-less');
var nodemon 	= require('gulp-nodemon');
var plumber 	= require('gulp-plumber');


gulp.task('default', ['build']);

// Build umbrella task
gulp.task('build', ['less-compile']);

gulp.task('less-compile', function () {
	return gulp.src('public/less/style.less')
		.pipe(plumber({
			errorHandler: function (error) {
				gutil.log(
					gutil.colors.cyan('Plumber') + gutil.colors.red(' found unhandled error:\n'),
					error.toString()
				);
				this.emit('end');
			}
		}))
		.pipe(less())
		// ... more pipes ...
		.pipe(plumber.stop())
		.pipe(gulp.dest('public/css'));
});


