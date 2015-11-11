const gulp = require('gulp'),
      gutil = require('gulp-util'),
      sourcemaps = require('gulp-sourcemaps'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      watchify = require('watchify'),
      browserify = require('browserify'),
      rename = require('gulp-rename'),
      to5 = require('gulp-babel'),
      //less = require('gulp-less'),
      scss = require('gulp-scss'),
      //path = require('path'),
      glob = require('glob'),
      react = require('gulp-react'),
      reactify = require('reactify'),
      es = require('event-stream'),
      removeUseStrict = require("gulp-remove-use-strict");


const bundler = watchify(browserify('./src/js/app.js', watchify.args)
                       .transform(reactify));

// add any other browserify options or transforms here
//bundler.transform('brfs');


/*
gulp.task('default', function(done) {
    glob('./src/js/**.js', function(err, files) {
        if(err) done(err);
        console.log(files);

        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .bundle()
                .pipe(buffer())
                .pipe(react())
                .pipe(buffer())
                .pipe(to5())
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(source(entry))
                .pipe(rename({
                    extname: '.bundle.js'
                }))
                .pipe(gulp.dest('./dist'));
        });
        es.merge(tasks).on('end', done);
    });
});
*/



gulp.task('js', bundle); // so you can run `gulp js` to build the file
gulp.task('default', bundle);
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
    gulp.src('./scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(scss())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/css'));
    });
