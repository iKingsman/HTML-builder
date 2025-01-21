const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const pathToAssetsFolder = path.join(__dirname, 'assets');
const pathToFolderDist = path.join(__dirname, 'project-dist');
const pathToDistAssets = path.join(pathToFolderDist, 'assets');

const createFolder = async (pathToFolder) => {
  await fsPromises.rm(pathToFolder, { force: true, recursive: true });
  await fsPromises.mkdir(pathToFolder, { recursive: true });
};

const mergeStyles = async () => {
  const pathToStyles = path.join(__dirname, 'styles');
  const pathToStyle = path.join(pathToFolderDist, 'style.css');
  const files = await fsPromises.readdir(pathToStyles, {
    withFileTypes: true,
  });
  const writeStream = fs.createWriteStream(pathToStyle);
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const pathToFile = path.join(file.path, file.name);
      const readStream = fs.createReadStream(pathToFile);
      readStream.on('data', (chunk) => {
        writeStream.write(chunk);
      });
    }
  }
};

const copyFolder = async (pathToFolder, newPathToFolder) => {
  const files = await fsPromises.readdir(pathToFolder, {
    withFileTypes: true,
  });
  for (const file of files) {
    const filePath = path.join(pathToFolder, file.name);
    const newFilePath = path.join(newPathToFolder, file.name);
    if (!file.isFile()) {
      await createFolder(newFilePath);
      await copyFolder(filePath, newFilePath);
    } else {
      await fsPromises.copyFile(filePath, newFilePath);
    }
  }
};

const buildHtml = async () => {
  const pathToIndex = path.join(pathToFolderDist, 'index.html');
  const pathToTemplate = path.join(__dirname, 'template.html');
  const pathToComponents = path.join(__dirname, 'components');
  let templateFileContent = await fsPromises.readFile(pathToTemplate, 'utf8');
  const componentsFiles = await fsPromises.readdir(pathToComponents, {
    withFileTypes: true,
  });

  for (const file of componentsFiles) {
    const pathToFile = path.join(file.path, file.name);
    const fileName = path.parse(file.name).name;
    const tag = `{{${fileName}}}`;
    const tagContent = await fsPromises.readFile(pathToFile, 'utf8');
    templateFileContent = templateFileContent.replace(tag, tagContent);
  }
  console.log(templateFileContent);
  await fsPromises.writeFile(pathToIndex, templateFileContent);
};

const buildProject = async () => {
  await createFolder(pathToFolderDist);
  await createFolder(pathToDistAssets);
  await buildHtml();
  await mergeStyles();
  await copyFolder(pathToAssetsFolder, pathToDistAssets);
};

buildProject();
