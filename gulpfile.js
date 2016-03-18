var gulp        = require('gulp'),
    through2    = require('through2'),
    browserify  = require('browserify'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    plumber     = require('gulp-plumber'),
    rename      = require('gulp-rename'),
    babelify    = require('babelify'),
    debowerify  = require('debowerify'),
    browserSync = require('browser-sync').create();

gulp.task('scripts', function() {
    return gulp.src('scripts/index.js')
        .pipe(plumber())
        .pipe(through2.obj(function(file, enc, next) {
            browserify(file.path, { debug: true })
                .transform('babelify', { presets: ['es2015'] })
                .transform('debowerify')
                .bundle(function(err, res) {
                    if (err) {
                        return next(err);
                    }
                    file.contents = res;
                    next(null, file);
                });
        }))
        .on('error', function (error) {
            console.log(error.stack);
            this.emit('end')
        })
        .pipe(rename('build.js'))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
});

gulp.task('styles', function() {
    return gulp.src('styles/index.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename('build.css'))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['scripts', 'styles'], function() {
    browserSync.init({
        server: './'
    });

    gulp.watch('scripts/**/*.js', ['scripts']);
    gulp.watch('styles/**/*.scss', ['styles']);
});

gulp.task('default', ['scripts', 'styles']);
