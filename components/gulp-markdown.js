const through = require('through2');
const MarkdownIt = require('markdown-it');
let md = new MarkdownIt();

const PLUGIN_NAME = 'gulp-markdown';

function markdownStream() {
    return through(function (chunck, _, next) {
        this.push(md.render(chunck.toString()));
        next();
    });
}

function gulpMarkdown(suffix) {
    var stream = through.obj(function (file, encoding, cb) {
        if (file.isStream()) {
            let mdStream = through(function (chunck, _, next) {
                this.push(md.render(chunck.toString()));
                next();
            });
            mdStream.on('error', this.emit.bind(this, 'error'));
            file.contents = file.contents.pipe(mdStream);
            this.push(file);
            if(suffix === undefined) suffix = ''
            file.path = file.path.replace(/\.md$/, suffix);
            cb();
        } else {
            cb();
        }

    });
    return stream;
}

module.exports = gulpMarkdown;