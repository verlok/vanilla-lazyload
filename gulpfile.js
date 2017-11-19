var gulp = require("gulp");
var uglify = require("gulp-uglify");
var eslint = require("gulp-eslint");
var rename = require("gulp-rename");
var babel = require("gulp-babel");
var rollup = require("gulp-rollup");

var destFolder = "./dist";

gulp.task("default", function () {
    return gulp.src("./src/**/*.js")
        // ----------- linting --------------
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        // ----------- rolling up --------------
        .pipe(rollup({
            format: "umd",
            moduleName: "LazyLoad",
            entry: "./src/lazyload.js"
        }))
        .pipe(rename("lazyload.es2015.js"))
        .pipe(gulp.dest(destFolder)) // --> writing rolledup
        // ----------- babelizing --------------
        .pipe(babel({
            presets: [["es2015", { "modules": false }]],
            sourceMap: false,
            plugins: ["transform-object-assign"]
        }))
        .pipe(rename("lazyload.js"))
        .pipe(gulp.dest(destFolder)) // --> writing babelized
        // ----------- minifying --------------
        .pipe(uglify())
        .pipe(rename("lazyload.min.js"))
        .pipe(gulp.dest(destFolder)); // --> writing uglified
});

gulp.task("watch", function () {
    gulp.watch("./src/**/*.js", ["default"]);
    // Other watchers
});