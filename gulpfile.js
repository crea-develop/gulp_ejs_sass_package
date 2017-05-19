var gulp = require('gulp');

var ejs             = require('gulp-ejs');
var prettify        = require('gulp-prettify');

var imagemin        = require('gulp-imagemin');

var uglify          = require('gulp-uglify');

var autoprefixer    = require('gulp-autoprefixer');
var cssbeautify     = require('gulp-cssbeautify');
var cssmin          = require('gulp-cssmin');
var sass            = require('gulp-sass');

var changed         = require('gulp-changed');
var concat          = require('gulp-concat');
var rename          = require('gulp-rename');
var plumber         = require('gulp-plumber');
var replace         = require('gulp-replace');
var fs              = require('graceful-fs');
var del             = require('del');




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
    },
    other : 'src/**/*.!(jpg|gif|png|php|html|scss|css|*.scss|*.css|js|*.js|ejs)',
    release     : {
        dist    : 'release',
        html    : 'dist/**/*.+(html|php)',
        image   : 'dist/**/*.+(jpg|gif|png)',
        js      : 'dist/**/*.js',
        css     : 'dist/**/*.css',
        other   : 'dist/**/*.!(html|php)'
    }
};

// =======================================================
// パスの書き換え設定
// =======================================================
// 書き換え前のパスのパターン
var replace_path_pattern = /(\.\.\/)*assets\//g;
// 書き換えるURL
var replace_url = 'http://replace.url/assets/';

// =======================================================
// リリース用ファイル生成に関する設定
// =======================================================
// リリースファイル生成時にリプレースするテキスト
var replace_text = {
    pc : '<!-- === REPLACE PC TEXT === -->',
    sp : '<!-- === REPLACE SP TEXT === -->'
}
// リプレース内容の記述してあるファイルパス
var replace_file = {
    pc : './_replace_pc_text.html',
    sp : './_replace_sp_text.html'
};

// =======================================================
// common.jsに結合するjsファイルの一覧
// =======================================================
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

// HTML, CSS, JS, 画像以外のファイルをdistにコピーする
gulp.task('copy', function () {
    gulp
    .src(paths.other)
    .pipe(gulp.dest(paths.dist));
});

// 監視タスク
// ====================
gulp.task('watch', function() {
    gulp.watch(paths.ejs, ['ejs']);
    gulp.watch(paths.sass.src, ['sass']);
    gulp.watch(paths.js.src,   ['js']);
    gulp.watch(paths.other, ['copy']);
});

// 一括処理タスク
// ====================
gulp.task('default', ['ejs', 'sass', 'js', 'image', 'copy']);

// distの中身を全削除
// ※※※　distの中だけに動画ファイルとかおいていると全部消えるのでお気をつけください　※※※
gulp.task('clean', function () {
    return del([paths.dist + '**/*']);
});


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


// リリース用ファイルの生成
// ====================
gulp.task('release', ['release_html', 'release_copy']);
gulp.task('release_html', function () {
    var pc_text = fs.readFileSync(replace_file.pc);
    var sp_text = fs.readFileSync(replace_file.sp);
    gulp
    .src(paths.release.html)
    .pipe(plumber())
    .pipe(replace(replace_text.pc, pc_text))
    .pipe(replace(replace_text.sp, sp_text))
    .pipe(prettify())
    .pipe(gulp.dest(paths.release.dist));
});
gulp.task('release_copy', function () {
    gulp
    .src(paths.release.other)
    .pipe(gulp.dest(paths.release.dist));
});


// パスの書き換え
// ====================
gulp.task('release_path', function () {
    gulp
    .src([paths.release.html, paths.release.css, paths.release.js])
    .pipe(replace(replace_path_pattern, replace_url))
    .pipe(gulp.dest(paths.release.dist));
});