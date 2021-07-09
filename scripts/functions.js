'use strict';
function checkIfGameOver(gameOver) {
    if (currentX === finishX && currentY === finishY && !gameOver) {
        gameOver = true;
    }
    return gameOver;
}

function playerMoved() {
    if (previousX === currentX && previousY === currentY) {
        return false;
    }
    else{
        return true;;
    }
}

function updateShortestPath(solution, events) {
    let top = solution.pop();
    delete events["p" + top.x + top.y];
    delete events["h" + top.x + top.y];


    if (top.x === currentX && top.y === currentY) {
        // do nothing; top was already moved
    }
    else {
        // replace top
        solution.push(top);
        shortestPathCircle.x = top.x;
        shortestPathCircle.y = top.y;
        events["p" + top.x + top.y] = JSON.parse(JSON.stringify(shortestPathCircle));
        

        // add new
        solution.push({x: previousX, y: previousY})
        shortestPathCircle.x = previousX;
        shortestPathCircle.y = previousY;
        events["p" + previousX + previousY] = JSON.parse(JSON.stringify(shortestPathCircle));
    }
    return solution;
}

function toggleBreadCrumbs(breadCrumbsOn, breadCrumbs, events) {
    if (breadCrumbsOn) {
        for (const [key, value] of Object.entries(breadCrumbs)) {
            breadCrumbCircle.x = value.x;
            breadCrumbCircle.y = value.y;
            events["c"+key] = JSON.parse(JSON.stringify(breadCrumbCircle));
        }
    }
    else {
        for (const [key, value] of Object.entries(breadCrumbs)) {
            delete events["c"+key];
        }

    }
}

function toggleShortestPath(shortestPathOn, solution, events, hintOn) {
    // remove old path always
    for (let i = 0; i < solution.length; i++) {
        delete events["p"+ solution[i].x + solution[i].y];
        delete events["h"+ solution[i].x + solution[i].y];
    }
    // draw path
    if (shortestPathOn) {
        // add new path
        for (let i = 0; i < solution.length; i++) {
            shortestPathCircle.x = solution[i].x;
            shortestPathCircle.y = solution[i].y;
            events["p"+ solution[i].x + solution[i].y] = JSON.parse(JSON.stringify(shortestPathCircle));
        }
    }
    // draw only the top of the stack
    if (hintOn && solution.length > 0) {
        hintCircle.x = solution[solution.length - 1].x;
        hintCircle.y = solution[solution.length - 1].y;
        events["h"+ solution[solution.length - 1].x + solution[solution.length - 1].y] = JSON.parse(JSON.stringify(hintCircle));
    }
}


function calculateScore(score, hintOn, shortestPathOn, breadCrumbs, difficulty, solution) {

    if (hintOn) {
        score -= 3;
    }
    if (shortestPathOn) {
        score -= 20;
    }
    for (const [key, value] of Object.entries(breadCrumbs)) {
        if (currentX === value.x  && currentY === value.y) {
            score -= 2;
        }
    }
    // default score for moving
    score += 1;
    if (currentX === finishX && currentY === finishY) {
        score += difficulty * 10;
    }
    scoreText.text = score;
    return score;
}

function finalizeScore() {
    score /= time;
}

function updateHighScore(highScore, size) {
    let newScore = [scoreText.text, " - " + size + "x" + size]
    highScore.push(newScore);
    highScore = highScore.sort(function(a,b) {
        return b[0]-a[0];
    });

    if (highScore.length > 5) {
        highScore.pop();
    }
    return highScore;
}

function addHighScores(highScore) {
    let hs = document.getElementById("high-score-div");
    hs.innerHTML = "";
    for (let i = 0; i < highScore.length; i++) {
        // console.log(i, highScore[i]);
        let p = document.createElement('p');
        p.innerHTML = highScore[i][0] + highScore[i][1];
        hs.appendChild(p);
    }
}



