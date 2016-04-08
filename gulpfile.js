var gulp        = require('gulp'),
    through2    = require('through2'),
    browserify  = require('browserify'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    plumber     = require('gulp-plumber'),
    rename      = require('gulp-rename'),
    babelify    = require('babelify'),
    debowerify  = require('debowerify'),
    browserSync = require('browser-sync').create(),
    clean       = require('gulp-clean');

var paths = {
    src: './src/',
    dist: './dist/',

    scriptsEntrypoint: './src/scripts/index.js',
    stylesEntryPoint: './src/styles/index.scss',

    imageDir: 'img/',

    scripts: 'scripts/**/*.js',
    styles: 'styles/**/*.scss',
    html: ['index.html'],
    images: 'img/**/*'
};


gulp.task('scripts', ['clean-scripts'], function() {
    return gulp.src(paths.scriptsEntrypoint)
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
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});
gulp.task('clean-scripts', function() {
    return gulp.src(paths.dist + 'build.js', { read: false })
        .pipe(plumber())
        .pipe(clean());
});


gulp.task('styles', ['clean-styles'], function() {
    return gulp.src(paths.stylesEntryPoint)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename('build.css'))
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});
gulp.task('clean-styles', function() {
    return gulp.src(paths.dist + 'build.css', { read: false })
        .pipe(plumber())
        .pipe(clean());
});


gulp.task('html', ['clean-html'], function() {
    return gulp.src(paths.src + paths.html)
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});
gulp.task('clean-html', function() {
    return gulp.src(paths.dist + '**/*.html', { read: false })
        .pipe(plumber())
        .pipe(clean());
});


gulp.task('images', ['clean-images'], function() {
    return gulp.src(paths.src + paths.images, { base: paths.src })
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});
gulp.task('clean-images', function() {
    return gulp.src(paths.dist + paths.imageDir, { read: false })
        .pipe(plumber())
        .pipe(clean());
});



gulp.task('serve', ['scripts', 'styles', 'html', 'images'], function() {
    browserSync.init({
        server: paths.dist
    });

    gulp.watch(paths.src + paths.scripts, ['scripts']);
    gulp.watch(paths.src + paths.styles, ['styles']);
    gulp.watch(paths.src + paths.html, ['html']);
    gulp.watch(paths.src + paths.images, ['images']);
});

gulp.task('clean', ['clean-scripts', 'clean-styles', 'clean-html', 'clean-images']);

gulp.task('default', ['scripts', 'styles', 'html', 'images']);
