var gulp 			= require('gulp');
var gutil 		= require('gulp-util');
var less 			= require('gulp-less');
var plumber 	= require('gulp-plumber');

gulp.task('watch', function(){
	gulp.watch('public/less/*.less', ['less-compile']);
});

gulp.task('default', ['build']);

// Build umbrella task
gulp.task('build', ['less-compile']);

gulp.task('less-compile', function () {
	return gulp.src('public/less/backend.less')
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

