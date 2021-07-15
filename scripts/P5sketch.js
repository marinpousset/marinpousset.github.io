var canvas;

let removeFadingTime = 1; // en secondes
let startingCountdown = false;
let removeCountdown = removeFadingTime * 30 * 1.1; // removeFadingTime * frameRate * sécurité
let population = 40;

const flock = [];
let alignMult = 1.5;
let cohesionMult = 1;
let separationMult = 2;
let mouseSeparationMult = 30;
let maxBoidSpeed = 5;

let speedMultiplier;
let minSize = 0.5;
let maxSize = 1;
let mouseRepelent = 10;
let colorNumber = 10;

function setup() {
    //Making this work
    frameRate(30);
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.position(0, 0);
    canvas.style("z-index", "-50");
    canvas.style("position", "fixed");
    canvas.id('canvas');
    canvas.background(255, 255, 255);
    colorMode(HSB, colorNumber);
    //

    for (let i = 0; i < population; i++) {
        flock.push(new Boid());
    }

    bg = createGraphics(width, height);
    bg.background(255, 20);
    bg.noStroke();
    for (let i = 0; i < 300000; i++) {
        let x = random(width);
        let y = random(height);
        let s = noise(x * 0.01, y * 0.01) * 2;
        bg.fill(240, 50);
        bg.rect(x, y, s, s);
    }
            pg = createGraphics(width, height, WEBGL)
            pg.background(0, 0);
            image(pg, 0, 0);
            
}

function draw() {

    //background(255);
    let mousePosition = createVector(map(mouseX, 0, width, -width / 2, width / 2), map(mouseY, 0, height, -height / 2, height / 2));
    //console.log("mouse n°"+random(200)+" is here : "+mousePosition);
    for (let boid of flock) {
        boid.edges();
        boid.flock(flock, mousePosition);
        boid.update();
        boid.show();
    }


    // to remove the canvas after a few seconds when clicked (performances)
    if (startingCountdown == true) {
        removeCountdown--;
        if (removeCountdown <= 0) {
            canvas.remove();
        }
    }
    //
    image(bg, -windowWidth / 2, -windowHeight / 2);

            
}






// 
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    bg = createGraphics(width, height);
    bg.background(255, 20);
    bg.noStroke();
    for (let i = 0; i < 300000; i++) {
        let x = random(width);
        let y = random(height);
        let s = noise(x * 0.01, y * 0.01) * 2;
        bg.fill(240, 50);
        bg.rect(x, y, s, s);
    }
}

function mouseClicked() {
    //shutDown();
}

function touchEnded() {
    //shutDown();
}

function shutDown() {
    canvas.style("transition-property", "opacity");
    canvas.style("transition-duration", removeFadingTime + "s");
    canvas.style("opacity", 0);
    let body = select('#body');
    body.style("overflow", 'scroll');
    startingCountdown = true;
}