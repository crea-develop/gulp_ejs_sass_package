
const common_js_pc = [
    'src/assets/js/common/jquery-3.2.0.min.js',
    'src/assets/js/common/jquery.easing.js'
];
const common_js_sp = [
    'src/sp/assets/js/common/jquery-3.2.0.min.js',
    'src/sp/assets/js/common/jquery.easing.js'
];

const assets_folder_path = 'assets/';
const css_folder_path    = assets_folder_path + 'css/';
const js_folder_path     = assets_folder_path + 'js/';

const other_extension    = '(scss|*.scss|js|*.js|ejs|*.ejs|jpg|gif|png|*.jpg|*.gif|*.png)';

var paths = {
    image  : 'src/**/*.+(jpg|gif|png)',
    others : 'src/**/*.!' + other_extension,
    ejs    : {
        watch : 'src/**/*.ejs',
        src   : 'src/**/!(_)*.ejs'
    },
    css    : {
        watch : 'src/**/*.scss',
        src   : ['src/**/*.scss', '!src/' + css_folder_path + '**/*.scss', '!src/sp/' + css_folder_path + '**/*.scss']
    },
    js     : {
        watch : 'src/**/*.js',
        src   : ['src/**/*.js', '!src/' + js_folder_path + 'common/**/*.js', '!src/sp/' + js_folder_path + 'common/**/*.js']
    },
    pc     : {
        dev     : 'dev/',
        dist    : 'dist/',
        release : 'release/',
        ejs     : ['src/**/!(_)*.ejs', '!src/sp/**/*.ejs'],
        css     : {
            src     : 'src/'     + css_folder_path + '**/*.scss',
            dev     : 'dev/'     + css_folder_path,
            dist    : 'dist/'    + css_folder_path,
            release : 'release/' + css_folder_path
        },
        js      : {
            common  : common_js_pc,
            dev     : 'dev/'     + js_folder_path,
            dist    : 'dist/'    + js_folder_path,
            release : 'release/' + js_folder_path
        }
    },
    sp     : {
        dev     : 'dev/sp/',
        dist    : 'dist/sp/',
        release : 'release/sp/',
        ejs     : 'src/sp/**/!(_)*.ejs',
        css     : {
            src     : 'src/sp/'     + css_folder_path + '**/*.scss',
            dev     : 'dev/sp/'     + css_folder_path,
            dist    : 'dist/sp/'    + css_folder_path,
            release : 'release/sp/' + css_folder_path
        },
        js      : {
            common  : common_js_sp,
            dev     : 'dev/sp/'     + js_folder_path,
            dist    : 'dist/sp/'    + js_folder_path,
            release : 'release/sp/' + js_folder_path
        }
    }
};
const defaultSet = {
    paths : paths
};

module.exports = {
    default : defaultSet
};