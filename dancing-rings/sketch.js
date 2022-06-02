let c= 0;
let sound;
let poses = [];
var density=1;
let width = 640, height = 480
let t;
let k=0;
let noOfFrames = 1
let rotateGraphicsSpeed = 1
let modelState = 0

let flippedCameraBoolean = false
let instructions;

let leftWrist,leftElbow,rightWrist, rightElbow

let scrollInterfaceY=1
let scrollInterfaceX =0

let prevScrollInterfaceX;
let currentMovementDirection;

let scrollInterfaceSpeed;
function preload() {
  soundFormats('mp3');
  sound = loadSound('/copines.mp3');
  instructions = loadImage('assets/instr.svg')
  font = loadFont("assets/BebasNeue-Regular.ttf");
  
}



function setup() {

  frameRate(30)
  createCanvas(width, height, WEBGL).mouseClicked(toggleSound);
  angleMode(DEGREES)
  setTimeout(() => {
    loadPoseNet()
  }, 3000);


 
  
}

function showLoadingText() {
  
  push()
  imageMode(CENTER);
  
  textAlign(CENTER, CENTER)
  textFont(font);
  image(instructions, 0, -50, 280, 150)
  fill(255)
  textSize(40)
  text('GET READY TO DANCE',0,100)
  textSize(14)
  fill(255,160)
  text('click anywhere to play/pause the song',0,150)
  pop()

}
function draw() {
  t = frameCount/noOfFrames
  k+=0.02
  background(0);  
  if (poses.length > 0) {
    drawKeypoints();
  }


  if(!modelState){
    showLoadingText()
  }
  else{
    rotateX(40)
    noFill()
    stroke(255)
    strokeWeight(1.5)
  
    for(var i=0; i<30; i+=density){
      // var r = map(sin(5*i+frameCount),-1,1,0,255)
      // var g = map(sin(50+5*i+frameCount),-1,1,0,255)
      // var b =map(sin(130+5*i+frameCount),-1,1,0,255)
  
      // stroke(r,g,b)
  
       var h = map(sin(3*i+frameCount/2+240),-1,1,150,360)
      var s=  90
      var l =50
      colorMode(HSL)
      stroke(h,s,l)
  
      beginShape()
   
  
      for(var j=0; j<360; j += 60){
        var rad = i*7 + map(sin(2*frameCount),-1,1,0,5) 
        var x = rad * cos(j+1.5*i+t*rotateGraphicsSpeed)
        var y = rad * sin(j+1.5*i+t*rotateGraphicsSpeed)
        var z = 50 + cos(scrollInterfaceY + 4*i)* 140
      
        vertex(x, y, z)
      
  
      }
      endShape(CLOSE)
    }
  }
  }
  

function modelReady() {
  console.log("Model ready!");
  modelState = 1
}

function loadPoseNet() {
  video = createCapture(VIDEO);
  video.size(width, height);
  poseNet = ml5.poseNet(video, {flipHorizontal: flippedCameraBoolean}, modelReady);
  poseNet.on('pose', results => {
    poses = results;
    HandsThrown()
  });
  video.hide();
}

function HandsThrown(){
  intervalID = setInterval(checkScrollSpeed, 100)
}

function checkScrollSpeed(){
 
  if(prevScrollInterfaceX){
    if(scrollInterfaceX-prevScrollInterfaceX>0){
      currentMovementDirection = 1

    }
    else{currentMovementDirection = 0}
    
    scrollInterfaceSpeed = scrollInterfaceX-prevScrollInterfaceX
    
    if(abs(scrollInterfaceSpeed)>150 ){
      console.log(scrollInterfaceSpeed)
      k=0
      prevScrollInterfaceX=scrollInterfaceX;
      
      rotateGraphicsSpeed = map(constrain(scrollInterfaceSpeed,-250,250),-250,250,-10,10)
     // console.log("strum")
  }
    else{
    }
  }
  else{ prevScrollInterfaceX=scrollInterfaceX;
  }
}



function keyPressed(){
    if(keyCode>=49 && keyCode<=57){
      density = map(keyCode,49,57,1,0.05)
    }
    //console.log(keyCode)
  
}

function toggleSound() {
  if (sound.isPlaying() ){
    sound.stop();
  } else {
    sound.play();
  }
}
function drawKeypoints() {
  push()
  translate(-width/2, -height/2)
  const pose = poses[0].pose;
  // const keypoints = pose.keypoints
  // for (var i = 0; i < keypoints.length; i++) {
  //   strokeWeight(4)
  //   stroke(255,150,54,127)
  // }

   leftWrist = pose.leftWrist
   rightWrist = pose.rightWrist

  strokeWeight(5)
  scrollInterfaceX = floor((leftWrist.x+rightWrist.x)/2)-(floor((leftWrist.x+rightWrist.x)/2))%5
  scrollInterfaceY = map((leftWrist.y+rightWrist.y)/2,0,350,-40,120)
  noStroke()
  fill(255)
  pop()

}

