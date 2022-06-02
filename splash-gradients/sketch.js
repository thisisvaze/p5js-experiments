let h = [], s = [], l = []
let p = [], q = []
let str = ""
let str1 = ""
let n = 0
var canvas, ctx
let currentIndex = 0
//let ellipseRadius = []

let gradient;
let flippedCameraBoolean = true
let sound
let handpose;
let video;
let predictions = [];
let modelState = 0
let pinchHintShown = 0

let midPointX = 0, midPointY = 0

let mouseInterfaceState = 0



function preload() {
  soundFormats('mp3');
  sound = loadSound('assets/open-ended-563.mp3');
  handOpen = loadImage("assets/hand.svg");
  all_pinched = loadImage("assets/pinched_fingers.svg")

}

function setup() {

  //frameRate(30)
  canvas = createCanvas(640, 480);
  ctx = canvas.drawingContext;
  loadHandPoseModel()


  colorMode(HSL)
  
  h[0] = Math.floor(Math.random() * 360);
  s[0] = 30 + Math.floor(Math.random() * 40);
  l[0] = 30 + Math.floor(Math.random() * 40);

}
function showLoadingText() {
   push()
  imageMode(CENTER);
  image(all_pinched, width / 2 - 70, height/2 - 50 , 100, 100);
  textSize(13)
  text("M O V E", width / 2 -90, height/2 + 70)
  pop()
  textSize(20)
  textAlign(CENTER, CENTER);
  noStroke()
  fill(255)
  text("L O A D I N G", width / 2, height - 70)
  textSize(13)
  image(handOpen, width/2 + 30, height/2 - 110 , 120, 120);
  text("S P L A S H", width / 2 + 90, height/2 + 70)
}

function draw() {

  //Click detected with body actions
  if (mouseInterfaceState == 1) {
    mouseInterfaceClicked()
  }
  generateComplexGradient()
  if (!modelState) {
    //console.log(modelState)
    showLoadingText()
  }
  if (predictions.length > 0) {
    drawKeypoints()
  }
  //pop()



}

function loadHandPoseModel() {

  video = createCapture(VIDEO);
  video.size(width, height);
  handpose = ml5.handpose(video, { flipHorizontal: flippedCameraBoolean }, modelReady);
  handpose.on("predict", results => {
    predictions = results;
  });
  video.hide();
}


function generateComplexGradient() {
  if (n == 0) {
    background(h[0], s[0], l[0]);
  }
  else {
    background(h[0], s[0], l[0]);
    for (var i = 1; i < n+1; i++) {
      gradient = ctx.createRadialGradient(p[i], q[i], 0, p[i], q[i], 600);
      gradient.addColorStop(0, "hsla(" + h[i] + ", " + s[i] + "%, " + l[i] + "%, " + 1);
      gradient.addColorStop(0.1, "hsla(" + h[i] + ", " + s[i] + "%, " + l[i] + "%, " + "0.95");
      gradient.addColorStop(0.7, "hsla(" + h[i] + ", " + s[i] + "%, " + l[i] + "%, " + "0.01");
      gradient.addColorStop(1, "hsla(" + h[i] + ", " + s[i] + "%, " + l[i] + "%, " + "0");
      noStroke()
      ctx.fillStyle = gradient;
      circle(p[i], q[i], 1000);
    }
  }
}

function mouseInterfaceClicked() {
  n++
  h[n] = Math.floor(Math.random() * 360);
  s[n] = 20 + Math.floor(Math.random() * 60);
  l[n] = 20 + Math.floor(Math.random() * 60)
  p[n] = midPointX
  q[n] = midPointY

  sound.play()
}


function modelReady() {
  console.log("Model ready!");
  modelState = 1
}


function drawKeypoints() {


  const prediction = predictions[0];
  const thumb = prediction.annotations.thumb[3]
  const index = prediction.annotations.indexFinger[3]
  const middle = prediction.annotations.middleFinger[3]
  const ring = prediction.annotations.ringFinger[3]
  const pinky = prediction.annotations.pinky[3]

  const meanAndVarianceX = meanAndVariance([thumb[0], index[0], middle[0], ring[0], pinky[0]])
  const meanAndVarianceY = meanAndVariance([thumb[1], index[1], middle[1], ring[1], pinky[1]])

  
  midPointX = meanAndVarianceX.mean
  midPointY = meanAndVarianceY.mean


  //fill(h[n+1], s[n+1], l[n+1])
  fill(255,0)
  const d = meanAndVarianceX.variance + meanAndVarianceY.variance
  stroke(255, constrain(150 - d/2, 0, 150))
  strokeWeight(2)
  circle(midPointX, midPointY, d / 2)
  const thresholdDistance = 120
  if (d > thresholdDistance && mouseInterfaceState == 0) {
    mouseInterfaceState++
  }
  else if (mouseInterfaceState == 1 && d > thresholdDistance) { mouseInterfaceState++ }
  else if ((mouseInterfaceState == 2 || mouseInterfaceState == 1) && d < thresholdDistance) { mouseInterfaceState = 0 }


}
const meanAndVariance = (arr = []) => {
  if (!arr.length) {
    return 0;
  };
  const sum = arr.reduce((acc, val) => acc + val);
  const { length: num } = arr;
  const mean = sum / num;
  let variance = 0;
  arr.forEach(num => {
    variance += ((num - mean) * (num - mean));
  });
  variance /= num;
  return { mean: mean, variance: sqrt(variance) };
};
