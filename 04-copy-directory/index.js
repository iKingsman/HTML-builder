const fsPromises = require('fs/promises');
const path = require('path');

const filesDir = path.join(__dirname, 'files');
const filesCopyDir = path.join(__dirname, 'files-copy');

const copyDir = async () => {
  await fsPromises.rm(filesCopyDir, { force: true, recursive: true });
  await fsPromises.mkdir(filesCopyDir, { recursive: true });

  const files = await fsPromises.readdir(filesDir);
  for (let file of files) {
    const dir = path.join(filesDir, file);
    const newDir = path.join(filesCopyDir, file);
    await fsPromises.copyFile(dir, newDir);
  }
};

copyDir();
