module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		eslint: {
			options: {
				configFile: ".eslintrc.json"
			},
			src: ["src/lazyload.*.js"]
		},
		rollup: {
			options: {
				"format": "umd",
				"moduleName": "LazyLoad"
			},
			files: {
				src: "src/lazyload.core.js",
				dest: "dist/lazyload.js"
			}
		},
		babel: {
			options: {
				sourceMap: false,
				presets: [["es2015", { "modules": false }]],
				plugins: ["transform-object-assign"]
			},
			dist: {
				files: {
					"dist/lazyload.transpiled.js": "dist/lazyload.js"
				}
			}
		},
		uglify: {
			options: {
				banner: "",
				sourceMap: false
			},
			dist: {
				files: {
					"dist/lazyload.transpiled.min.js": "dist/lazyload.transpiled.js",
				}
			}
		},
		watch: {
			files: ["<%= eslint.src %>"],
			tasks: ["eslint", "babel", "uglify"]
		}
	});

	grunt.loadNpmTasks("gruntify-eslint");
	grunt.loadNpmTasks("grunt-babel");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-rollup");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("default", ["eslint", "rollup", "babel", "uglify"]);
	grunt.registerTask("w", ["eslint", "rollup", "babel", "uglify", "watch"]);

};