'use strict';

const pathMarker = " ";       // PATH
const wallMarker = "w";       // WALL
const frontierMarker = "F";   // FRONTIER
const userMarker = "U";       // USER
const breadCrumbMarker = "B"; // CRUMB 
const hintMarker = ".";       // HINT
const startMarker = "S";      // START
const finishMarker = "F";     // FINISH

let startX; // maze start
let startY;
let finishX; // maze finish
let finishY;
let currentX; // player position
let currentY;
let previousX; // previous player position
let previousY;

// Creates a grid of all walls
function makeMaze(size) {
    size = size * 2 + 1;
    let maze = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(wallMarker);
        }
        maze.push(row);
    }
    randomizeMaze(maze);

    // sets player position
    currentX = 1;
    currentY = 1;
    previousX = 1;
    previousY = 1;
    return maze;
}

// Displays the maze to the console
function showMaze(maze) {
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze.length; j++) {
            process.stdout.write(maze[i][j] + " ");
        }
        process.stdout.write("\n");
    }
    process.stdout.write("\n");
}

// Creates a random maze
function randomizeMaze(maze) {
    // Generate random maze on given grid
    prims(maze);

    // Place start and end of maze
    let beginX = 1;
    let beginY = 1;
    let endX = 0;
    let endY = 0;

    // Get end point that is odd (not in/on a wall) and must not be in quadrant I (too close to start)
    while (endX % 2 === 0 || endY % 2 === 0 ||  endX < maze.length / 2  && endY < maze.length / 2) {
        endX = getRandomInt(maze.length - 1);
        endY = getRandomInt(maze.length - 1);
    }

    maze[beginY][beginX] = startMarker;
    maze[endY][endX] = finishMarker;
    finishX = endX;
    finishY = endY;
    startX = beginX;
    startY = beginY;
}

// Randomized Prim's algorithm to generate a maze
function prims(maze) {

    // Get random point to begin creating maze 
    let x = 0;
    let y = 0;
    while (x % 2 === 0 || y % 2 === 0) {
        x = getRandomInt(maze.length - 1);
        y = getRandomInt(maze.length - 1);
    }
    maze[y][x] = pathMarker;

    // create frontier
    let frontier = [];

    addSurroundingToFrontier(x, y, maze, frontier);

    
    
    // While there are frontiers in the list
    while (frontier.length > 0) {

        // Pick a random frontier from the list and mark it as part of the maze
        let next = getRandomInt(frontier.length);
        x = frontier[next][0];
        y = frontier[next][1];
        maze[y][x] = pathMarker;
        
        let walls = [];
        findWallsConnectedToMaze(x, y, maze, walls)

        // Pick a random wall that connects "next" frontier to the maze
        let r = getRandomInt(walls.length);
        let wallX = walls[r][0];
        let wallY = walls[r][1];

        //  Make the wall part of the maze
        maze[wallY][wallX] = pathMarker;
        
        // Add the neighboring area of the cell to the wall list
        addSurroundingToFrontier(x, y, maze, frontier);

        // Remove the frontier from the list
        frontier.splice(next, 1); // remove 1 item at index next from frontier
    }
}

// Generates a sudo random integer between 0 and n - 1
function getRandomInt(n) {
    return Math.floor(Math.random() * Math.floor(n));
}

// Make sure space above is inside the grid
function aboveValid(x, y, maze) {
    return y - 2 >= 1;
} 

// Make sure space below is inside the grid
function belowValid(x, y, maze) {
    return y + 2 <= maze.length - 1;
}

// Make sure space left is inside the grid 
function leftValid(x, y, maze) {
    return x - 2 >= 1;
}

// Make sure space right is inside the grid
function rightValid(x, y, maze) {
    return x + 2 <= maze.length - 1;
}

// Get status (w:wall, p:path, f:frontier, S:start, E:end)
function getStatus(x, y, maze) {
    return maze[y][x];
}

// Add all eligible surrounded spaces, above, left, right, below
// eligible means is in grid (valid) and is currently a wall
function addSurroundingToFrontier(x, y, maze, frontier) {
    // add space above to frontier 
    if (aboveValid(x, y, maze) && getStatus(x, y - 2, maze) === wallMarker) {
        maze[y - 2][x] = frontierMarker;
        frontier.push([x, y - 2]);
    }
    // add space below to frontier 
    if (belowValid(x, y, maze) && getStatus(x, y + 2, maze) === wallMarker) {
        maze[y + 2][x] = frontierMarker;
        frontier.push([x, y + 2]);
    }
    // add space left to frontier
    if (leftValid(x, y, maze) && getStatus(x - 2, y, maze) === wallMarker) {
        maze[y][x - 2] = frontierMarker;
        frontier.push([x - 2, y])
    }
    // add space right to frontier 
    if (rightValid(x, y, maze) && getStatus(x + 2, y, maze) === wallMarker) {
        maze[y][x + 2] = frontierMarker;
        frontier.push([x + 2, y])
    }
}


// Find all walls that connect next frontier to the path
function findWallsConnectedToMaze(x, y, maze, walls) {
    if (leftValid(x, y, maze) && getStatus(x - 2, y, maze) === pathMarker) {
        walls.push([x - 1, y])
    }
    if (rightValid(x, y, maze) && getStatus(x + 2, y, maze) === pathMarker) {
        walls.push([x + 1, y]); 
    }
    if (aboveValid(x, y, maze) && getStatus(x, y - 2, maze) === pathMarker) {
        walls.push([x, y - 1]);
    }
    if (belowValid(x, y, maze) && getStatus(x, y + 2, maze) === pathMarker) {
        walls.push([x, y + 1]);
    }
}

// Creates a duplicate maze
function copyMaze(maze) {
    let size = maze.length;
    let copy = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(maze[i][j]);
        }
        copy.push(row);
    }
    return copy;
}

// Changes a single position on a maze 
function editMaze(maze, x, y, marker) {
    maze[y][x] = marker;
}

// Recursive solution from user to finish
function solveMaze(maze) {
    let solution = copyMaze(maze);
    let wasHere = copyMaze(maze);
    let stack = [];

    recursiveSolve(startX, startY);

    function recursiveSolve(x, y) {
        // 2 base cases:
        // reached the end
        if (x === finishX && y === finishY) {
            return success(x, y) // done
        }
        // wall or already visited
        if (wasHere[y][x] === wallMarker || wasHere[y][x] === breadCrumbMarker) {
            return false; // don't go here
        }
        // otherwise keep looking for the finish
        wasHere[y][x] = breadCrumbMarker;
        // try left
        if (recursiveSolve(x-1, y)) { 
            return success(x, y);
        }
        // try right
        if (recursiveSolve(x+1, y)) { 
            return success(x, y);
        }
        // try above
        if (recursiveSolve(x, y-1)) {
            return success(x, y);
        }
        // try below
        if (recursiveSolve(x, y+1)) {
            return success(x, y);
        }
        // return false;
    }

    // helper function to reduce repeated code
    function success(x, y) {
        // if position is odd (it's a moveable position not where a wall was)
        if (y % 2 != 0 && x % 2 != 0) {
            // mark the solution on the map
            solution[y][x] = hintMarker; 
            stack.push({x, y});
        }
        // always return true for recursive function
        return true;
    }
    // replace start on top of shortest path (1, 1)
    solution[startY][startX] = startMarker;

    // stack.shift();
    // stack.unshift({x: -5, y:-5})
    stack.pop();
    return {solution, stack};
}


// let m = makeMaze(20);
// showMaze(m);
// let s = solveMaze(m);
// showMaze(s.solution);
// console.log(s.stack);