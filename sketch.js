

/* Pose key points
////////////////////////////////////////////////////
0	nose
1	leftEye
2	rightEye
3	leftEar
4	rightEar
5	leftShoulder
6	rightShoulder
7	leftElbow
8	rightElbow
9	leftWrist
10	rightWrist
11	leftHip
12	rightHip
13	leftKnee
14	rightKnee
15	leftAnkle
16	rightAnkle
////////////////////////////////////////////////////
*/

// pose net
let video;
let poseNet;
let poses = [];
let noseAttractor = [];
// let skeletons = [];
let img;


// https://editor.p5js.org/zickzhao1994/sketches/S3r3IxukQ
// https://www.youtube.com/watch?v=MJNy2mdCt20

var trails = [];
var highlights = [];
var SCREEN_SIZE;

const COL_PALETTE = [
  [48,50,77], // dark blue
  [66, 87, 132],
  [56,60,112],
  [21, 8, 50],
  [21,58,159],
  [75, 75, 157],
];
const HIGH_PALETTE = [
  [244,253,173], // light yellow
  [244,200,173]
];

var nums = 500;
var highlightNum = 30;
var noiseScale = 500; // large number - zoom in
var radius = 3;

function modelReady() {
    console.log("Model Loaded");
}

function preload() {
  img = loadImage('testBg.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  background(21, 8, 50);


  SCREEN_SIZE = min(width, height);
  for (let i = 0; i < nums; i++) {
    trails[i] = new Trail(COL_PALETTE);
  }

  for (let i = 0; i < highlightNum; i++) {
    highlights[i] = new Trail(HIGH_PALETTE);
  }

  // capture video source for pose detection
  video = createCapture(VIDEO);
  // Create a new poseNet object and listen for pose detection results
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", (results) => {
      poses = results;
  });
  // Hide the video element
  video.hide();
}

function draw() {
    noStroke();
    
    // option 3: screen 1?
    background(21, 8, 50, 50);
    tint(255, 15); 
    image(img, 0, 0, width, height);
  
  
    let closestPt;

    if(noseAttractor != null) {
      closestPt = noseAttractor[0];
    }

    // draw blue stars
    for (let i = 0; i < trails.length; i++) {
      trails[i].update(closestPt);
      trails[i].display();
      trails[i].checkRecreate();
    }
    
    
    // draw highlight stars
   for (let i = 0; i < highlights.length; i++) {
    highlights[i].update(closestPt);
    highlights[i].display();
    highlights[i].checkRecreate();

    }

    
    mapNose(); // currently based on nose position
    
}


// extract all the detected nose keypoints into an array
function mapNose() {
    noseAttractor = [];
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i += 1) {
        // For each pose detected, find the nose keypoint
        const pose = poses[i].pose;

        const nose = pose.keypoints[0];
        if (nose.score > 0.5) {
          
          // flip horizontally so it's mirroring the movement
          let mapX = map(nose.position.x, 0, video.width, width, 0);
          let mapY = map(nose.position.y, 0, video.height, 0, height);

          noseAttractor.push(createVector(mapX, mapY));

          // effect range
          fill(255, 0, 0, 20);
          ellipse(mapX, mapY, 100, 100);
      }
    }
}
