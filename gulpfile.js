const gulp = require('gulp');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const watchify = require('watchify');
const browserify = require('browserify');
const to5 = require('gulp-babel');
const less = require('gulp-less');
const scss = require('gulp-scss');
const path = require('path');
const react = require('gulp-react');
const reactify = require('reactify');

const bundler = watchify(browserify('./src/app.js', watchify.args)
                       .transform(reactify));

// add any other browserify options or transforms here
//bundler.transform('brfs');

gulp.task('default', bundle); // run the js task by default
gulp.task('js', bundle); // so you can run `gulp js` to build the file
bundler.on('update', bundle); // on any dep update, runs the bundler

function bundle() {
  return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.write('./')) // writes .map file
      .pipe(react())
      .pipe(buffer())
      .pipe(to5())
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      .pipe(gulp.dest('./dist/js'));
}

gulp.task('scss',function(){
    gulp.src('./scss/**/*.less')
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/css'));
    });
