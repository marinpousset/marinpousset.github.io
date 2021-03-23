// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

class Boid {
    constructor() {
      this.position = createVector(random(-width/2, width/2), random(-height/2, height/2));
      this.velocity = p5.Vector.random2D();
      this.velocity.setMag(random(2, 4));
      this.acceleration = createVector();
      this.maxForce = 0.2;
      this.maxSpeed = maxBoidSpeed;
      this.size = random(minSize, maxSize);
      this.perception = 35;
      this.color = random(colorNumber);

    }
  
    edges() {
      if (this.position.x > width/2) {
        this.position.x = -width/2;
      } else if (this.position.x < -width/2) {
        this.position.x = width/2;
      }
      if (this.position.y > height/2) {
        this.position.y = -height/2;
      } else if (this.position.y < -height/2) {
        this.position.y = height/2;
      }
    }
  
    align(boids) {
      let steering = createVector();
      let total = 0;
      for (let other of boids) {
        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (other != this && d < this.perception) {
            let boidColor = this.color;
            if(dist(boidColor, other.color)> colorNumber/2){
                if(boidColor < other.color){
                    boidColor += 20;
                } else {
                    boidColor -= 20;
                }
            }

          let otherBoidVelocity = other.velocity;
          otherBoidVelocity.mult(map(dist(boidColor, other.color), colorNumber/2, 0, 0, 2));
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
          

          if (d < this.perception*mouseRepelent) {
            let diff = p5.Vector.sub(this.position, mousePosition);
            diff.div(d * d);
            steering.add(diff);
            total++
            console.log("mouse repeled a boid");
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
        if (other != this && d < this.perception*3) {
            let boidColor = this.color;
            if(dist(boidColor, other.color)> colorNumber/2){
                if(boidColor < other.color){
                    boidColor += 20;
                } else {
                    boidColor -= 20;
                }
            }
          let otherBoidPosition = other.position;
          otherBoidPosition.mult(map(dist(boidColor, other.color), colorNumber/2, 0, 0, 3));
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
        console.log("boid position is "+this.position);
  
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
      //strokeWeight(6);
      //stroke(255);
      //point(this.position.x, this.position.y);
      fill(this.color, colorNumber, colorNumber*0.75);
      noStroke();
      ellipse(this.position.x, this.position.y, this.size, this.size)
    }
  }
  