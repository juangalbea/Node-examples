var CryptoJS = require("crypto-js");
var fs = require('fs');
const fse = require('fs-extra');

// get text file from input text
var myArgs = process.argv.slice(2);
let fileName = myArgs[0];

// access to the file by its absolute path
try {
  var data = fs.readFileSync(fileName, 'utf8').toString().split(',');
  console.log(data.toString());
  hashIterator(data[0], data[1]);
} catch (e) {
  console.log('Error:', e.stack);
}

function hashIterator(x, y) {
  md5Hash = CryptoJS.MD5(x).toString();
  let a = new Array(y); for (let i = 0; i < y; ++i) a[i] = 0; // create 0s array with length = integer 'y'
  const hash = Object.create({}); // create an object to store the values that we will need in the output
  let position = 0;

  for (count = 0; position < 10; count++) {
    md5Hash = CryptoJS.MD5(x + count).toString();
    if (md5Hash.slice(0, y) == a.join('')) {
      if (Number.isInteger(+md5Hash[y]) && !hash.hasOwnProperty(md5Hash[y])) { // check the position is a number and is not already found before
        position++;
        hash[md5Hash[y]] = md5Hash[count % 32];
      }
    }
  }

  let result = Object.values(hash).join('');

  // write the output in the same absolute path than the input
  fse.outputFile(fileName + '.answer', result, err => {
    if (err) {
      console.log(err);
    } else {
      console.log('The file was saved!');
    }
  })
}

