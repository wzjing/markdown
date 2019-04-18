const through = require('through2');
const MarkdownIt = require('markdown-it');
const fancyLog = require('fancy-log');
const Vinyl = require('vinyl');
const PluginError = require('plugin-error');

let md = new MarkdownIt();

module.exports = function (suffix) {

    let compile = function (file, encoding, cb) {
        if (file.isStream()) {
            let mdStream = through(function (chunk, _, next) {
                this.push(md.render(chunk.toString()));
                next();
            });
            mdStream.on('error', this.emit.bind(this, 'error'));
            file.contents = file.contents.pipe(mdStream);
            if (suffix === undefined) suffix = '';
            file.extname = '.src';
            file.path = file.path.replace(file.relative, file.stem);
            console.log(`
            Cwd:        ${file.cwd}
            Path:       ${file.path}
            Base:       ${file.base}
            Relative:   ${file.relative}
            dirname:    ${file.dirname}
            basename:   ${file.basename}
            ext:        ${file.extname}
            stem:       ${file.stem}
            `);
            this.push(file);
            cb();
        } else {
            this.emit('drain', new PluginError('debug', 'need stream format chunk'));
            cb();
        }
    };
    let configure = function (cb) {
        this.push(new Vinyl({
            cwd: '/',
            base: '/',
            path: '/configure.json',
            contents: Buffer.from(JSON.stringify({
                name: 'article',
                description: 'this is a blog article collection'
            }))
        }));
        cb();
    };

    return through.obj(compile, configure);
};