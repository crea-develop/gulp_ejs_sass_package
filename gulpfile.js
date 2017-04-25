var gulp = require('gulp');

var ejs = require('gulp-ejs');
var prettify = require('gulp-prettify');

var imagemin = require('gulp-imagemin');

var uglify = require('gulp-uglify');

var autoprefixer    = require('gulp-autoprefixer');
var cssbeautify     = require('gulp-cssbeautify');
var cssmin          = require('gulp-cssmin');
var sass            = require('gulp-sass');

var changed     = require('gulp-changed');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');
var plumber     = require('gulp-plumber');
var fs          = require('graceful-fs');




var paths = {
    dist        : 'dist/',
    ejs        : 'src/**/*.ejs',
    ejsnot        : '!src/**/_*.ejs',
    image       : 'src/**/*.+(jpg|gif|png)',
    sass         : {
        pc      : 'src/assets/css/*.scss',
        sp      : 'src/sp/assets/css/*.scss',
        src     : 'src/**/*.scss',
        dist    : {
            pc  : 'dist/assets/css/',
            sp  : 'dist/sp/assets/css/'
        }
    },
    js          : {
        pc      : 'src/assets/js/*.js',
        sp      : 'src/sp/assets/js/*.js',
        src     : 'src/**/*.js',
        dist    : {
            pc  : 'dist/assets/js/',
            sp  : 'dist/sp/assets/js/'
        }
    }
};

var common_js_sort_pc = [
'src/assets/js/common/jquery-3.2.0.min.js',
'src/assets/js/common/jquery.easing.js'
];

var common_js_sort_sp = [
'src/sp/assets/js/common/jquery-3.2.0.min.js',
'src/sp/assets/js/common/jquery.easing.js'
];


// =======================================================
//    Common tasks
// =======================================================

// 画像の圧縮タスク
// ====================
gulp.task('image', function() {
    gulp
    .src(paths.image)
    .pipe(plumber(paths.image))
    .pipe(changed(paths.dist))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist));
});

// EJSのコンパイル・整形タスク
// ====================
gulp.task('ejs', function () {
    var json = JSON.parse(fs.readFileSync('./ejs_setting.json'));
    gulp
    .src([paths.ejs, paths.ejsnot])
    .pipe(plumber(paths.ejs))
    .pipe(changed(paths.dist))
    .pipe(ejs(json, '', {
        ext   : ".html"
    }))
    .on('error', function (error) {
        // エラー時にdistにejsファイルを吐き出さないようにする
        console.log(error.message); this.emit('end');
    })
    .pipe(prettify())
    .pipe(gulp.dest(paths.dist));
});

// sassのコンパイル・minifyタスク
// ====================
gulp.task('sass', ['sass_pc', 'sass_sp']);

// jsのminifyタスク
// ====================
gulp.task('js', ['main_js', 'common_js', 'main_js_sp', 'common_js_sp']);

// 監視タスク
// ====================
gulp.task('watch', function() {
    gulp.watch(paths.ejs, ['ejs']);
    gulp.watch(paths.sass.src, ['sass']);
    gulp.watch(paths.js.src,   ['js']);
});

// 一括処理タスク
// ====================
gulp.task('default', ['ejs', 'sass', 'js', 'image']);


// =======================================================
//    PC tasks
// =======================================================

// CSS concat & minify task
gulp.task('sass_pc', function () {
    gulp
    .src(paths.sass.pc)
    .pipe(plumber(paths.sass.pc))
    .pipe(changed(paths.sass.dist.pc))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(cssmin())
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.sass.dist.pc));
});

//  JavaScript minify task
gulp.task('main_js', function() {
    gulp
    .src(paths.js.pc)
    .pipe(plumber())
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(changed(paths.js.dist.pc))
    .pipe(gulp.dest(paths.js.dist.pc));
});

//  JavaScript concat & minify task
gulp.task('common_js', function() {
    gulp
    .src(common_js_sort_pc) // gulp/config.jsで設定
    .pipe(plumber())
    .pipe(uglify({preserveComments: 'some'})) // minify
    .pipe(changed(paths.js.dist.pc))
    .pipe(concat('common.js'))                // 結合
    .pipe(gulp.dest(paths.js.dist.pc));
});



// =======================================================
//    SP tasks
// =======================================================

// CSS concat & minify task
gulp.task('sass_sp', function () {
    gulp
    .src(paths.sass.sp)
    .pipe(plumber(paths.sass.sp))
    .pipe(changed(paths.sass.dist.sp))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(cssmin())
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.sass.dist.sp));
});

//  JavaScript minify task
gulp.task('main_js_sp', function() {
    gulp
    .src(paths.js.sp)
    .pipe(plumber())
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(changed(paths.js.dist.sp))
    .pipe(gulp.dest(paths.js.dist.sp));
});

//  JavaScript concat & minify task
gulp.task('common_js_sp', function() {
    gulp
    .src(common_js_sort_sp) // gulp/config.jsで設定
    .pipe(plumber())
    .pipe(uglify({preserveComments: 'some'})) // minify
    .pipe(changed(paths.js.dist.sp))
    .pipe(concat('common.js'))                // 結合
    .pipe(gulp.dest(paths.js.dist.sp));
});