const MarkdownIt = require('markdown-it');
const fs = require('fs');
const pattern = /<[a-z0-9]{1,}>/igm;

md = new MarkdownIt({
    langPrefix: 'language-',
    
});

fs.readFile('./src/blog.md', function (err, data) {
    if (err) {
        return console.error(err);
    }
    let result = md.render(data.toString());
    
    result = result.replace('<h1>', '<h1 class="md-title1">');
    result = result.replace('<h2>', '<h1 class="md-title2">');
    result = result.replace('<h3>', '<h1 class="md-title3">');
    result = result.replace('<h4>', '<h1 class="md-title4">');
    result = result.replace('<h5>', '<h1 class="md-title5">');
    result = result.replace('<ul>', '<h1 class="md-ul">');
    result = result.replace('<li>', '<h1 class="md-li">');
    result = result.replace('<pre>', '<h1 class="md-pre">');
    result = result.replace('<code>', '<h1 class="md-code">');
    console.log(`----\n${result}\n----`);
 });