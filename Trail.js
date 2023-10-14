class Trail {
    constructor(colourPalette) {
      this.create();
      
      // colour
      this.colourPalette = colourPalette;
      this.triggered = false;
    }
    
    create() {
      // motion
      this.dir = createVector(0, 0);
      this.vel = createVector(0, 0);
      this.pos = createVector(random(0, width), random(0, height))
      this.speed = random(0.05, 0.1); // TODO: speed
      
      // size
      // TODO: size range?
      this.minWidth = random(SCREEN_SIZE/300, SCREEN_SIZE/500);
      this.size = this.minWidth;
      this.maxWidth = random(SCREEN_SIZE/100, SCREEN_SIZE/200) //random(5, 10);
      
      // life cycle
      this.maxLife = floor(random (100, 700));
      this.life = 0;
      this.growRate = 255/ (this.maxLife);
      
      // colour
      this.colour = random(this.colourPalette);
      this.a = 0;
      
      this.isFaded = false;
    }
  
    
    update(closestPt) {
      if(!this.isFaded) {
        // position
        // 3D noise space gradually changes over time frameCount/80000
        var angle = noise(this.pos.x / noiseScale , this.pos.y / noiseScale) * TWO_PI; // TODO: noise scale?
        this.dir.x = cos(angle);
        this.dir.y = sin(angle);
        
        this.vel = this.dir.copy();
        this.vel = this.dir.mult(this.speed)
        this.pos.add(this.vel);

        
        
        if(closestPt != null){
          // calculate if the star is within the bright range
          let distance = sqrt(sq(this.pos.x - closestPt.x) + sq(this.pos.y - closestPt.y));

          // triggered
          if(distance < 100) { // TODO: responsive size
            //reset life span to grow brighter
            this.life = 0;
            this.triggered = true;
          } 
        }

        // triggered -> getting bigger
        if(this.triggered) {
          // reveal
          if(this.life < 0.4 * this.maxLife) {
            this.a += this.growRate * 3; 
            this.size = lerp(this.size, this.maxWidth * 3, 0.03);
          }
          // fade out
          else if((this.life > 0.4 * this.maxLife)){
            this.a -= this.growRate * 3;
            this.size = lerp(this.size, this.minWidth * 3, 0.005);
          }
          this.life += 10; 
        } 

        // normal stars
        else {
          // reveal
          if(this.life < 0.4 * this.maxLife) {
            this.a += this.growRate; 
            this.size = lerp(this.size, this.maxWidth, 0.01);
          }
          // fade out
          else if((this.life > 0.6 * this.maxLife)){
            this.a -= this.growRate;
            this.size = lerp(this.size, this.minWidth, 0.005);
          }
          this.life ++;
        }

        // check if the trail is already faded
        if(this.life > this.maxLife) {
          this.isFaded = true;
        }
      }
      
    }
  
    checkRecreate() {
      if ( // outside boundary
        this.pos.x > width + 10 ||
        this.pos.x < -10 ||
        this.pos.y > height + 10||
        this.pos.y < -10 ||
        // faded
        this.isFaded
      ) {
        this.pos.x = random(0, width);
        this.pos.y = random(0, height);
        this.create();
        
      }
    }
  
    display() {
      fill(this.colour[0], this.colour[1], this.colour[2], this.a);
  
      ellipse(this.pos.x, this.pos.y, this.size);
  
    }
  }
  