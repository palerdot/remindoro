// generated on 2016-10-03 using generator-chrome-extension 0.6.1
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import del from "del";
import runSequence from "run-sequence";
import { stream as wiredep } from "wiredep";
import flatten from "gulp-flatten";

import zip from "gulp-zip";

// import webpack from 'webpack';
// importing webpack stream for gulp
import webpack from "webpack-stream";

const $ = gulpLoadPlugins();

gulp.task("extras", () => {
  console.log("porumai! running extras for ==> ", process.env.TARGET_PLATFORM);
  const DESTINATION_FOLDER = `dist/${process.env.TARGET_PLATFORM}/`;
  return (
    gulp
      .src(
        [
          "app/*.*",
          "app/_locales/**",
          "!app/scripts.babel",
          "!app/*.json",
          "!app/*.html",
          "!app/styles.scss"
        ],
        {
          base: "app",
          dot: true
        }
      )
      // .pipe(gulp.dest("dist"));
      .pipe(gulp.dest(DESTINATION_FOLDER))
  );
});

function lint(files, options) {
  return () => {
    return gulp
      .src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format());
  };
}

gulp.task(
  "lint",
  lint("app/scripts.babel/**/*.js", {
    env: {
      es6: true
    }
  })
);

gulp.task("images", () => {
  const DESTINATION_FOLDER = `dist/${process.env.TARGET_PLATFORM}/images`;
  return gulp
    .src("app/images/**/*")
    .pipe(
      $.if(
        $.if.isFile,
        $.cache(
          $.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{ cleanupIDs: false }]
          })
        ).on("error", function(err) {
          console.log(err);
          this.end();
        })
      )
    )
    .pipe(gulp.dest(DESTINATION_FOLDER));
});
gulp.task("styles", () => {
  return gulp
    .src("app/styles.scss/*.scss")
    .pipe($.plumber())
    .pipe(
      $.sass
        .sync({
          outputStyle: "expanded",
          precision: 10,
          includePaths: ["."]
        })
        .on("error", $.sass.logError)
    )
    .pipe(gulp.dest("app/css"));
});

gulp.task("html", ["styles"], () => {
  const DESTINATION_FOLDER = `dist/${process.env.TARGET_PLATFORM}/`;
  return gulp
    .src("app/*.html")
    .pipe($.useref({ searchPath: [".tmp", "app", "."] }))
    .pipe($.sourcemaps.init())
    .pipe($.if("*.js", $.uglify()))
    .pipe($.if("*.css", $.cleanCss({ compatibility: "*" })))
    .pipe($.sourcemaps.write())
    .pipe(
      $.if(
        "*.html",
        $.htmlmin({ removeComments: true, collapseWhitespace: true })
      )
    )
    .pipe(gulp.dest(DESTINATION_FOLDER));
});

gulp.task("organize_files", () => {
  const DESTINATION_FOLDER = `dist/${process.env.TARGET_PLATFORM}/`;
  // complete list of files needed for the "Remindoro" app
  var REMINDORO_FILE_LIST = [
    `app/manifests/${process.env.TARGET_PLATFORM}/manifest.json`,
    "app/config.json",
    "app/_locales/**/*",
    "app/fonts/**/*",
    "app/images/**/*",
    "app/*.html",
    "app/css/**/*.css",

    "!app/js/utils.js",
    "!app/js/general-initializer.js",

    "app/js/*.js"
  ];

  var is_production = process.env.NODE_ENV == "production";
  console.log("PRODUCTION ? => ", is_production, process.env.TARGET_PLATFORM);

  var uglify_options = {
    compress: { drop_console: is_production ? true : false }
  };

  return (
    gulp
      .src(REMINDORO_FILE_LIST, { base: "./app/" })
      .pipe($.if("*.css", $.cleanCss({ compatibility: "*" })))
      // .pipe($.if('*.js', $.sourcemaps.init()))
      .pipe(
        $.if(
          "*.js",
          $.uglify(uglify_options).on("error", function(e) {
            console.log(e);
          })
        )
      )
      .pipe($.if("*.js", $.sourcemaps.write(".")))
      // if manifest.json flatten the folder structure
      .pipe(
        $.if(
          `manifests/${process.env.TARGET_PLATFORM}/manifest.json`,
          flatten()
        )
      )
      .pipe(gulp.dest(DESTINATION_FOLDER))
  );
});

// creates a zip file for the dist folder
gulp.task("zip", () => {
  const DESTINATION_FOLDER = `dist/${process.env.TARGET_PLATFORM}`;
  let man_config = require(`./${DESTINATION_FOLDER}/manifest.json`),
    VERSION = man_config.version,
    zip_file_name = "Remindoro-" + VERSION + ".zip";

  return gulp
    .src(`${DESTINATION_FOLDER}/**/`)
    .pipe(zip(zip_file_name))
    .pipe(gulp.dest("."));
});

gulp.task("chromeManifest", () => {
  const MANIFEST_SRC = `app/manifests/${
    process.env.TARGET_PLATFORM
  }/manifest.json`;
  const DESTINATION_FOLDER = `dist/${process.env.TARGET_PLATFORM}`;
  return gulp
    .src(MANIFEST_SRC)
    .pipe(
      $.chromeManifest({
        buildnumber: true
        // background: {
        //     target: 'js/background.js',
        //     exclude: [
        //         'js/chromereload.js'
        //     ]
        // }
      })
    )
    .pipe($.if("*.css", $.cleanCss({ compatibility: "*" })))
    .pipe($.if("*.js", $.sourcemaps.init()))
    .pipe($.if("*.js", $.uglify()))
    .pipe($.if("*.js", $.sourcemaps.write(".")))
    .pipe(gulp.dest(DESTINATION_FOLDER));
});

// gulp.task('babel', () => {
//     return gulp.src('app/scripts.babel/**/*.{js,jsx}')
//         .pipe($.babel({
//             presets: ['es2015']
//         }))
//         // .pipe(gulp.dest('app/js'));
//         .pipe(gulp.dest('app/js/'));
// });

gulp.task("events-page", () => {
  let config = require("./webpack.events.config.js");

  return gulp
    .src("./app/scripts.babel/events-modular.js")
    .pipe(webpack(config))
    .pipe(gulp.dest("./app/js/"));
});

// webpack tasks
gulp.task("webpack", cb => {
  let config = require("./webpack.config.js");

  return gulp
    .src("./app/index.js")
    .pipe(webpack(config))
    .pipe(gulp.dest("./app/js/"));
});

gulp.task("clean", del.bind(null, [".tmp", "dist"]));

gulp.task("watch", ["lint", "events-page", "webpack", "styles"], () => {
  // dev BUILD
  process.env.NODE_ENV = "development";

  $.livereload.listen();

  gulp
    .watch([
      "app/*.html",
      "app/**/*.{js,jsx}",
      "app/images/**/*",
      "app/styles/**/*",
      "app/_locales/**/*.json"
    ])
    .on("change", $.livereload.reload);

  // Note: Ignoring the main resulting bundle file => remindoro.js
  gulp.watch(
    ["app/**/*.{js,jsx}", "!app/js/remindoro.js"],
    ["lint", "events-page", "webpack"]
  );
  // gulp.watch(['app/**/*.{js,jsx}', '!app/js/remindoro.js'], ['lint'], ['babel'], ['webpack']);
  gulp.watch("app/styles.scss/**/*.scss", ["styles"]);
  gulp.watch("bower.json", ["wiredep"]);
});

gulp.task("size", () => {
  const DESTINATION_FOLDER = `dist/${process.env.TARGET_PLATFORM}`;
  return gulp
    .src(`${DESTINATION_FOLDER}/**/*`)
    .pipe($.size({ title: "build", gzip: true }));
});

gulp.task("wiredep", () => {
  gulp
    .src("app/*.html")
    .pipe(
      wiredep({
        ignorePath: /^(\.\.\/)*\.\./
      })
    )
    .pipe(gulp.dest("app"));
});

gulp.task("package", function() {
  const DESTINATION_FOLDER = `dist/${process.env.TARGET_PLATFORM}`;
  var manifest = require(`./${DESTINATION_FOLDER}/manifest.json`);
  return gulp
    .src(`${DESTINATION_FOLDER}/**`)
    .pipe($.zip("Remindoro-" + manifest.version + ".zip"))
    .pipe(gulp.dest("package"));
});

gulp.task("build", cb => {
  runSequence(
    "lint",
    "webpack",
    "events-page",
    "styles",
    ["organize_files"],
    ["html", "images", "extras"],
    "size",
    "zip",
    cb
  );
});

// default task
gulp.task("default", cb => {
  // dev build
  process.env.NODE_ENV = "development";
  runSequence("build", cb);
});

// default distribution/build task
gulp.task("build-remindoro", ["clean"], cb => {
  // PRODUCTION BUILD
  process.env.NODE_ENV = "production";
  runSequence("build", cb);
});

// gulp tasks to build  platform specific extensions

// bulding FIREFOX extension
gulp.task("build-firefox-remindoro", ["clean"], cb => {
  // set chrome flag
  process.env.TARGET_PLATFORM = "firefox";
  // PRODUCTION BUILD
  process.env.NODE_ENV = "production";
  console.log("porumai! building for ====> ", process.env.TARGET_PLATFORM);
  runSequence("build", cb);
});

gulp.task("debug-firefox-remindoro", ["clean"], cb => {
  // set chrome flag
  process.env.TARGET_PLATFORM = "firefox";
  // PRODUCTION BUILD
  process.env.NODE_ENV = "development";
  console.log("porumai! building for ====> ", process.env.TARGET_PLATFORM);
  runSequence("build", cb);
});

// bulding CHROME extension
gulp.task("build-chrome-remindoro", ["clean"], cb => {
  // set chrome flag
  process.env.TARGET_PLATFORM = "chrome";
  // PRODUCTION BUILD
  process.env.NODE_ENV = "production";
  console.log("porumai! building for chrome ", process.env.TARGET_PLATFORM);
  runSequence("build", cb);
});
