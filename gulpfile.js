var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    del = require('del'),
    templateCache = require('gulp-angular-templatecache'),
    connect = require('gulp-connect'),
    plugins = require('gulp-load-plugins')();

var bower = 'app/libs/bower';
var vendors = 'app/libs/vendors';
var build = 'www';
var tmp = '.build-tmp';

var paths = {
    indexFile: 'app/index.html',
    langs: {
        script: 'lang.py',
        csv: 'lang.csv',
        js: 'app/modules/common/js/'
        /*script: 'lang.py',
        main: {
            langFileId: '1p79BGz9dtJlX4qcfc2irrwSIN6RakdCzoYON2UFKm4U',
            csv: 'lang.csv',
            js: 'lang.js',
            jsPath: 'app/modules/common/js/'
        }*/
    },
    scss: [
        'app/scss/**/*.scss'
    ],
    css: [
        tmp + '/style.css'
    ],
    html: [
        'app/modules/**/*.html'
    ],
    scripts: [
        'app/modules/**/*.js'
    ],
    libsScripts: [
        bower + '/underscore/underscore.js',
        bower + '/angular/angular.js',
        bower + '/angular-resource/angular-resource.js',
        bower + '/ngstorage/ngStorage.js',
        bower + '/angular-sanitize/angular-sanitize.js',
        bower + '/angular-ui-router/release/angular-ui-router.js',
        vendors + '/angular-translate.min.js',
        vendors + '/translation_service.js',
        bower + '/velocity/velocity.js'
    ],
    mainFiles: ['app/app.js', 'app/index.html'],
    files: 'app/res/**/*'
};


//
// LANG TASK
//
/*function generateLang(csv, js, jsPath, theme)
 {
 return gulp.src(csv)
 .pipe(plugins.plumber())
 .pipe(plugins.shell([
 'python ' + paths.langs.script + ' ' + csv + ' ' + js + ' ' + js + '.py',
 'mv ' + js + ' ' + jsPath + 'lang.js',
 'rm ' + csv
 ]));
 }

 gulp.task('lang', function()
 {
 var url = 'https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=' + paths.langs.main.langFileId + '&exportFormat=csv';
 var stream = fs.createWriteStream(paths.langs.main.csv);
 stream.on('close', function()
 {
 generateLang(paths.langs.main.csv, paths.langs.main.js, paths.langs.main.jsPath, '');
 });
 request(url).pipe(stream);
 });*/
gulp.task('lang', function()
{
    return gulp.src(paths.langs.csv)
        .pipe(plugins.plumber())
        .pipe(plugins.shell([
            'python ' + paths.langs.script + ' ' + paths.langs.csv,
            'mv lang.js ' + paths.langs.js
        ]));
});


//
// CLEANERS
//
gulp.task('clean:build', function(cb)
{
    del([
        build + '/css/**',
        build + '/js/**',
        build + '/templates/**',
        build + '/res/**',
        build + '/index.html'
    ], cb);
});

gulp.task('clean:tmp', function(cb)
{
    del([tmp + '/**'], cb);
});

//
// JS
//
gulp.task('build-libs', function()
{
    return gulp.src(paths.libsScripts)
        .pipe(plugins.plumber())
        .pipe(plugins.uglify())
        .pipe(plugins.concat('libs.min.js'))
        .pipe(gulp.dest(build + '/js'));
});

gulp.task('build-libs-debug', function()
{
    return gulp.src(paths.libsScripts)
        .pipe(plugins.plumber())
        .pipe(plugins.concat('libs_debug.js'))
        .pipe(gulp.dest(build + '/js'));
});

gulp.task('build-scripts', function()
{
    return gulp.src(paths.scripts)
        .pipe(plugins.plumber())
        .pipe(plugins.uglify())
        .pipe(plugins.concat('scripts.js'))
        .pipe(gulp.dest(build + '/js'));
});

gulp.task('build-scripts-debug', function()
{
    return gulp.src(paths.scripts)
        .pipe(plugins.plumber())
        .pipe(plugins.concat('scripts_debug.js'))
        .pipe(gulp.dest(build + '/js'));
});


//
// CSS
//
gulp.task('scss', ['clean:tmp'], function()
{
    return gulp.src(paths.scss)
        .pipe(plugins.plumber())
        .pipe(plugins.concat('style.scss'))
        .pipe(plugins.sass(
            {
                includePaths: [
                    'app/',
                    'app/modules/common/scss/',
                    'app/libs/bower/lumx/dist/scss/',
                    'app/libs/bower/bourbon/app/assets/stylesheets/']
            }).on('error', plugins.sass.logError))
        .pipe(gulp.dest(tmp));
});

gulp.task('css', ['scss'], function()
{
    return gulp.src(paths.css)
        .pipe(plugins.plumber())
        .pipe(plugins.concat('style.min.css'))
        .pipe(plugins.minifyCss({keepSpecialComments: 0}))
        .pipe(gulp.dest(build + '/css'));
});

gulp.task('css:copy', function()
{
    gulp.src(paths.copyCss)
        .pipe(gulp.dest(build + '/css'));
});


//
// FONTS
//
gulp.task('fonts', function()
{
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(build + '/fonts'))
        .pipe(gulp.dest(build + '/css/fonts'));
});


//
// HTML
//
gulp.task('template-cache', function()
{
    gulp.src('app/modules/**/*.html')
        .pipe(templateCache('templates_modules.js', {root: 'modules/', module: 'ModulesTemplates'}))
        .pipe(gulp.dest(build + '/js'));
});


//
// FILES
//
gulp.task('files:copy', function()
{
    gulp.src(paths.files)
        .pipe(gulp.dest(build + '/res'));
});


//
// MAIN FILES
//
gulp.task('main-files:copy', function()
{
    gulp.src(paths.mainFiles)
        .pipe(gulp.dest(build));
});


//
// WATCH
//

function watcherWithCache(name, src, tasks)
{
    gulp.watch(src, {maxListeners: 999}, tasks.concat('reload'));
}

gulp.task('watch', ['build-debug'], function()
{
    watcherWithCache('build-libs-debug', paths.libsScripts, ['build-libs-debug']);
    watcherWithCache('build-scripts-debug', paths.scripts, ['build-scripts-debug']);
    watcherWithCache('css', paths.scss.concat(paths.css).concat('!' + tmp + '/style.css'), ['css']);
    watcherWithCache('template-cache', ['app/modules/**/*.html'], ['template-cache']);
    watcherWithCache('files', paths.files, ['files:copy']);
    watcherWithCache('mainFiles', paths.mainFiles, ['main-files:copy']);
});


//
// GULP MANAGEMENT
//

gulp.task('auto-reload', function()
{
    var p;

    gulp.watch('gulpfile.js', spawnChildren);
    spawnChildren();

    function spawnChildren(e)
    {
        // kill previous spawned process
        if (p)
        {
            p.kill();
        }

        p = spawn('gulp', ['watch'], {stdio: 'inherit'});
    }
});


//
// LIVE RELOAD SERVER
//
gulp.task('serve', function()
{
    connect.server({
        root: "www",
        port: 8100,
        livereload: true
    });
});

gulp.task('reload', function()
{
    gulp.src('./www/**')
        .pipe(connect.reload());
});


gulp.task('build-debug', ['lang', 'build-libs-debug', 'build-scripts-debug', 'css', 'template-cache', 'files:copy', 'main-files:copy']);
gulp.task('default', ['watch', 'auto-reload', 'serve', 'reload']);