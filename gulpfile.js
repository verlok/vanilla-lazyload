var gulp = require('gulp');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var babel = require('gulp-babel');
var rollup = require('gulp-rollup');
var jest = require('gulp-jest').default;

var destFolder = "./dist";

gulp.task('test', function() {
    process.env.NODE_ENV = 'test';
    return gulp.src('__tests__').pipe(jest({
        "preprocessorIgnorePatterns": [
          "<rootDir>/dist/", "<rootDir>/node_modules/"
        ],
        "automock": false
      }));
});

gulp.task('release', function () {
    process.env.NODE_ENV = 'release';
    return gulp.src("./src/**/*.js")
        // ----------- linting --------------
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        // ----------- rolling up --------------
        .pipe(rollup({
            format: "umd",
            moduleName: "LazyLoad",
            entry: './src/lazyload.js'
        }))
        .pipe(rename("lazyload.es2015.js"))
        .pipe(gulp.dest(destFolder)) // --> writing rolledup
        // ----------- babelizing --------------
        .pipe(babel())
        .pipe(rename("lazyload.js"))
        .pipe(gulp.dest(destFolder)) // --> writing babelized
        // ----------- minifying --------------
        .pipe(uglify())
        .pipe(rename("lazyload.min.js"))
        .pipe(gulp.dest(destFolder)) // --> writing uglified
        // ----------- notifying --------------
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});