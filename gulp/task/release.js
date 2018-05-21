// ====================
// to release
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

const replace = require('gulp-replace');
const changed = require('gulp-changed');
const concat  = require('gulp-concat');
const rename  = require('gulp-rename');
const plumber = require('gulp-plumber');
const fs      = require('graceful-fs');
const del     = require('del');

const config = require('../config').default;
const paths = config.paths;

// リリースファイル生成時にリプレースするテキスト
const replace_text = {
    pc : '<!-- === REPLACE PC TEXT === -->',
    sp : '<!-- === REPLACE SP TEXT === -->'
}
// リプレース内容の記述してあるファイルパス
const replace_file = {
    pc      : './tags/_replace_pc_text.html',
    sp      : './tags/_replace_sp_text.html'
};

gulp.task('release', [
    'release:image',
    'release:ejs',
    'release:sass',
    'release:js',
    'release:others'
]);

gulp.task('release:image', function () {
    gulp
    .src(paths.image)
    .pipe(plumber())
    .pipe(changed(paths.pc.release))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.pc.release));
});

// [EJS]コンパイル
gulp.task('release:ejs', ['release:ejs:pc', 'release:ejs:sp']);
gulp.task('release:ejs:pc', function () {
    var json = {
        common : JSON.parse(fs.readFileSync('./json/common.json')),
        pages  : JSON.parse(fs.readFileSync('./json/pages.json'))
    };

    var text = fs.readFileSync(replace_file.pc);

    gulp
    .src(paths.pc.ejs)
    .pipe(plumber())
    .pipe(changed(paths.pc.release))
    .pipe(ejs(json, '', { ext : ".html" }))
    .on('error', function (error) {
        console.log(error.message);
        this.emit('end');
    })
    .pipe(replace(replace_text.pc, text))
    .pipe(beautify())
    .pipe(gulp.dest(paths.pc.release));
});
gulp.task('release:ejs:sp', function () {
    var json = {
        common : JSON.parse(fs.readFileSync('./json/common.json')),
        pages  : JSON.parse(fs.readFileSync('./json/pages.json'))
    };

    var text = fs.readFileSync(replace_file.pc);

    gulp
    .src(paths.sp.ejs)
    .pipe(plumber())
    .pipe(changed(paths.sp.release))
    .pipe(ejs(json, '', { ext : ".html" }))
    .on('error', function (error) {
        console.log(error.message);
        this.emit('end');
    })
    .pipe(replace(replace_text.sp, text))
    .pipe(beautify())
    .pipe(gulp.dest(paths.sp.release));
});

// [Sass]コンパイル、concat
gulp.task('release:sass', ['release:sass:default', 'release:sass:pc', 'release:sass:sp']);
gulp.task('release:sass:default', function () {
    // assets/css/ 以下 以外のscssファイルをconcatせずにdistに吐き出す
    gulp.src(paths.css.src)
    .pipe(plumber())
    .pipe(changed(paths.pc.release))
    .pipe(sass())
    .pipe(cssbeautify())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest(paths.pc.release));
});
gulp.task('release:sass:pc', function () {
    gulp.src(paths.pc.css.src)
    .pipe(plumber())
    .pipe(changed(paths.pc.css.release))
    .pipe(sass())
    .pipe(cssbeautify())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.pc.css.release));
});
gulp.task('release:sass:sp', function () {
    gulp.src(paths.sp.css.src)
    .pipe(plumber())
    .pipe(changed(paths.sp.css.release))
    .pipe(sass())
    .pipe(cssbeautify())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.sp.css.release));
});

gulp.task('release:js', ['release:js:default', 'release:js:common:pc', 'release:js:common:sp']);
gulp.task('release:js:default', function () {
    gulp.src(paths.js.src)
    .pipe(plumber())
    .pipe(changed(paths.pc.release))
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(uglify({output: {comments: "/^!/"}}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.pc.release));
});
gulp.task('release:js:common:pc', function () {
    gulp.src(paths.pc.js.common)
    .pipe(plumber())
    .pipe(changed(paths.pc.js.release))
    .pipe(concat('common.js'))
    .pipe(sourcemaps.init())
    // .pipe(babel({
    //     presets: ['env']
    // }))
    .pipe(uglify({output: {comments: "/^!/"}}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.pc.js.release));
});
gulp.task('release:js:common:sp', function () {
    gulp.src(paths.sp.js.common)
    .pipe(plumber())
    .pipe(changed(paths.sp.js.release))
    .pipe(concat('common.js'))
    .pipe(sourcemaps.init())
    // .pipe(babel({
    //     presets: ['env']
    // }))
    .pipe(uglify({output: {comments: "/^!/"}}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.sp.js.release));
});

gulp.task('release:others', function () {
    gulp
    .src(paths.others)
    .pipe(plumber())
    .pipe(changed(paths.pc.release))
    .pipe(gulp.dest(paths.pc.release));
});