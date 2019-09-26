const gulp = require('gulp')
const ts = require('gulp-typescript')
const nodemon = require('gulp-nodemon')
const sourcemaps = require('gulp-sourcemaps')

const tsProject = ts.createProject('tsconfig.json')

function typescript() {
	return gulp
		.src(['api/**/*.ts'])
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.pipe(
			sourcemaps.write('.', {
				includeContent: false,
				sourceRoot: 'api/'
			})
		)
		.pipe(gulp.dest('dist/'))
}

function run(done) {
	nodemon({
		script: 'dist/index.js',
		ext: 'js',
		env: { NODE_ENV: 'development' },
		done,
		delay: 1000
	})
}

function watch() {
	gulp.watch(
		['api/**/*.ts'],
		{
			ignoreInitial: false
		},
		typescript
	)
}

exports.typescript = typescript
exports.watch = watch
exports.run = run
exports.default = gulp.parallel(typescript)
