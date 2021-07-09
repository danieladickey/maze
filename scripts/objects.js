'use strict';

let background = {
    name: "background",
    type: "texture",
    imageSrc: 'images/grass.jpg',
    center: { x: 2000, y: 2000},
    width: 5000,
    height: 4000,
    rotation: 0,
    ready : false,
    image : new Image()
};
background.image.onload = function() {
    background.ready = true;
};
background.image.src = background.imageSrc;

let startRectangle = {
    name: "startRectangle",
    type: "rectangle",
    x: 100 - 50,
    y: 100 - 50,
    width: 100,
    height: 100,
    fillStyle: 'rgba(0, 255, 0, 1)',
    strokeStyle: 'rgba(0, 255, 0, 1)',
    rotation: 0
};

let finishRectangle = {
    name: "finishRectangle",
    type: "rectangle",
    x: finishX * 100 - 50,
    y: finishY * 100 - 50,
    width: 100,
    height: 100,
    fillStyle: 'rgba(255, 0, 0, 1)',
    strokeStyle: 'rgba(255, 0, 0, 1)',
    rotation: 0
};

let userCircle = {
    name: "userCircle",
    type: "circle",
    x: 1,
    y: 1,
    radius: 80,
    fillStyle: 'rgba(0, 0, 255, .5)',
    strokeStyle: 'rgba(0, 0, 255, 1)'
}

let breadCrumbCircle = {
    name: "breadCrumbCircle",
    type: "circle",
    x: 1,
    y: 1,
    radius: 20,
    fillStyle: 'rgba(255, 255, 0, 1)',
    strokeStyle: 'rgba(255, 255, 0, 1)'
}  

let hintCircle = {
    name: "hintCircle",
    type: "circle",
    x: 1,
    y: 1, 
    radius: 50,
    fillStyle: 'rgba(138,43,226, .4)',
    strokeStyle: 'rgba(138,43,226, 1)'
}

let shortestPathCircle = {
    name: "hintCircle",
    type: "circle",
    x: 1,
    y: 1, 
    radius: 30,
    fillStyle: 'rgba(255, 128, 0, .6)',
    strokeStyle: 'rgba(255, 128, 0, 1)'
}

let scoreText = {
    name: "score",
    type: "text",
    interval: 1000,
    timeSinceRendered: 1000,
    message: "Score: ",
    text: 0
}

let timerText = {
    name: "time",
    type: "text",
    interval: 1000, //ms
    timeSinceRendered: 1000,
    message: "Time: ",
    text: 0
}

let highScoreText = {
    name: "highScore",
    type: "text",
    interval: 1000, //ms
    timeSinceRendered: 1000,
    message: "",
}