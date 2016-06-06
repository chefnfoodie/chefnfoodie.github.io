// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // initial loc
    this.x = x;
    this.y = y;
    this.yValues = [80,160,240];
    this.speedMod = getRandomValue(150,500);
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter// which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speedMod * dt;
    if (this.x >505) {
        this.reset();
    }
};

// Reset the enemy to initial position if collision with player or on reaching water
Enemy.prototype.reset = function () {
    this.x = -130 ;
    this.y = this.getRandomY();
    this.speedMod = getRandomValue(120,505);
};

// Generate random y axis values
Enemy.prototype.getRandomY = function() {
    return this.yValues[Math.floor(Math.random() * this.yValues.length)];
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Generate random integer between max and min numbers
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var Jewel = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our jewels, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Gem-Orange.png';
    // initial loc
    this.yValues = [80,160,240];
    this.xValues = [0,100,200,300,400];
    this.x = this.getRandomX();
    this.y = this.getRandomY();
};

Jewel.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Jewel.prototype.update = function() {
    var jewel = this;
    if (this.y >= 80 && this.y <= 240) {
        // is the jewel on the same row as the player?
        if (jewel.y === player.y &&  jewel.x >= player.x - 30 &&  jewel.x <= player.x + 30) {
            player.jewelCounter += 1;
            this.reset();
        }
    }
};

Jewel.prototype.reset = function() {
    this.x = this.getRandomX();
    this.y = this.getRandomY();
};

Jewel.prototype.getRandomY = function() {
    return this.yValues[Math.floor(Math.random() * this.yValues.length)];
};

Jewel.prototype.getRandomX = function() {
    return this.xValues[Math.floor(Math.random() * this.xValues.length)];
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.xRange = [-2, 402];
    this.yRange = [-20, 380];
    this.sprite = 'images/char-boy.png';
    this.reset();
    this.hitCounter = 0;
    this.jewelCounter = 0;
    this.missCounter = 0;
};

Player.prototype.update = function() {
    if (this.y >= 80 && this.y <= 240) {
        //between the three rows and use the player variable to be accesed inside  allEnemies loop
        var player = this;
        allEnemies.forEach(function(enemy) {
        // check if coordinates of enemy is on top of player
        if (enemy.y === player.y &&  enemy.x >= player.x - 30 && enemy.x <= player.x + 30) {
            player.missCounter += 1;
            player.reset();
        }});
    } else if (this.y === 0) {
        // if player reaches water, increase score and reset
        this.hitCounter += 1;
        this.reset();
    }
};

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    switch(key) {
        case "left":
        this.x -= (this.x - 100 < this.xRange[0]) ? 0 : 100;
        break;
        case "right":
        this.x += (this.x + 100> this.xRange[1]) ? 0 : 100;
        break;
        case "up":
        this.y -= (this.y - 80 < this.yRange[0]) ? 0 : 80;
        break;
        case "down":
        this.y += (this.y + 80 > this.yRange[1]) ? 0 : 80;
        break;
    }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies[0] = new Enemy(-100,80);
allEnemies[1] = new Enemy(-200,160);
allEnemies[2] = new Enemy(-250,240);
var jewel = new Jewel();
var player = new Player();

// fn : a timed game and show the score with hits, misses and no. of jewels acquired
function startTime(gameStartTime, resetCounterFlag) {
    // initialize the score flags to zero if resetCounterFlag is true.
    // resetCounterFlag is true only when start button is clicked
    if(resetCounterFlag) {
        player.hitCounter = 0;
        player.missCounter = 0;
        player.jewelCounter = 0;
    }
    var total;
    var formattedPlaytime;
    var t;
    var currentTime = new Date();
    // time playing the game is the difference of the start time from current time
    var differenceInMillisecs = currentTime.getTime() - gameStartTime.getTime();
    // if time playing the game exceeds 30 secs show score and enable starting the game again
    if(differenceInMillisecs/1000 > 30) {
        window.alert("Game over");
        formattedPlaytime = formatMillisecondsToStr(differenceInMillisecs);
        document.getElementById('gameTime').innerHTML = "Play Time: " + formattedPlaytime;
        total = player.hitCounter + player.jewelCounter;
        document.getElementById('hitCounter').innerHTML = "Score: " + total;
        document.getElementById('missCounter').innerHTML = "Misses: " + player.missCounter;
        document.getElementById('startButton').disabled = false;
    }
    // if game is on disable start button,
    else {
        document.getElementById('startButton').disabled = true;
        formattedPlaytime = formatMillisecondsToStr(differenceInMillisecs);
        document.getElementById('gameTime').innerHTML = "Play Time: " + formattedPlaytime;
        t = setTimeout(function(){startTime(gameStartTime, false);},1);
        total = player.hitCounter + player.jewelCounter;
        document.getElementById('hitCounter').innerHTML = "Score: " + total;
        document.getElementById('missCounter').innerHTML = "Misses: " + player.missCounter;
    }
}

// When playtime is more than 1 second ,add s at the end for example to make it 2 second's'
function checkEndingNumber(value) {
    if(value > 1)
        return 's';
    else
        return '';
}

// generic function to convert milliseconds into a string in "years days hours minutes seconds" format
// in this game used for seconds
function formatMillisecondsToStr (milliseconds) {
    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    var fomattedTime = "";
    if (years) {
        fomattedTime += years + ' year' + checkEndingNumber(years) + ' ';
    }
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        fomattedTime += days + ' day' + checkEndingNumber(day) + ' ';
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        fomattedTime += hours + ' hour' + checkEndingNumber(hours) + ' ';
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        fomattedTime += minutes + ' minute' + checkEndingNumber(minutes) + ' ';
    }
    var seconds = temp % 60;
    if (seconds) {
        fomattedTime += seconds + ' second' + checkEndingNumber(seconds) + ' ';
    }
    return fomattedTime;
}



