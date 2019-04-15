const glob = require('glob');

glob('./data/**/*.md', (err, files) => {
    console.log(files)
});