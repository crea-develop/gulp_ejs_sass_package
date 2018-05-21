// ====================
// to dist
// ====================

const gulp         = require('gulp');

const ejs          = require('gulp-ejs');
const beautify     = require('gulp-html-beautify');

const autoprefixer = require('gulp-autoprefixer');
const cssbeautify  = require('gulp-cssbeautify');
const sass         = require('gulp-sass');
const cssmin       = require('gulp-cssmin');

const uglify     = require('gulp-uglify-es').default;
const babel      = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

const imagemin     = require('gulp-imagemin');

const changed      = require('gulp-changed');
const concat       = require('gulp-concat');
const rename       = require('gulp-rename');
const plumber      = require('gulp-plumber');
const fs           = require('graceful-fs');
const del          = require('del');

const config = require('../config').default;
const paths = config.paths;

gulp.task('dist:default', [
    'dist:image',
    'dist:ejs',
    'dist:sass',
    'dist:js',
    'dist:others'
]);

gulp.task('dist:clean', function () {
    return del([paths.dist + '**/*']);
});

gulp.task('dist:image', function () {
    gulp
    .src(paths.image)
    .pipe(plumber())
    .pipe(changed(paths.pc.dist))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.pc.dist));
});


// [EJS]コンパイル
gulp.task('dist:ejs', function () {
    var json = {
        common : JSON.parse(fs.readFileSync('./json/common.json')),
        pages  : JSON.parse(fs.readFileSync('./json/pages.json'))
    };

    gulp
    .src(paths.ejs.src)
    .pipe(plumber())
    .pipe(changed(paths.pc.dist))
    .pipe(ejs(json, '', { ext : ".html" }))
    .on('error', function (error) {
        console.log(error.message);
        this.emit('end');
    })
    .pipe(gulp.dest(paths.pc.dist));
});

// [Sass]コンパイル、concat
gulp.task('dist:sass', ['dist:sass:default', 'dist:sass:pc', 'dist:sass:sp']);
gulp.task('dist:sass:default', function () {
    // assets/css/ 以下 以外のscssファイルをconcatせずにdistに吐き出す
    gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(changed(paths.pc.dist))
    .pipe(sass())
    .pipe(cssbeautify())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest(paths.pc.dist));
});
gulp.task('dist:sass:pc', function () {
    gulp.src(paths.pc.css.src)
    .pipe(plumber())
    .pipe(changed(paths.pc.css.dist))
    .pipe(sass())
    .pipe(cssbeautify())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.pc.css.dist));
});
gulp.task('dist:sass:sp', function () {
    gulp.src(paths.sp.css.src)
    .pipe(plumber())
    .pipe(changed(paths.sp.css.dist))
    .pipe(sass())
    .pipe(cssbeautify())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.sp.css.dist));
});

gulp.task('dist:js', ['dist:js:default', 'dist:js:common:pc', 'dist:js:common:sp']);
gulp.task('dist:js:default', function () {
    gulp.src(paths.js.src)
    .pipe(plumber())
    .pipe(changed(paths.pc.dist))
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(uglify({output: {comments: "/^!/"}}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.pc.dist));
});
gulp.task('dist:js:common:pc', function () {
    gulp.src(paths.pc.js.common)
    .pipe(plumber())
    .pipe(changed(paths.pc.js.dist))
    .pipe(concat('common.js'))
    .pipe(sourcemaps.init())
    // .pipe(babel({
    //     presets: ['env']
    // }))
    .pipe(uglify({output: {comments: "/^!/"}}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.pc.js.dist));
});
gulp.task('dist:js:common:sp', function () {
    gulp.src(paths.sp.js.common)
    .pipe(plumber())
    .pipe(changed(paths.sp.js.dist))
    .pipe(concat('common.js'))
    .pipe(sourcemaps.init())
    // .pipe(babel({
    //     presets: ['env']
    // }))
    .pipe(uglify({output: {comments: "/^!/"}}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.sp.js.dist));
});

gulp.task('dist:others', function () {
    gulp
    .src(paths.others)
    .pipe(plumber())
    .pipe(changed(paths.pc.dist))
    .pipe(gulp.dest(paths.pc.dist));
});