var PF = require('pathfinding');
var fs = require('fs');
const fse = require('fs-extra');

// get text file from input text
var myArgs = process.argv.slice(2);
let fileName = myArgs[0];

// access to the file by its absolute path
try {
  var data = fs.readFileSync(fileName, 'utf8').toString().split(',');
  console.log(data);
  pathfinder(data.toString());
} catch (e) {
  console.log('Error:', e.stack);
}

function pathfinder(a) {
  let size = [0, 0];
  let values = [];
  a = a.replace(/x/g, "").replace(/\n/g, "").split(",") // remove x and line break from the file
  a.map(e => {
    e = e.split("y") // remove also y to have a more simple format I can work with
    values.push(e);
    if (e[0] > size[0]) {
      size[0] = e[0];
    }
    if (e[1] > size[1]) {
      size[1] = e[1];
    }
  })

  // crate matrix that will be the Grid we will pass to the pathfinder algorithm
  const matrix = new Array(+size[1]+1).fill(0).map(() => new Array(+size[0]+1).fill(0));
  for (let i = 1; i < values.length - 1; i++) {
      matrix[values[i][1]][values[i][0]] = 1
  }

  // algorithm. Returns the path
  var grid = new PF.Grid(matrix); 
  grid.setWalkableAt(0, 1, false);
  var finder = new PF.AStarFinder();
  var path = finder.findPath(values[0][0], values[0][1], values[values.length-1][0], values[values.length-1][1], grid);
  path.map(e => {
    matrix[e[1]][e[0]] = 'O';
  })

  //  Change matrix values by 0s and 1s
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][j] = '.';
      } else if (matrix[i][j] === 1) {
        matrix[i][j] = 'X';
      }
    }
  }

  // add to the matrix, the Starting point S and Ending E
  matrix[values[0][1]][values[0][0]] = 'S';
  matrix[values[values.length-1][1]][values[values.length-1][0]] = 'E';

  // make strings for the final result and separate them by lines
  result = matrix.map(e => {
    return e.join('').concat('\n')
  }).join('')

    // write the output in the same absolute path than the input
    fse.outputFile(fileName + '.answer', result, err => {
      if (err) {
        console.log(err);
      } else {
        console.log('The file was saved!');
      }
    })

}




