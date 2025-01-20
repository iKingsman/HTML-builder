const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });

const pathToFile = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(pathToFile);

output.write('Hello! Enter your text: ');

rl.on('line', (input) => {
  if (input.toLocaleLowerCase() === 'exit') {
    finishInput();
    return;
  }
  writeStream.write(`${input}\n`);
});

const finishInput = () => {
  output.write('Entering text finished. Goodbye!');
  rl.close();
};

rl.on('SIGINT', () => {
  finishInput();
});
