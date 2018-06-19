var gulp = require("gulp");
var eslint = require("gulp-eslint");
var rollup = require("gulp-rollup");
var rename = require("gulp-rename");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");

var destFolder = "./dist";

gulp.task("default", function () {
    process.env.NODE_ENV = "release";
    return gulp.src("./src/**/*.js")
        // ----------- linting --------------
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError()) // --> failing if errors
        // ----------- rolling up --------------
        .pipe(rollup({
            format: "umd",
            moduleName: "LazyLoad",
            entry: "./src/lazyload.js"
        }))
        .pipe(rename("lazyload.es2015.js"))
        .pipe(gulp.dest(destFolder)) // --> writing rolledup
        // ----------- babelizing --------------
        .pipe(babel())
        .pipe(rename("lazyload.js"))
        .pipe(gulp.dest(destFolder)) // --> writing babelized ES5
        // ----------- minifying --------------
        .pipe(uglify())
        .pipe(rename("lazyload.min.js"))
        .pipe(gulp.dest(destFolder)); // --> writing uglified
});

gulp.task("watch", function () {
    gulp.watch("./src/**/*.js", ["default"]);
    // Other watchers
});