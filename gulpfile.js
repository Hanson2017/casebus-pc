const gulp = require('gulp'); //引入依赖包，gulp必需
const connect = require('gulp-connect')
const cached = require('gulp-cached')
var postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer')
const sass = require('gulp-sass');
const revAll = require('gulp-rev-all');
const cleanCss = require('gulp-clean-css')
const cssver = require('gulp-make-css-url-version')
const htmlmin = require('gulp-htmlmin');
const rev = require('gulp-rev')
var revCollector = require('gulp-rev-collector')
const revReplace = require('gulp-rev-replace');
const del = require('del');
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const fileinclude = require('gulp-file-include');

const babel = require('gulp-babel');
const browserify = require('browserify');
const stream = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const sourcemaps = require('gulp-sourcemaps')


sass.compiler = require('node-sass');

// 配置路径
const baseUrl = './app/';
const distUrl = './dist/';
const tplUrl = './tpl/';

const configUrl = {
    file: {
        css: baseUrl + 'css/**/*.css',
        scss: baseUrl + 'scss/**/*.scss',
        images: baseUrl + 'images/**/*',
        js: baseUrl + 'js/**/*.js',
        libs: baseUrl + 'js/libs/**/*.js',
        fonts: baseUrl + 'fonts/**/*',
        html: baseUrl + '**/*.html',
        tpl: baseUrl + '**/*.html',
        tpl_include: baseUrl + '_include/**/*.html'
    },
    folder: {
        css: baseUrl + 'css',
        html: baseUrl
    },
    dist: {
        css: distUrl + 'css',
        images: distUrl + 'images',
        js: distUrl + 'js',
        html: distUrl,
        rev: distUrl + 'rev',
        fonts: distUrl + 'fonts',
    }
}

function clear(cb) {
    del([distUrl]); //每次打包清除dist目录
    cb()
}

//删除生成的html文件，保留文件夹

function cleanHtml(cb) {
    del([configUrl.file.html])
    cb()
}

function cleanPic(cb) {
    del([configUrl.dist.images])
    cb()
}

function cleanFonts(cb) {
    del([configUrl.dist.fonts])
    cb()
}


function scss(cb) {
    gulp.src(configUrl.file.scss) //读取sass目录下任意多级目录下所有以.scss为结尾的文件，最新版gulp中建议使用return语法
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(
            {
                // 兼容主流浏览器的最新两个版本
                overrideBrowserslist: ['last 2 versions'],
                // 是否美化属性值
                cascade: false
            }
        )]))      
        .pipe(gulp.dest(configUrl.folder.css)) //保存打包后的CSS文件到app下的css目录
    cb()
}

function css(cb) {
    gulp.src(configUrl.file.css)
        // .pipe(cached('css')) //缓存文件，避免每次重复打包
        // .pipe(cssver())
        .pipe(cleanCss({ //压缩CSS
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            format: 'keep-breaks',//是否保留换行
            keepSpecialComments: '*'//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        // .pipe(rev()) //添加hash后缀
        .pipe(gulp.dest(configUrl.dist.css))
    // .pipe(rev.manifest())
    // .pipe(gulp.dest(configUrl.dist.rev+'/css'));
    cb()
}

// es6转es5,转译模块化
function browserifyJs(cb) {
    var b = browserify({
        entries: "./app/js/main.js"
    });
    return b.transform(babelify, {
        presets: [
            '@babel/env'  //转换es6代码
        ]
    })
        .bundle()
        .pipe(stream('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true })) // 从 browserify 文件载入 map
        .pipe(sourcemaps.write('.')) // 写入 .map 文件
        // .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
    // gulp.src([configUrl.file.js, '!' + configUrl.file.libs])
    //     // .pipe(cached('js'))
    //     .pipe(babel({
    //         presets: ['@babel/env']
    //     }))
    //     .pipe(uglify({ //压缩JS
    //         mangle: true,//类型：Boolean 默认：true 是否修改变量名  排除混淆关键字
    //         compress: true,//类型：Boolean 默认：true 是否完全压缩
    //     }))
    //     // .pipe(rev()) //添加hash后缀
    //     .pipe(gulp.dest(configUrl.dist.js)) //
    //     // .pipe(rev.manifest())
    //     // .pipe(gulp.dest(configUrl.dist.rev+'/js'));
}
// es6转es5,转译模块化
function browserifyJs2(cb) {
    var b = browserify({
        entries: "./app/js/detail.js"
    });
    return b.transform(babelify, {
        presets: [
            '@babel/env'  //转换es6代码
        ]
    })
        .bundle()
        .pipe(stream('detail.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true })) // 从 browserify 文件载入 map
        .pipe(sourcemaps.write('.')) // 写入 .map 文件
        // .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
}
function browserifyJs3(cb) {
    var b = browserify({
        entries: "./app/js/form.js"
    });
    return b.transform(babelify, {
        presets: [
            '@babel/env'  //转换es6代码
        ]
    })
        .bundle()
        .pipe(stream('form.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true })) // 从 browserify 文件载入 map
        .pipe(sourcemaps.write('.')) // 写入 .map 文件
        // .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
}

function browserifyJs4(cb) {
    var b = browserify({
        entries: "./app/js/lazyload.js"
    });
    return b.transform(babelify, {
        presets: [
            '@babel/env'  //转换es6代码
        ]
    })
        .bundle()
        .pipe(stream('lazyload.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true })) // 从 browserify 文件载入 map
        .pipe(sourcemaps.write('.')) // 写入 .map 文件
        // .pipe(uglify())
        .pipe(gulp.dest("dist/js"));
}


function pic(cb) {
    gulp.src(configUrl.file.images)

        .pipe(imagemin({
            progressive: true,//类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{ removeViewBox: false }]//不要移除svg的viewbox属性
        }))
        .pipe(gulp.dest(configUrl.dist.images));
    cb()
}

function fonts(cb) {
    gulp.src(configUrl.file.fonts)
        .pipe(gulp.dest(configUrl.dist.fonts));
    cb()
}


// 拷贝文件过去
function baleCopy(cb) {
    gulp.src([configUrl.file.fonts, configUrl.file.libs], { base: baseUrl })
        .pipe(gulp.dest(distUrl))
    cb()
}

function html(cb) {
    gulp.src(configUrl.file.html)
       
        .pipe(gulp.dest(configUrl.dist.html));
    cb()
}

function file(cb) {
    gulp.src([configUrl.file.tpl, '!' + configUrl.file.tpl_include])
        .pipe(fileinclude({
            prefix: '@@',//变量前缀 @@include
            basepath: './app/_include',//引用文件路径
            indent: true//保留文件的缩进
        }))
        .pipe(gulp.dest(configUrl.dist.html));
    cb()
}

function reload(cb) {
    gulp.src(configUrl.file.html)
        .pipe(connect.reload()); //页面重新加载
    cb()
}

function watchs(cb) {

    gulp.watch(configUrl.file.html, gulp.series(file));
    gulp.watch(configUrl.file.scss, scss);
    gulp.watch(configUrl.file.css, css);
    gulp.watch(configUrl.file.js, browserifyJs);
    gulp.watch(configUrl.file.js, browserifyJs2);
    gulp.watch(configUrl.file.js, browserifyJs3);
    gulp.watch(configUrl.file.js, browserifyJs4);
    // gulp.watch(configUrl.file.images, gulp.series(cleanPic, pic));
    gulp.watch(configUrl.file.fonts, gulp.series(cleanFonts, fonts));

    gulp.watch(baseUrl + "**/*.*", reload);
    cb()
}

function connect_app(cb) {
    connect.server({ //启用本地服务器
        root: 'dist', //根目录
        port: 3002, //端口
        livereload: true, //热更新
        host: '::',
    });
    cb()
}

exports.file = file
exports.clear = clear
exports.default = gulp.parallel(watchs, connect_app)
// exports.build = gulp.series(clear, gulp.parallel(css, js, pic, baleCopy), html);

exports.build = gulp.series(clear, browserifyJs);

