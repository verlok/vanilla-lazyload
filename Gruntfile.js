module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		babel: {
			options: {
				sourceMap: false,
				presets: ['es2015']
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
		jshint: {
			files: ['Gruntfile.js', 'src/lazyload.js'],

			options: {
				// options here to override JSHint defaults
				reporterOutput: '',
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				},
				'esnext': true
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint', 'babel', 'uglify']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jshint', 'babel', 'uglify', 'watch']);
	grunt.registerTask('publish', ['jshint', 'babel', 'uglify']);

};