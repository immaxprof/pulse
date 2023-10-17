const { src, dest, parallel, series, watch } = require("gulp");
const preprocessor = "scss";
// const gulp = require("gulp");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");

// Static server

function serverOn() {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
}

function minImages() {
  return src("src/img/*").pipe(imagemin()).pipe(dest("dist/img"));
}

function minHtml() {
  return src("src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(dest("dist"));
}

function styles() {
  return src(`src/${preprocessor}/**/*.${preprocessor}`)
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(
      rename({
        prefix: "",
        suffix: ".min",
      })
    )
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

function stylesExt() {
  return src(`src/${preprocessor}/**/*.${preprocessor}`)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      rename({
        suffix: "-ext",
      })
    )
    .pipe(autoprefixer())
    .pipe(dest("dist/css"));
}

// КОПИРОВАНИЕ ОСНОВНЫХ ФАЙЛОВ ИЗ SRC В DIST

function copyIcons() {
  return src("src/icons/**/*").pipe(dest("dist/icons"));
}

function copyFonts() {
  return src("src/fonts/**/*").pipe(dest("dist/fonts"));
}

function copyScripts() {
  return src("src/js/**/*.js").pipe(dest("dist/js"));
}

function startWatch() {
  watch(`src/${preprocessor}/**/*.${preprocessor}`, styles);
  watch(`src/${preprocessor}/**/*.${preprocessor}`, stylesExt);
  watch("src/*.html").on("change", minHtml);
  watch("dist/*.html").on("change", browserSync.reload);
  // watch("src/js/*.js").on("change", browserSync.reload);
}

// gulp.task("watch", function () {
//   gulp.watch("src/sass/*.+(scss|sass)", gulp.parallel("styles"));
//   gulp.watch("src/*.html").on("change", browserSync.reload);
// });

// gulp.task("default", gulp.parallel("watch", "server", "styles"));
exports.default = parallel(
  styles,
  stylesExt,
  serverOn,
  startWatch,
  minImages,
  minHtml,
  copyIcons,
  copyFonts,
  copyScripts
);
