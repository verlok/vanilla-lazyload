var gulp = require('gulp');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var babel = require('gulp-babel');

var entryPoint = "src/lazyload.js";
var destFolder = 'dist/js';
var minifiedSuffix = '.min';

gulp.task('scripts', function () {
    return gulp.src(entryPoint)
        // ----------- linting --------------
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(gulp.dest(destFolder)) // --> writing non uglified
        // ----------- babelizing --------------
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(rename({
            suffix: "-babelized"
        }))
        .pipe(gulp.dest(destFolder)) // --> writing babelized
        // ----------- minifying --------------
        .pipe(uglify())
        .pipe(rename({
            suffix: minifiedSuffix
        }))
        .pipe(gulp.dest(destFolder)) // --> writing uglified
        // ----------- notifying --------------
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});