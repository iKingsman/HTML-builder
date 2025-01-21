const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const pathToStyles = path.join(__dirname, 'styles');
const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToBundle = path.join(pathToProjectDist, 'bundle.css');

const mergeStyles = async () => {
  const stylesFiles = await fsPromises.readdir(pathToStyles, {
    withFileTypes: true,
  });
  const writeStream = fs.createWriteStream(pathToBundle);
  for (const file of stylesFiles) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const pathToFile = path.join(file.path, file.name);
      const readStream = fs.createReadStream(pathToFile);
      readStream.on('data', (chunk) => {
        writeStream.write(chunk);
      });
    }
  }
};

mergeStyles();
