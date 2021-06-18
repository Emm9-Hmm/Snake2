
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const title = document.getElementById("score");
const livesD = document.getElementById("lives");
class RandomArrayPick{
    constructor(size){
        this.array = new Array(size);
        for(let i=0;i<size;i++){
            this.array[i] = true;
        }
        this.active = size;
    }
    remove(value){
        if(this.array[value]){
            this.array[value] = false;
            this.active = this.active-1;
            return;
        }
        //console.log("You are not using this function as it's supposed to be used:) (Remove)");
    }
    add(value){
        if(!this.array[value]){
            this.array[value] = true;
            this.active = this.active +1;
            return;
        }
        //console.log("You are not using this function as it's supposed to be used:) (add)");
    }
    pickRandom(){
        if(this.active == 0){
            return false;
        }
        let inv = Math.floor(Math.random() * this.active)
        let counter = 0;
        for(let i=0;i<this.array.length;i++){
            if(this.array[i]){
                if(counter == inv){
                    return i;
                }
                counter++;
            }
        }
    }
}
class Cordinates{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    getcopy(){
        return new Cordinates(x,y);
    }
    compare(cordinate){
        if(this.x == cordinate.x && this.y == cordinate.y){
            return true;
        }
        return false;
    }
}
let tileCount = 20;
let titleSize = canvas.width / tileCount - 2;


let newHead = new Cordinates(10,10);
let parts = [new Cordinates(10,10)];
let counterM=0;
let speed = 6;
let counter = 0;

let xVelocity=0;
let yVelocity=0;
let movement=[new Cordinates(0,0)];
let lastMove=[new Cordinates(0,0)];

let score = 0;
let lenght = 1;

let appleX = 5;
let appleY = 5;
let eatenApples = [];
let stop = false;

let ao = [];
let obstacles = [];

let free;
let lives = 3;
let damage = [];
let damagep = -1;
let cleanDamage;
const eatingSound = new Audio("coin.mp3");
const losingSoind = new Audio("losing.mp3");
const youDied = new Audio("YOUDIED.mp3");
const sword = new Audio("sword.mp3");
function drawGame(){
    speed = speed+0.0025;
    newHeadPosition();
    collisions();
    //drawApple();
    drawSnake();
    drawApple();
    //requestAnimationFrame
    //SetTimeOut
    //setInterval
    //element.animate
    if(stop){
        losingSoind.pause();
        losingSoind.currentTime = 0;
        youDied.play();
        ctx.fillStyle = "red";
        ctx.font = "50px Verdana";
        ctx.fillText("YOU DIED", canvas.width / 6.5, canvas.height / 2);
    }else{
        //console.log(speed);
        setTimeout(drawGame,1000/speed);
    }
}
function collisions(){
    checkSeedCollision();
    checkAppleCollision();
    checkBodyCollision();
}
function checkBodyCollision(){
    if(xVelocity==0&&yVelocity==0){
        return;
    }
    collision = false;
    for(i=0;i<parts.length-1;i++){
        if(newHead.compare(parts[i])){
            collision = true;
            break;
        }
    }
    if(collision){
        sword.play();
        for(j=0;j<ao.length;j++){
            if(ao[j].compare(newHead)){
                stop = true;
                break;
            }
        }
        for(j=0;j<damage.length;j++){
            if(newHead.compare(damage[j])){
                stop = true;
                break;
            }
        }
        if(lives == 0){
            stop = true;
        }
        else{
            lives--;
        }
        livesD.innerHTML = "Lives: "+lives;
        for(j=i;j<parts.length;j++){
            if(damage.length>0&&damage[0].compare(parts[j])){
                damage = [];
                damagep = -1;
                cleanDamage = undefined;
            }
            ctx.fillStyle = 'black';
            ctx.fillRect((parts[j].x * tileCount),(parts[j].y * tileCount), titleSize+2,titleSize+2);
           
        }
        for(j=parts.length-1;j>=i;j--){
            if(ao.length>0&&ao[0].compare(parts[j])){
                obstacles.push(ao[0]);
                ctx.fillStyle = 'orange';
                ctx.fillRect((ao[0].x * tileCount)+1,(ao[0].y * tileCount)+1, titleSize,titleSize);
                ao.shift();
            }
        }
        parts = parts.slice(0,i+1);
        lenght = parts.length-1;
        //stop = true;
    }
}
function checkSeedCollision(){
    if(!free.array[newHead.x+newHead.y*20]){
        if(damagep!= -1){
            stop = true;
        }
        //scoreplace
        if(lenght <= 2){
            stop = true;
        }
        if(lives == 0){
            stop = true;
        }
        else{
            losingSoind.pause();
            losingSoind.currentTime = 0;
            losingSoind.play();
            lives--;
        }
        livesD.innerHTML = "Lives: "+lives;
        /*if(damage.length > 0){
            stop = true;
        }*/
        free.add(newHead.x+newHead.y*20);
        damage.push(new Cordinates(parts[0].x,parts[0].y));
    }
}
function drawScore(){
    /*ctx.fillStyle = "black";
    ctx.fillRect(canvas.width-100,0,canvas.width,20);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score "+score, canvas.width-100,20);*/
    title.innerHTML = "Score: "+score;
}
function drawApple(){
    //ctx.globalAlpha = 0.2;
    ctx.fillStyle = 'red';
    ctx.fillRect((appleX * tileCount)+1,(appleY * tileCount)+1, titleSize,titleSize);
}
function checkAppleCollision(){
    if(appleX == newHead.x && appleY == newHead.y){   
        eatingSound.pause();
        eatingSound.currentTime = 0;     
        eatingSound.play();
        free.remove(appleX + appleY * 20);
        pick = free.pickRandom();
        
        appleX = pick % tileCount;
        appleY = (pick - appleX) / tileCount;
        /*
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        */
        score++;
        lenght++;
        drawScore();
    }
}
function drawSnake(){
    let newpart = lenght >= parts.length;
    //if an apple has been eaten
    if(newpart){
        //add a new coordinate to the previous head position (this will be erased two times)
       parts.unshift(new Cordinates(parts[0].x,parts[0].y));
        
    }

    //Erase last position
//    ctx.fillStyle = 'black';
 //   ctx.fillRect((parts[parts.length-1].x * tileCount),(parts[parts.length-1].y * tileCount), titleSize+2,titleSize+2);
    

    ctx.fillStyle = 'yellow';
    ctx.fillRect((parts[0].x * tileCount)+1,(parts[0].y * tileCount)+1, titleSize,titleSize);

    ctx.fillStyle = 'black';
    ctx.fillRect((parts[parts.length-1].x * tileCount),(parts[parts.length-1].y * tileCount), titleSize+2,titleSize+2);
    


    if(ao.length>0&&ao[0].compare(parts[parts.length-1])){
        
        obstacles.push(ao[0]);
        ctx.fillStyle = 'orange';
        ctx.fillRect((ao[0].x * tileCount)+1,(ao[0].y * tileCount)+1, titleSize,titleSize);
        ao.shift();
    }
    for(i=0;i<ao.length;i++){
        //ctx.globalAlpha = 0.01;
        ctx.globalAlpha = 0.10;
        
        ctx.fillStyle = 'yellow';
        ctx.fillRect((ao[i].x * tileCount),(ao[i].y * tileCount), titleSize+2,titleSize+2);
        ctx.globalAlpha = 1;
    }
    for(i=0;i<eatenApples.length;i++){
        ctx.fillStyle = 'blue';
        ctx.fillRect((eatenApples[i].x * tileCount),(eatenApples[i].y * tileCount), titleSize+2,titleSize+2);
        ao.push(eatenApples[i]);
        eatenApples.pop();
    }

    ctx.fillStyle = 'green';
    /*posX = (20 + (parts[0].x + xVelocity))%20;
    posY = (20 +  (parts[0].y + yVelocity))%20;
    ctx.fillRect((posX * tileCount)+1,(posY * tileCount)+1, titleSize,titleSize);
    */
    ctx.fillRect((newHead.x * tileCount)+1,(newHead.y * tileCount)+1, titleSize,titleSize);


    RunningDamage();
    for(let i=parts.length-1;i>0;i--){
        parts[i].x = parts[i-1].x;
        parts[i].y = parts[i-1].y;
    }

    
    parts[0].x = newHead.x;
    parts[0].y = newHead.y;
    if(newpart){
        eatenApples.push(new Cordinates(newHead.x,newHead.y));
    }

}
function RunningDamage(){
    //if(damage.length == 1){
     if(damagep == -1&& damage.length==1){
        ctx.fillStyle = '#A93226';
        ctx.fillRect((parts[0].x * tileCount),(parts[0].y * tileCount), 20,20);
        damage.unshift(new Cordinates(newHead.x,newHead.y));
        damage.push(new Cordinates(parts[1].x,parts[1].y));
        return;
    }
    if(cleanDamage){
        ctx.fillStyle = 'black';
        ctx.fillRect((cleanDamage.x * tileCount),(cleanDamage.y * tileCount), 20,20);
        ctx.fillStyle = 'yellow';
        ctx.fillRect((cleanDamage.x * tileCount)+1,(cleanDamage.y * tileCount)+1, titleSize,titleSize);
    }
    if(damage.length >= 1){
        ctx.fillStyle = '#A93226';
        damagep = damagep+2;
        for(i=0;i<damage.length;i++){
            ctx.fillRect((damage[i].x * tileCount)+1,(damage[i].y * tileCount)+1, titleSize,titleSize);
        }
        cleanDamage = new Cordinates(damage[0].x,damage[0].y);
        
        for(i=0;i<damage.length;i++){
            if(damagep+i>=parts.length-3){
                damage.pop();
                break;
            }
            damage[i] = new Cordinates(parts[damagep+i].x,parts[damagep+i].y);
        }
        if(damage.length == 1){
            cleanDamage = undefined;
        }
        if(damage.length == 0){
            damagep = -1;
            cleanDamage = undefined;
        }
    }
}
function clearScreen(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}
function newHeadPosition(){
/*Movement code
    for(i=0;i<){

    }*/
    xVelocity = 0;
    yVelocity = 0;
    if(counterM > 0){
        movement.shift();
    }
    for(i=0;i<movement.length;i++){
        xVelocity = xVelocity+movement[i].x;
        yVelocity = yVelocity+movement[i].y;
    }
    xLVelocity=0;
    yLVelocity=0;
    for(i=0;i<lastMove.length;i++){
        xLVelocity = xLVelocity+lastMove[i].x;
        yLVelocity = yLVelocity+lastMove[i].y;
    }

    if(xLVelocity + xVelocity == 0&&yLVelocity + yVelocity ==0){
        movement = lastMove.slice(0,lastMove.length);
        xVelocity = xLVelocity*2;
        yVelocity = yLVelocity*2;
    }
    lastMove = movement.slice(0,movement.length);
    movement = movement.slice(-1);
    counterM = 0;

    newHead.x = (20 + (parts[0].x + xVelocity))%20;
    newHead.y = (20 +  (parts[0].y + yVelocity))%20;
}

document.body.addEventListener('keydown',keyDown);

function keyDown(event){
    if(event.keyCode == 38){
        yVelocity = -1;
        xVelocity = 0;
        movement.push(new Cordinates(0,-1));
        counterM++;
        if(counterM>1){
            if(movement[movement.length-2].compare(movement[movement.length-1])){
                movement.pop();
            }
            else{
                if(counterM>2){
                    movement.shift();
                }
            }
        }
        return;
    }
    if(event.keyCode == 40){
        yVelocity = 1;
        xVelocity = 0;
        movement.push(new Cordinates(0,1));
        counterM++;
        if(counterM>1){
            if(movement[movement.length-2].compare(movement[movement.length-1])){
                movement.pop();
            }
            else{
                if(counterM>2){
                    movement.shift();
                }
            }
        }
        return;
    }
    if(event.keyCode == 37){
        yVelocity = 0;
        xVelocity = -1;
        movement.push(new Cordinates(-1,0));
        counterM++;
        if(counterM>1){
            if(movement[movement.length-2].compare(movement[movement.length-1])){
                movement.pop();
            }
            else{
                if(counterM>2){
                    movement.shift();
                }
            }
        }
        return;
    }
    if(event.keyCode == 39){
        yVelocity = 0;
        xVelocity = 1;
        movement.push(new Cordinates(1,0));
        counterM++;
        if(counterM>1){
            if(movement[movement.length-2].compare(movement[movement.length-1])){
                movement.pop();
            }
            else{
                if(counterM>2){
                    movement.shift();
                }
            }
        }
        return;
    }
    
    if(event.keyCode == 13){
        newHead = new Cordinates(10,10);
        parts = [new Cordinates(10,10)];
        counterM=0;
        speed = 6;
        counter = 0;

        xVelocity=0;
        yVelocity=0;
        movement=[new Cordinates(0,0)];
        lastMove=[new Cordinates(0,0)];

        score = 0;
        lenght = 1;

        appleX = 5;
        appleY = 5;
        eatenApples = [];

        ao = [];
        obstacles = [];

        free= new RandomArrayPick(400);
        lives = 3;
        damage = [];
        damagep = -1;
        cleanDamage = undefined;   
        
        if(stop){
            stop = false;
            drawGame();
        }
        clearScreen();
        title.innerHTML = "Score: "+score;
        livesD.innerHTML = "Lives: "+lives;
    }


}   
clearScreen();
free = new RandomArrayPick(400);
drawGame();
title.innerHTML = "Score: "+score;
livesD.innerHTML = "Lives: "+lives;