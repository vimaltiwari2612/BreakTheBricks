var canvas = document.getElementById("myCanvas");
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var ballColors = ["green","red","yellow","blue","Orange","cyan","grey","purple"];
var brickColumnCount = ballColors.length;
canvas.width = document.body.clientWidth; //document.width is obsolete
canvas.height = document.body.clientHeight+((brickHeight+brickOffsetTop )*brickColumnCount ) //document.height is obsolete
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width;
var y = canvas.height;
var dx = 2;
var dy = -2;
var ballspeed=2;
var paddleHeight = 10;
var paddleWidth = 100;
var paddleX = (canvas.width-paddleWidth);
var rightPressed = false;
var leftPressed = false;

var brickRowCount = parseInt(x/brickWidth ) - 2;
var score = 0;
var lives = 4;
var ballColor="black";
var pallateColor="black";
var isGameEnded=false;
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 ,color:""};
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchmove", touchStartHandler, false);
document.addEventListener("touchstart", touchStartHandler, false);
document.addEventListener("touchend", mouseMoveHandler, false);

function keyDownHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = true;
  }
  else if(e.keyCode == 37) {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = false;
  }
  else if(e.keyCode == 37) {
    leftPressed = false;
  }
}


function touchStartHandler(e) {
 var relativeX= e.clientX || e.targetTouches[0].pageX; //the same syntax for the x value
 if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
		  ballColor=b.color;
          score++;
          if(score == brickRowCount*brickColumnCount) {
            alert("YOU WIN, CONGRATS!\n Hit Refresh to play again...!");
		isGameEnded=true;
		 ctx.clearRect(0, 0, canvas.width, canvas.height);
		return;
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = pallateColor;
  ctx.fill();
  ctx.closePath();
}
function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
		bricks[c][r].color = ballColors[c];
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = ballColors[c];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(isGameEnded) return;
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy < ballRadius) {
    dy = -dy;
  }
  else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
      lives--;
      if(!lives) {
        drawLives();
        alert("GAME OVER.\nHit Refresh to play again...!");
	isGameEnded=true;
		return;
      }
      else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += ballspeed*dx;
  y += ballspeed*dy;
  requestAnimationFrame(draw);
}

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

alert("Classic brick-breaker game.\nUse the paddle in order to keep the ball in the game & hit the bricks. \nYour mission is remove all the breakable bricks by hitting them with the ball.\n\n Let's get started...!!");

draw();	