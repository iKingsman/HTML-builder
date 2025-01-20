const fs = require('fs');
const path = require('path');

const pathToFolder = path.join(__dirname, 'secret-folder');
fs.readdir(pathToFolder, { withFileTypes: true }, (error, data) => {
  error ? console.log(error) : null;
  data.forEach((file) => {
    if (file.isFile()) {
      fs.stat(path.join(pathToFolder, file.name), (err, stats) => {
        err ? console.log(err) : null;
        const fileName = file.name.split('.')[0];
        const fileExtension = file.name.split('.')[1];
        console.log(`${fileName} - ${fileExtension} - ${stats.size} bytes`);
      });
    }
  });
});
