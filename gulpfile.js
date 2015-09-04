'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var useref = require('gulp-useref');
var del = require('del');
var concat = require('gulp-concat');
var babel = require('gulp-babel');

// =============================================================================
//                            Development
// =============================================================================

// build the tmp folder that is where things are actually served from in development
gulp.task('tmp', ['vendor', 'css', 'js', 'json']);

  gulp.task('clean', function(cb) {
    return del(['tmp']);
  });

  // compile js
  gulp.task('js', ['clean'], function () {
    return gulp.src('app/scripts/**/*.js')
      .pipe(concat('main.js'))
      .pipe(babel())
      .pipe(gulp.dest('tmp'));
  });

  // compile css
  gulp.task('css', ['vendor'], function() {
    gulp.src('app/styles/**/*')
      .pipe(gulp.dest('tmp/styles'));
  });

  // compile vendor files
  gulp.task('vendor', ['js'], function() {
    var assets = useref.assets();
    return gulp.src('app/index.html')
      .pipe(assets)
      .pipe(assets.restore())
      .pipe(useref())
      .pipe(gulp.dest('tmp'));
  });

  //compile json
  gulp.task('json', ['vendor'], function() {
    gulp.src('app/json/**/*.json')
      .pipe(gulp.dest('tmp/json'));
  })

// make watch task that watches src code and compiles it into tmp
gulp.task('watch', function() {
  gulp.watch(['app/**/*'], ['tmp']);
});

// make a connect task that makes and connects to server that loads static files from tmp
gulp.task('connect', function () {
  connect.server({
    root: 'tmp',
    port: 3000,
    livereload: true
  });
});

// make a default task that starts the watch task, starts the connect task, and then starts the reload task
gulp.task('default', ['tmp', 'watch', 'connect'], function() {
  gulp.watch('tmp/**/*', ['reload']);
});

gulp.task('reload', function() {
  return gulp.src('tmp')
    .pipe(connect.reload());
});

// =============================================================================
//                            Distribution
// =============================================================================

// make a dist folder that is like the tmp folder but for 'production', so minified etc

// make a build task that builds the dist folder based on current app state
