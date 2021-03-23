var canvas;

let removeFadingTime = 2; // en secondes
let startingCountdown = false;
let removeCountdown = removeFadingTime * 30 * 2; // removeFadingTime * frameRate * sécurité
let population = 80;

const flock = [];
let alignMult = 2;
let cohesionMult = 2;
let separationMult = 3;
let mouseSeparationMult = 10;
let maxBoidSpeed = 5;

let speedMultiplier;
let minSize = 5;
let maxSize = 30;
let mouseRepelent = 4;
let colorNumber = 20;

function setup(){
    //Making this work
    frameRate(30);
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.position(0, 0);
    canvas.style("z-index", "5000");
    canvas.id('canvas');
    colorMode(HSB, colorNumber);
    //

    for (let i = 0; i < population; i++) {
        flock.push(new Boid());
    }
}
function draw(){

    background(255);
    let mousePosition = createVector(map(mouseX, 0, width, -width/2, width/2), map(mouseY, 0, height, -height/2, height/2));
    console.log("mouse n°"+random(200)+" is here : "+mousePosition);
    for (let boid of flock) {
        boid.edges();
        boid.flock(flock, mousePosition);
        boid.update();
        boid.show();
    }  


    // to remove the canvas after a few seconds when clicked (performances)
    if(startingCountdown == true){
        removeCountdown --;
        if(removeCountdown <= 0){
            canvas.remove();
        }
    }
    //
}






// 
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function mouseClicked(){
    //shutDown();
}
function touchEnded(){
    //shutDown();
}
function shutDown() {
    canvas.style("transition-property", "opacity");
    canvas.style("transition-duration", removeFadingTime+"s");
    canvas.style("opacity", 0);
    let body = select('#body');
    body.style("overflow", 'scroll');
    startingCountdown = true;
}