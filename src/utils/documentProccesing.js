const fs = require('fs').promises;
const chalk = require('chalk');
const path = require('path');

const documentProccessing = async (doc) => {
  if (doc == null) {
    return null;
  }
  try {
    const data = await fs.readFile(path.normalize(doc), 'utf8');
    return data;
  } catch (e) {
    console.log(e);
    console.log(chalk.red('The <FILE> is not found'));
  }
  return null;
};

module.exports = documentProccessing;
