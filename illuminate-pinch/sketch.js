
let numFrames = 30
let t = 0
let minScale = 0, maxScale = 1
let sound
let handpose;
let video;
let predictions = [];
let index, thumb;
let modelState = 0
let pinchHintShown = 0

let flippedCameraBoolean = true

let centerX, centerY
let midPointX, midPointY


let mouseInterfaceState = 0

function preload() {
  soundFormats('mp3');
  sound = loadSound('assets/pristine-609.mp3');
  handOpen = loadImage("assets/hand.svg");
  pinch = loadImage("assets/pinch.svg");

}
function setup() {
  
  //frameRate(30)
  createCanvas(640, 480);
  loadHandPoseModel()
  centerX = width/2
  centerY = height/2

}

function draw() {
  // push()
  // translate(-width,0)
  // scale(1,-1)
  // image(video,0,0,width,height)
  // pop()
  background(0)
  drawSplash()

  if (predictions.length > 0) {
    drawKeypoints();
  }
  else if (modelState) {
    push()
    imageMode(CENTER);
    image(handOpen, width / 2, height / 2, 200, 200);
    pop()
  }

  else {
    showLoadingText()
  }

  //Click detected with body actions
  if (mouseInterfaceState == 1) {
    mouseInterfaceClicked()
    centerX = midPointX
    centerY = midPointY


  }
}

function showPinchHint() {
  pinchHintShown = 1
}

function loadHandPoseModel() {

  video = createCapture(VIDEO);
  video.size(width, height);
  handpose = ml5.handpose(video, {flipHorizontal: flippedCameraBoolean}, modelReady);
  handpose.on("predict", results => {
    predictions = results;
  });
  video.hide();
}



function drawSplash() {
  t = frameCount / numFrames
  //translate(centerX, centerY)
  let m = 29
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < m; j++) {
      let x = map(i, 0, m - 1, 0, width)
      let y = map(j, 0, m - 1, 0, height)
      let size = bellCurve((t - offset(x, y)))
      strokeWeight(size)
      stroke(255, 255, 255, map(size, 1, 5, 50, 200))
      if (modelState == 0) {
        stroke(255, 40)
      }
      point(x, y)
    }
  }
}


function modelReady() {
  console.log("Model ready!");
  modelState = 1
}
function bellCurve(p) {
  //return map(cos(2 * PI * p * exp(-t / 3)), -1, 1, 0.4, 6)
  return map(stdNormal(p), 0, 1, 0.4, 15)
}

function mouseInterfaceClicked() {
  frameCount = 0
  sound.play();
}

function showLoadingText() {
  push()
  imageMode(CENTER);
  image(pinch, width / 2 - 10, height/2 - 50 , 120, 120);
  pop()
  textSize(20)
  textAlign(CENTER, CENTER);
  noStroke()
  fill(255)
  text("L O A D I N G", width / 2, height / 2 + 50)
  textSize(12)
  text("Pinch to click", width / 2, height/2 + 80)

}

function offset(x, y) {
  return 0.002 * dist(x, y, centerX, centerY)
}

function drawKeypoints() {

  //console.log(predictions);
  const prediction = predictions[0];
  thumb = prediction.annotations.thumb[3]
  index = prediction.annotations.indexFinger[3]
  //point(thumb[0], thumb[1], 20)


  //translate(width / 2, height / 2)
  const d = dist(thumb[0], thumb[1], index[0], index[1])
  midPointX = (thumb[0] + index[0]) / 2
  midPointY = (thumb[1] + index[1]) / 2
  noFill()
  stroke(255, constrain(210 - d/2, 0, 210))
  strokeWeight(20)
  point(thumb[0], thumb[1])
  point(index[0], index[1])

  //point(index[0], index[1], 20)
  //text(dist(thumb[0], thumb[1], index[0], index[1]), 320, 100);

  const thresholdDistance = 60
  //console.log(d)
  if (d < thresholdDistance && mouseInterfaceState == 0) {
    mouseInterfaceState++
  }
  else if (mouseInterfaceState == 1 && d < thresholdDistance) { mouseInterfaceState++ }
  else if ((mouseInterfaceState == 2 || mouseInterfaceState == 1) && d > thresholdDistance) { mouseInterfaceState = 0 }

}

function stdNormal(x) {
  return Math.pow(Math.E, -Math.pow(9 * x, 2) / 2) / Math.sqrt(2 * Math.PI);
}