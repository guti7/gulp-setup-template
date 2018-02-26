var gulp = require('gulp'),
    jade = require('gulp-jade'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    streamify = require('gulp-streamify'),  // TODO: remove?
    gulpif = require('gulp-if'),
    sass = require('gulp-sass')
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect');

var env = process.env.NODE_ENV || 'development';

var outputDir = 'build/development';

gulp.task('jade', function() {
  return gulp.src('src/templates/**/*.jade')
         .pipe(jade())
         .pipe(gulp.dest('build/development'))
         .pipe(connect.reload());
});

gulp.task('js', function() {
  return gulp.src('src/js/main.js')
         .pipe(browserify({ debug: env == 'development' }))
         .pipe(gulpif(env === 'production', uglify()))
         .pipe(gulp.dest('build/development/js'))
         .pipe(connect.reload());
});

gulp.task('sass', function() {
  var config = {};

  if (env === 'development') {
    config.sourceComments = 'map';
  }

  if (env === 'production') {
    config.outputStyle = 'compressed';
  }
  return gulp.src('src/sass/main.scss')
         .pipe(sourcemaps.init())
         .pipe(sass(config).on('error', sass.logError))
         .pipe(sourcemaps.write())
         .pipe(gulp.dest('build/development/css'))
         .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('src/templates/**/*.jade', ['jade']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/sass/**/*.scss', ['sass']);
});

// gulp.task('connect', connect.server({
//   root: ['build/development'],
//   open: { browser: 'Google Chrome' }
// }));

gulp.task('connect', function() {
  connect.server({
    root: 'build/development',
    livereload: true
    // open: { browser: 'Google Chromre' } // not supported (one responsability)
  });
});

gulp.task('default', ['js', 'jade', 'sass', 'connect', 'watch']);
