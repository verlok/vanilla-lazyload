var gulp = require("gulp");
var eslint = require("gulp-eslint");
var rollup = require("gulp-rollup");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify-es").default;

var destFolder = "./dist";

gulp.task("lint", function() {
	process.env.NODE_ENV = "release";
	return (
		gulp.
			src("./src/**/*.js").
			// ----------- linting --------------
			pipe(eslint()).
			pipe(eslint.format()).
			pipe(eslint.failAfterError()) // --> failing if errors
	);
});

// browser-friendly UMD build
gulp.task("dist-umd", function() {
	process.env.NODE_ENV = "release";
	return (
		gulp.
			src("./src/**/*.js").
			pipe(sourcemaps.init()).
			// ----------- rolling up --------------
			pipe(
				rollup({
					output: { name: "LazyLoad", format: "umd" },
					input: "./src/lazyload.js"
				})
			).
			// ----------- babelizing --------------
			pipe(babel()).
			pipe(rename("lazyload.js")).
			pipe(gulp.dest(destFolder)). // --> writing babelized ES5
			// ----------- minifying --------------
			pipe(uglify()).
			pipe(rename("lazyload.min.js")).
			pipe(sourcemaps.write("")). // --> writing sourcemap
			pipe(gulp.dest(destFolder)) // --> writing uglified
	);
});

// requireJS-friendly AMD build
gulp.task("dist-amd", function() {
	process.env.NODE_ENV = "release";
	return (
		gulp.
			src("./src/**/*.js").
			pipe(sourcemaps.init()).
			// ----------- rolling up --------------
			pipe(
				rollup({
					output: { name: "LazyLoad", format: "amd" },
					input: "./src/lazyload.js"
				})
			).
			// ----------- babelizing --------------
			pipe(babel()).
			pipe(rename("lazyload.amd.js")).
			pipe(gulp.dest(destFolder)). // --> writing babelized ES5
			// ----------- minifying --------------
			pipe(uglify()).
			pipe(rename("lazyload.amd.min.js")).
			pipe(sourcemaps.write("")). // --> writing sourcemap
			pipe(gulp.dest(destFolder)) // --> writing uglified
	);
});

// ES module (for bundlers) build.
gulp.task("dist-esm", function() {
	process.env.NODE_ENV = "release";
	return (
		gulp.
			src("./src/**/*.js").
			// ----------- rolling up --------------
			pipe(
				rollup({
					output: { name: "LazyLoad", format: "es" },
					input: "./src/lazyload.js"
				})
			).
			pipe(rename("lazyload.esm.js")).
			pipe(
				gulp.dest(destFolder)
			) /* // --> writing rolledup
			// ----------- minifying --------------
			pipe(uglify()).
			pipe(rename("lazyload.esm.min.js")).
			pipe(sourcemaps.write("")). // --> writing sourcemap
			pipe(gulp.dest(destFolder)) // --> writing uglified*/
	);
});

// IIFE module (for browsers) build.
gulp.task("dist-iife", function() {
	process.env.NODE_ENV = "release";
	return (
		gulp.
			src("./src/**/*.js").
			pipe(sourcemaps.init()).
			// ----------- rolling up --------------
			pipe(
				rollup({
					output: { name: "LazyLoad", format: "iife" },
					input: "./src/lazyload.js"
				})
			).
			// ----------- babelizing --------------
			pipe(babel()).
			pipe(rename("lazyload.iife.js")).
			pipe(gulp.dest(destFolder)). // --> writing babelized ES5
			// ----------- minifying --------------
			pipe(uglify()).
			pipe(rename("lazyload.iife.min.js")).
			pipe(sourcemaps.write("")). // --> writing sourcemap
			pipe(gulp.dest(destFolder)) // --> writing uglified
	);
});

gulp.task("watch", function() {
	gulp.watch(
		"./src/**/*.js",
		gulp.series(
			"lint",
			gulp.parallel("dist-umd", "dist-esm", "dist-amd", "dist-iife")
		)
	);
});

gulp.task(
	"default",
	gulp.series(
		"lint",
		gulp.parallel("dist-umd", "dist-esm", "dist-amd", "dist-iife")
	)
);
