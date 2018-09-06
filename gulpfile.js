var gulp        = require('gulp'),
    typescript  = require('typescript'),
    tsify       = require('tsify'),
    ts          = require('gulp-typescript'),
    browserify  = require('browserify'),
    babelify    = require('babelify'),
    source      = require('vinyl-source-stream');

var project = ts.createProject('tsconfig.json', {typescript: typescript});

gulp.task('watch', function () {
    gulp.watch('./src/**/*{ts,tsx}', ['bundle']);
  });

gulp.task('through', function () {
  return gulp
    .src(['src/index.html'])
    .pipe(gulp.dest('./'));
});

gulp.task('compile', function () {
  var result = gulp.src('src/**/*{ts,tsx}')
    .pipe(project());
  return result.js.pipe(gulp.dest('./tmp'));
});

gulp.task('bundle', ['through','compile'], function () {
  var b = browserify('./tmp/Main.js');
  return b.transform(babelify, {
        presets: ['@babel/preset-env','@babel/preset-typescript','@babel/preset-flow'],
	plugins: [['babel-plugin-inferno',{"imports": true}]] 
    }).plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./'))
  ;
});

