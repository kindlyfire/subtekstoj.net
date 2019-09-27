const gulp = require('gulp')
const ts = require('gulp-typescript')
const nodemon = require('gulp-nodemon')
const sourcemaps = require('gulp-sourcemaps')

const sass = require('gulp-sass')
sass.compiler = require('node-sass')

const tsProject = ts.createProject('tsconfig.json')

function typescript() {
    return gulp
        .src(['app/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(
            sourcemaps.write('.', {
                includeContent: false,
                sourceRoot: 'app/'
            })
        )
        .pipe(gulp.dest('dist/'))
}

function copyViews() {
    return gulp.src(['app/views/**/*.pug']).pipe(gulp.dest('dist/views/'))
}

function copyAssets() {
    return gulp.src(['app/public/**/*']).pipe(gulp.dest('dist/public/'))
}

function styles() {
    return gulp
        .src('app/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/public/css/'))
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
    const watchOptions = {
        ignoreInitial: false
    }

    gulp.watch(['app/**/*.ts'], watchOptions, typescript)
    gulp.watch(['app/styles/**/*.scss'], watchOptions, styles)
    gulp.watch(['app/public/**/*'], watchOptions, copyAssets)
    gulp.watch(['app/views/**/*.pug'], watchOptions, copyViews)
}

exports.typescript = typescript
exports.watch = watch
exports.run = run
exports.copyViews = copyViews
exports.copyAssets = copyAssets
exports.styles = styles

exports.copy = gulp.parallel(copyViews, copyAssets)
exports.default = gulp.parallel(typescript, copyViews, styles, copyAssets)
