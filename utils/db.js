const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const db = {
    read: readFile,
    write: writeFile
}

module.exports = db;