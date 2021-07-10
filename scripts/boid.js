class Boid {
  constructor() {
    this.position = createVector(random(-width / 2, width / 2), random(-height / 2, height / 2));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = maxBoidSpeed;
    this.size = random(minSize, maxSize);
    this.perception = 20;
    this.color = random(colorNumber);

    this.fcm = random(80, 200);
    this.vNum = random(6, 12);
    //   this.nm = random(40, 60);
    //  this.sm = random(10, 150);

    this.nm = 10;
    this.sm = 10;

  }

  edges() {
    if (this.position.x > width / 2) {
      this.position.x = -width / 2;
    } else if (this.position.x < -width / 2) {
      this.position.x = width / 2;
    }
    if (this.position.y > height / 2) {
      this.position.y = -height / 2;
    } else if (this.position.y < -height / 2) {
      this.position.y = height / 2;
    }
  }

  align(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < this.perception) {
        let boidColor = this.color;
        if (dist(boidColor, other.color) > colorNumber / 2) {
          if (boidColor < other.color) {
            boidColor += 20;
          } else {
            boidColor -= 20;
          }
        }

        let otherBoidVelocity = other.velocity;
        otherBoidVelocity.mult(map(dist(boidColor, other.color), colorNumber / 2, 0, -2, 2));
        steering.add(otherBoidVelocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < this.perception) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  mouseSeparation(mousePosition) {
    let steering = createVector();
    let d = dist(this.position.x, this.position.y, mousePosition.x, mousePosition.y);
    let total = 0;


    if (d < this.perception * mouseRepelent) {
      let diff = p5.Vector.sub(this.position, mousePosition);
      diff.div(d * d);
      steering.add(diff);
      total++
      //console.log("mouse repeled a boid");
    }
    if (total > 0) {
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }

    return steering;
  }

  cohesion(boids) {

    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < this.perception * 3) {
        let boidColor = this.color;
        if (dist(boidColor, other.color) > colorNumber / 2) {
          if (boidColor < other.color) {
            boidColor += 20;
          } else {
            boidColor -= 20;
          }
        }
        let otherBoidPosition = other.position;
        otherBoidPosition.mult(map(dist(boidColor, other.color), colorNumber / 2, 0, -3, 3));
        steering.add(otherBoidPosition);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids, mousePosition) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);
    let mouseSeparation = this.mouseSeparation(mousePosition);

    alignment.mult(alignMult);
    cohesion.mult(cohesionMult);
    separation.mult(separationMult);
    mouseSeparation.mult(mouseSeparationMult);
    //console.log("boid position is "+this.position);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
    this.acceleration.add(mouseSeparation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    //this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    //strokeWeight(this.size);
    //stroke(this.color, colorNumber, colorNumber*0.75);
    //point(this.position.x, this.position.y);
    //fill(this.color, colorNumber, colorNumber*0.75);
    fill(this.color / 2 + colorNumber / 3, colorNumber, colorNumber * 0.90);
    noStroke();

    push();
    //rotate(frameCount/this.fcm);
    //scale(this.size);
    translate(this.position.x, this.position.y);

    let dr = TWO_PI / this.vNum;
    beginShape();
    for (let i = 0; i < this.vNum + 3; i++) {
      let ind = i % this.vNum;
      let rad = dr * ind;
      let r = height * 0.03 * this.size + noise(frameCount / this.nm + ind) * height * 0.01 * this.size + sin(frameCount / this.sm + ind) * height * 0.005 * this.size;
      curveVertex(cos(rad) * r, sin(rad) * r);
    }
    endShape();
    pop();

  }
}