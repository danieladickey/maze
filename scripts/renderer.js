'use strict';

// An IIFE (Immediately Invoked Function Expression) is a 
// JavaScript function that runs as soon as it is defined.
let Graphics = (function() {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    
    // clears the canvas
    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // draws the lines of the maze
    function drawMaze(maze, width) {
        context.beginPath();
        context.lineWidth = width; 
        context.strokeStyle = 'rgba(0, 0, 0, 1)';


        // draw horizontal walls of the maze
        for (let i = 0; i < maze.length; i+=2) {
            for (let j = 1; j < maze.length; j+=2) {
                if (maze[i][j] === "w") {
                    drawHorizontal(j, i);
                }
            }
        }

        // draw vertical walls of the maze
        for (let i = 1; i < maze.length; i+=2) {
            for (let j = 0; j < maze.length; j+=2) {
                if (maze[i][j] === "w") {
                    drawVertical(j, i);
                }
            }
        }

        context.stroke();
        // finished drawing the maze


        // helper functions to draw maze
        // draws a horizontal line starting at x, y, with length of +200
        function drawHorizontal(x, y) {
            context.moveTo(x * 100 -100, y * 100);
            context.lineTo(x * 100 + 100, y * 100);
        }

        // draws a vertical line starting at x, y, with length of +200
        function drawVertical(x, y) {
            context.moveTo(x * 100, y * 100 - 100);
            context.lineTo(x * 100, y * 100 + 100);
        }
    }

    // draws an image 
    function drawTexture(texture) {
        if (texture.ready) {
            context.save();
            context.translate(texture.center.x, texture.center.y);
            context.rotate(texture.rotation);
            context.translate(-texture.center.x, -texture.center.y);

            context.drawImage(
                texture.image,
                texture.center.x - texture.width/2,
                texture.center.y - texture.height/2,
                texture.width, texture.height);

             context.restore();
        }
    }

    // draws a rectangle
    function drawRectangle(spec) {
        context.save();
    
        context.translate(
            spec.x + spec.width / 2,
            spec.y + spec.height / 2);
        context.rotate(spec.rotation);
        context.translate(
            -(spec.x + spec.width / 2),
            -(spec.y + spec.height / 2));
    
        context.fillStyle = spec.fillStyle;
        context.fillRect(spec.x, spec.y, spec.width, spec.height);
    
        context.strokeStyle = spec.strokeStyle;
        context.strokeRect(spec.x, spec.y, spec.width, spec.height);
    
        context.restore();
    }

    function drawCircle(spec) {
        context.save();

        context.fillStyle = spec.fillStyle;
        context.strokeStyle = spec.strokeStyle;

        context.beginPath();
        context.arc(spec.x * 100, spec.y * 100, spec.radius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();

        context.restore();
    }

    function drawText(spec) {
        document.getElementById(spec.name).innerHTML = spec.message + spec.text;
    }


    return {
        drawText,
        drawCircle,
        drawTexture,
        drawMaze,
        drawRectangle,
        clear
    };
})();
