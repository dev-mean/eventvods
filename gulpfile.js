//Include gulp
var gulp = require('gulp');

//Include plugins
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');


// prevent LESS from destroying watch task.

var plumber = require('gulp-plumber');

//Default task - watches
gulp.task('default', ['watch']);

//Build umbrella task
gulp.task('build', ['js-build', 'jade-build', 'css-build', 'img-build', 'less-build', 'bower-build', 'node-build']);

//Dev build
gulp.task('dev-build', ['build', 'node-dev-config-build']);

//Prod build
gulp.task('prod-build', ['build', 'node-prod-config-build']);

//Cleans deploy folder
gulp.task('clean', function() {
    return gulp.src('dist/')
        .pipe(clean());
});

//Building JS for deployment
gulp.task('js-build', function() {
    return gulp.src('src/public/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        //.pipe(uglify())
        .pipe(gulp.dest('dist/public/js'));
});

//Building html for deployment
gulp.task('jade-build', function() {
    return gulp.src('src/server/views/**/*.jade')
        .pipe(gulp.dest('dist/server/views'));
});

//Copy images
gulp.task('img-build', function() {
    return gulp.src('src/public/images/**/*.*')
        .pipe(gulp.dest('dist/public/images'));
});

gulp.task('css-build', function() {
    return gulp.src('src/public/css/**/*.css')
        .pipe(gulp.dest('dist/public/css'));
});

/*
gulp.task('less-build', function() {
    return gulp.src('src/public/less/style.less')
            .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(less())
        .pipe(gulp.dest('dist/public/css'));
}); */

gulp.task('less-build', function () {
    return gulp.src('src/public/less/style.less')
        .pipe(plumber({
            errorHandler: function(error) {
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
        .pipe(gulp.dest('dist/public/css'));
});


//Moving bower packages for deployment
gulp.task('bower-build', ['angular-build', 'jquery-build', 'fontawesome-build']);

gulp.task('angular-build', function() {
    return gulp.src('bower_components/angular/angular.min.js')
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('jquery-build', function() {
    return gulp.src('bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('fontawesome-build', function() {
    gulp.src('bower_components/fontawesome/css/font-awesome.min.css')
        .pipe(gulp.dest('dist/public/css'));
    gulp.src('bower_components/fontawesome/fonts/fontawesome-webfont.ttf')
        .pipe(gulp.dest('dist/public/fonts'));
    gulp.src('bower_components/fontawesome/fonts/fontawesome-webfont.woff')
        .pipe(gulp.dest('dist/public/fonts'));
    gulp.src('bower_components/fontawesome/fonts/fontawesome-webfont.woff2')
        .pipe(gulp.dest('dist/public/fonts'));
});

gulp.task('node-build', function() {
    return gulp.src(['src/server/**/*.js', '!src/server/config/*'])
        .pipe(gulp.dest('dist/server/'));
});

gulp.task('config-clean', function() {
    return gulp.src('dist/server/config/')
        .pipe(clean());
});

gulp.task('node-dev-config-build', ['config-clean'], function() {
    return gulp.src(['src/server/config/config.dev.js'])
        .pipe(rename('config.js'))
        .pipe(gulp.dest('dist/server/config'));
});

gulp.task('node-prod-config-build', ['config-clean'], function() {
    return gulp.src(['src/server/config/config.prod.js'])
        .pipe(rename('config.js'))
        .pipe(gulp.dest('dist/server/config'));
});

//Watcher task, monitors angular/node code to restart app and redeploy
gulp.task('watch', function() {
    gulp.watch('src/**/*', ['build']);
    
});
