console.log("Welcome to the Sanke Game.\n");

let wlp = Math.trunc(Math.random()*4 + 2);
console.log(wlp);
document.querySelector('.GameBody').src = `/WebDev_Projects/Project_6-SnakeGame/Contents/wp-${wlp}.png`;

let eatMp3 = new Audio("/WebDev_Projects/Project_6-SnakeGame/Contents/eat.wav");
let gamePlayMp3 = new Audio("/WebDev_Projects/Project_6-SnakeGame/Contents/gamePlay.wav");
let gameStartMp3 = new Audio("/WebDev_Projects/Project_6-SnakeGame/Contents/gameStart.wav");
let highScoreMp3 = new Audio("/WebDev_Projects/Project_6-SnakeGame/Contents/highScore.wav");
let hitMp3 = new Audio("/WebDev_Projects/Project_6-SnakeGame/Contents/hit.wav");
let lostMp3 = new Audio("/WebDev_Projects/Project_6-SnakeGame/Contents/lost.wav");
let turnMp3 = new Audio("/WebDev_Projects/Project_6-SnakeGame/Contents/turn1.wav");
let music = new Audio("/WebDev_Projects/Project_6-SnakeGame/Contents/into.mp3");

// Snake Up-Coming Movement Paths
let inputDirection = {x: 0, y: 0};
let maxScore = 0;
let score = 0;
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [
    {x: 15, y: 15}
];
let levelSetter = 0;
let foodCrd = {x: 20, y: 20};
let boardWidth = 31;
let boardHeight = 31;
let food_xCrd = 0;
let food_yCrd = 0;
let levelScores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let gameLevel = 1;

document.querySelector('.numInput').value = gameLevel;

let oldSet = document.querySelector('.numInput');
let newSet = document.createElement('div');
newSet.classList.add('numInput');
newSet.innerHTML = oldSet.innerHTML;



// function reset() {
//     document.querySelector('.numInput').addEventListener('keypress', function(pbtn) {
//         if (pbtn.key === 'Enter') {
//             levelSetter++;
//             gameLevel = document.querySelector('.numInput').value;
//             newSet.innerText = gameLevel;
//             oldSet.parentNode.replaceChild(newSet, oldSet);
//             gameLevel = document.querySelector('.numInput').innerText;
            
//             if (gameLevel < 1) {
//                 gameLevel = 1;
//             }
//             else if (gameLevel >= 1 && gameLevel <= 15) {
//                 speed = gameLevel;
//             }
//             else {
//                 gameLevel = 15;
//                 newSet.innerText = 15;
//                 speed = 15;
//             }
//         }
//     });
// }

document.querySelector('.numInput').addEventListener('keypress', function(pbtn) {
    if (pbtn.key === 'Enter') {
        levelSetter++;
        gameLevel = document.querySelector('.numInput').value;
        newSet.innerText = gameLevel;
        oldSet.parentNode.replaceChild(newSet, oldSet);
        gameLevel = document.querySelector('.numInput').innerText;
        
        if (gameLevel < 1) {
            gameLevel = 1;
        }
        else if (gameLevel >= 1 && gameLevel <= 15) {
            speed = gameLevel;
        }
        else {
            gameLevel = 15;
            newSet.innerText = 15;
            speed = 15;
        }
    }
});



// Game Function
function mainGameFunction(ctime) {
    window.requestAnimationFrame(mainGameFunction);
    // console.log(ctime);

    if ((ctime - lastPaintTime)/1000 < 1/speed) {
        return;
    }
    lastPaintTime = ctime;

    gameEngine();
}

function isCollide(snake) {
    
    // Case 1: If the Snake bumps into itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snakeArr[0].y) {
            return true;
        }
    }

    // Case 2: If the Snake bumps into the walls
    if (snake[0].x <= 0 || snake[0].x >= boardWidth || snake[0].y <= 0 || snake[0].y >= boardHeight) {
        return true;
    }
}


// Main Function of the Game
function gameEngine() {
    // Part 1: Updating the snake array
    if(isCollide(snakeArr)) {
        gamePlayMp3.pause();
        hitMp3.play();
        inputDirection = {x: 0, y: 0};

        if (score*gameLevel > maxScore) {
            document.querySelector('.hgScore').innerText = score*gameLevel;
            maxScore = score*gameLevel;
        }
        score = 0;
        document.querySelector('.currScore').innerText = 0;

        let x_start = Math.trunc(boardWidth/2);
        let y_start = Math.trunc(boardHeight/2);
        snakeArr = [{x: x_start, y: y_start}];
        score = 0;
        setTimeout(() => {
            lostMp3.play();
        }, 500);

        setTimeout(() => {
            alert("GAME OVER. Press any key to PLAY AGAIN.");
        }, 1200);
        
        // let oldSet = document.querySelector('.numInput');
        // let newSet = document.createElement('input');
        // newSet.type = 'number';
        // newSet.classList.add('numInput');
        // newSet.innerHTML = oldSet.innerHTML;
        // oldSet.parentNode.replaceChild(newSet, oldSet);
        // newSet.innerText = 1;
        // reset();
        

        gameStartMp3.play();
        setTimeout(() => {
            lostMp3.pause();
            hitMp3.pause();
            gamePlayMp3.loop = true;
            // gamePlayMp3.play();
        }, 2000);
    }

    // If you have eaten the food, increment the score & regenerate the food
    if (snakeArr[0].x === foodCrd.x && snakeArr[0].y === foodCrd.y) {
        eatMp3.pause();
        eatMp3.play();
        score++;
        document.querySelector('.currScore').innerText = levelScores[gameLevel]*score;
        let addObjCrd = {x: snakeArr[0].x + inputDirection.x, y: snakeArr[0].y + inputDirection.y};
        snakeArr.unshift(addObjCrd);

        let a = 1;
        let b = 31;
        food_xCrd = Math.round(a + (b-a)* Math.random());
        food_yCrd = Math.round(a + (b-a)* Math.random());
        foodCrd = {x: food_xCrd, y: food_xCrd};
    }

    // Movement of the Snake in the Game
    for (let i = snakeArr.length-2; i >= 0; i--) {
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDirection.x;
    snakeArr[0].y += inputDirection.y;


    // Part 2: Display the Snake and Food
    // Part 2.1 : Displaying the Snake
    board.innerHTML = "";
    snakeArr.forEach((ele, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = ele.y;
        snakeElement.style.gridColumnStart = ele.x;

        if (index === 0) {
            snakeElement.classList.add('SnakeHead');
        }
        else {
            snakeElement.classList.add('SnakeBody');
        }
        board.appendChild(snakeElement);
    });

    // Part 2.2 : Displaying the Food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = foodCrd.y;
    foodElement.style.gridColumnStart = foodCrd.x;

    foodElement.classList.add('SnakeFood');
    board.appendChild(foodElement);

}




//Main Game Logic
window.requestAnimationFrame(mainGameFunction);

window.addEventListener('keydown', function(ele) {
    inputDirection = {x: 0, y: 0}; // Starts the Game
    turnMp3.play();

    switch(ele.key) {
        case "ArrowUp":
            console.log("ArrowUp");

            inputDirection.x = 0;
            inputDirection.y = -1;
            break;
        case "ArrowLeft":
            console.log("ArrowLeft");
            
            inputDirection.x = -1;
            inputDirection.y = 0;
            break;
        case "ArrowDown":
            console.log("ArrowDown");
            
            inputDirection.x = 0;
            inputDirection.y = 1;
            break;
        case "ArrowRight":
            console.log("ArrowRight");
            
            inputDirection.x = 1;
            inputDirection.y = 0;
            break;
        default:
            break;
    }

})