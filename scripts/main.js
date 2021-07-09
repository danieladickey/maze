function main() {
    'use strict';
    let previousTimeStamp = performance.now(); // Track last time updated
    let events = {}; // Events that are active in game
    let renderList = {}; // Events that need to be rendered this frame
    let size = 5;
    let inputArray = []; // Array to hold current user input
    let breadCrumbs = {}; // Empty array to hold previous locations of user
    let hintOn = false;
    let breadCrumbsOn = false;
    let shortestPathOn = false;
    let gameOver = true;
    let keyIsDown = false;
    let score = 0;
    let time = 0;
    let difficulty = 0;
    let highScore = [];
    let hs = "";

    // generates a random maze
    let theMaze = makeMaze(size);
    // generates solution
    let solution = solveMaze(theMaze).stack; // object with maze with solution marked and stack

    let newGameButton = document.getElementById("new-game-button"); // get js version of button
    newGameButton.addEventListener("click", newGame); // call newGame when clicked
    

    // Game ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    // move character 
    function moveCharacter(key) {
        // save last location
        previousX = currentX;
        previousY = currentY; 

        // can the player move up?
        if (key === 'ArrowUp' || key === 'w' || key === 'i') {
            if (theMaze[currentY - 1][currentX] !== wallMarker) {
                currentY = currentY - 2;
            }
        }
        // can the player move left?
        if (key === 'ArrowLeft' || key === 'a' || key === 'j') {
            if (theMaze[currentY][currentX - 1] !== wallMarker) {
                currentX = currentX - 2;
            }
        }
        // can the player move down?
        if (key === 'ArrowDown' || key === 's' || key === 'k') {
            if (theMaze[currentY + 1][currentX] !== wallMarker) {
                currentY = currentY + 2;
            }
        }
        // can the player move right?
        if (key === 'ArrowRight' || key === 'd' || key === "l" ) {
            if (theMaze[currentY][currentX + 1] !== wallMarker) {
                currentX = currentX + 2;
            }
        }
        // add breadcrumbs as player moves
        if ((previousX !== 1 || previousY !== 1) && (previousX !== finishX || previousY !== finishY)) {
            breadCrumbs[previousX.toString() + previousY.toString()] = {x: previousX, y: previousY};
        }
    }

    // change game settings based off of user input
    function adjustSettings(key) {
        // Toggle hint on or off
        if (key === 'h') {
            if (hintOn) {
                hintOn = false;
            }
            else {
                hintOn = true;
            }
        }
        // Toggle bread crumbs on or off
        if (key === 'b') {
            if (breadCrumbsOn) {
                breadCrumbsOn = false;
            }
            else {
                breadCrumbsOn = true;
            }
        }
        // Toggle shortest path on or off
        if (key === 'p') {
            if (shortestPathOn) {
                shortestPathOn = false;
            }
            else {
                shortestPathOn = true;
            }
        }
    }

    // makes a new game of selected size
    function newGame(e) {
        e.preventDefault(); // prevents page from reloading...

        gameOver = false;
        breadCrumbs = {};
        events = {};
        solution = {};
        

        size = parseInt(document.getElementById("size-drop-down").value);
        let canvasSize = size * 200; 
        let canvas = document.getElementById("canvas");
        canvas.setAttribute("width", canvasSize);
        canvas.setAttribute("height", canvasSize);
        
        theMaze = makeMaze(size);
        solution = solveMaze(theMaze).stack;

        time = 0;
        previousTimeStamp = 0;
        difficulty = solution.length;
        score = 0;
        scoreText.text = 0;

        createGame();



        // unselects the new game button so user can use keyboard to control player
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
              window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
              window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }
    }

    // preload events that are needed for a game
    function createGame() {
        events[background.name] = background;
        events["maze"] = theMaze;
        events[startRectangle.name] = startRectangle;
        events[finishRectangle.name] = finishRectangle;
        events[scoreText.name] = scoreText;
        events[timerText.name] = timerText;
    }


    // Game Loop Functions ##########################################################

        
    function processInput() {
        if (!gameOver) {
            for (let input in inputArray) {
                moveCharacter(input);
                adjustSettings(input);
    
                if (playerMoved()) {
                    // updates shortest path when player has moved
                    solution = updateShortestPath(solution, events);
                    score = calculateScore(score, hintOn, shortestPathOn, breadCrumbs, difficulty, solution);
                    highScore = updateHighScore(highScore, size);
                }
            }
            inputArray = [];
        }
        
    }

    function update(timeStamp) {

        // Stuff to update every time:
        gameOver = checkIfGameOver(gameOver, highScore, size);
        highScoreText.message = hs;
        startRectangle.rotation += Math.PI / 100;
        finishRectangle.rotation += Math.PI / 100;

        userCircle.x = currentX;
        userCircle.y = currentY;

        // update status of breadcrumbs
        toggleBreadCrumbs(breadCrumbsOn, breadCrumbs, events);

        // update status of shortest path or hint
        toggleShortestPath(shortestPathOn, solution, events, hintOn);

        if (!gameOver) {
            // add user last to ensure it's on top of everything else
            delete events[userCircle.name];
            events[userCircle.name] = userCircle;
        }

        addHighScores(highScore);

        time = timeStamp;
        timerText.text = Math.trunc(time / 1000);


        finishRectangle.x = finishX * 100 - 50;
        finishRectangle.y = finishY * 100 - 50;
        // Add events to renderList if they need to be rendered
        for (const [key, value] of Object.entries(events)) {
            value.timeSinceRendered += timeStamp;
            if (value.interval <= value.timeSinceRendered) {
                value.timeSinceRendered -= value.interval;
                renderList[key] = value;
            }
            // render constant objects
            else if (value.interval === undefined) {
                renderList[key] = value;
            }
        }
    }

    function render() {
        Graphics.clear(); // clear the canvas in preparation for rendering

        // go through each object "in RenderList" and render it appropriately by type
        for (const [key, value] of Object.entries(renderList)) {
            if (value.type === "texture") {
                Graphics.drawTexture(value);
            }
            else if (key === "maze") {
                Graphics.drawMaze(value, size * .75);
            }
            else if (value.type === "rectangle") {
                Graphics.drawRectangle(value);
            }
            else if (value.type === "circle") {
                Graphics.drawCircle(value);
            }
            else if (value.type === "text") {
                Graphics.drawText(value);
            }
        }
        renderList = {};
    }

    function gameLoop(timeStamp) {
        let elapsedTime = timeStamp - previousTimeStamp;
        processInput(); 
        update(elapsedTime);
        render();
        requestAnimationFrame(gameLoop);
    }
    
    // capture input
    window.addEventListener('keydown', function(event) {
        if (!keyIsDown) {
            inputArray[event.key] = event.key;  
        }
        keyIsDown = true;
    });

    // prevent user from moving more than one space at a time
    window.addEventListener('keyup', function(event) {
        keyIsDown = false;
    })

    // Start game loop
    requestAnimationFrame(gameLoop);
}


main();