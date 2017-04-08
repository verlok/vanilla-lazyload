module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		babel: {
			options: {
				sourceMap: false,
				presets: ['es2015'],
				plugins: ["transform-object-assign"]
			},
			dist: {
				files: {
					'dist/lazyload.transpiled.js': 'src/lazyload.js'
				}
			}
		},
		uglify: {
			options: {
				banner: '',
				sourceMap: true
			},
			dist: {
				files: {
					'dist/lazyload.min.js': 'src/lazyload.js',
					'dist/lazyload.transpiled.min.js': 'dist/lazyload.transpiled.js',
				}
			}
		},
		eslint: {
			options: {
            	configFile: ".eslintrc.json"
			},
			src: ["src/lazyload.js"]
		},
		watch: {
			files: ['<%= eslint.src %>'],
			tasks: ['eslint', 'babel', 'uglify']
		}
	});

	grunt.loadNpmTasks("gruntify-eslint");
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['eslint', 'babel', 'uglify']);
	grunt.registerTask('watch', ['eslint', 'babel', 'uglify', 'watch']);

};