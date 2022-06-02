
let video;
let poseNet;
let pose;
let skeleton;
let intervalID, intervalPlaying;
let prevStrumType, currentStrumType=1;
let gap = 15;

let rightWristPrev;
let rightWristSpeedY;
let boolGuitarsStrummed = false;
let boolIsPlaying = false;
let strumType = 1;
let chordAreaSize = 60;
let startPoint = {x:120, y:280}

let loc_C = [], loc_D = [], loc_E = [], loc_G = []

function preload() {
  soundFormats('mp3')
  cChord = loadSound('assets/C.mp3');
  dChord = loadSound('assets/D.mp3');
  eChord = loadSound('assets/Em.mp3');
  gChord = loadSound('assets/G.mp3');
}
function setup() {

  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

 
  poseNet = ml5.poseNet(video, {flipHorizontal: true}, modelLoaded);
  poseNet.on('pose', gotPoses);
   video.hide();
}

function gotPoses(poses) {
  //console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
  guitarStrummed();
}

function draw() { 
  push();
  translate(video.width,0)
  scale(-1,1)
  image(video, 0, 0, width, height);
  pop();
  
  
  if (pose) {
    fill(255, 255, 255, 150);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 24);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 24);
    
    
    // for (let i = 0; i < pose.keypoints.length; i++) {
    //   let x = pose.keypoints[i].position.x;
    //   let y = pose.keypoints[i].position.y;
    //   fill(0,255,0);
    //   ellipse(x,y,16,16);
    // }
    
    // for (let i = 0; i < skeleton.length; i++) {
    //   let a = skeleton[i][0];
    //   let b = skeleton[i][1];
    //   strokeWeight(2);
    //   stroke(255);
    //   line(a.position.x, a.position.y,b.position.x,b.position.y);      
    // }
  }
  
  //pop();
  if(pose){
    drawChordReigons()
    highlightChords()
    if(boolGuitarsStrummed)
   { playChord()}
  }
  
}

function drawChordReigons(){

  loc_C[0] = startPoint.x
  loc_C[1] = startPoint.y
  loc_D[0] = startPoint.x+chordAreaSize+gap
  loc_D[1] = startPoint.y
  loc_E[0] = startPoint.x
  loc_E[1] = startPoint.y+chordAreaSize+gap
  loc_G[0] = startPoint.x+chordAreaSize+gap
  loc_G[1] = startPoint.y+chordAreaSize+gap

 
  fill(255,255, 255, 80);
  noStroke()
  circle(loc_C[0],loc_C[1], chordAreaSize)
  circle(loc_D[0],loc_D[1], chordAreaSize)
  circle(loc_E[0],loc_E[1], chordAreaSize)
  circle(loc_G[0],loc_G[1], chordAreaSize)

  fill(255)  
  noStroke()
  textSize(24)
  textAlign(CENTER, CENTER)
  text("C",loc_C[0],loc_C[1])
  text("D",loc_D[0],loc_D[1])
  text("Em",loc_E[0],loc_E[1])
  text("G",loc_G[0],loc_G[1])

}

function playChord(){

   if(dist(pose.leftWrist.x, pose.leftWrist.y, loc_C[0], loc_C[1]) < chordAreaSize){
      if(!boolIsPlaying)
      {
        cChord.play()
        boolIsPlaying = true
        resetPlay()
       
      }

    }
    else if(dist(pose.leftWrist.x, pose.leftWrist.y, loc_D[0], loc_D[1]) < chordAreaSize){
      if(!boolIsPlaying)
      {
        dChord.play()
        boolIsPlaying = true
        resetPlay()
        
      }
    }
    else if(dist(pose.leftWrist.x, pose.leftWrist.y, loc_E[0], loc_E[1]) < chordAreaSize){
      if(!boolIsPlaying)
      {
        eChord.play()
        boolIsPlaying = true
        resetPlay()
       
      }
    }
      else if(dist(pose.leftWrist.x, pose.leftWrist.y, loc_G[0], loc_G[1]) < chordAreaSize){
        if(!boolIsPlaying)
        {
          gChord.play()
          boolIsPlaying = true
          resetPlay()
         
        }

    

    }
  }
   

  function highlightChords(){
    
   if(dist(pose.leftWrist.x, pose.leftWrist.y, loc_C[0], loc_C[1]) < chordAreaSize){
    fill("#FF27B6") 
    circle(loc_C[0],loc_C[1], chordAreaSize)
    fill(255) 
    text("C",loc_C[0],loc_C[1])

  }
  else if(dist(pose.leftWrist.x, pose.leftWrist.y, loc_D[0], loc_D[1]) < chordAreaSize){
    fill("#04AEFF") 
    circle(loc_D[0],loc_D[1], chordAreaSize)
    fill(255) 
    text("D",loc_D[0],loc_D[1])
  }
  else if(dist(pose.leftWrist.x, pose.leftWrist.y, loc_E[0], loc_E[1]) < chordAreaSize){
    fill("#CD62FF") 
    circle(loc_E[0],loc_E[1], chordAreaSize)
    fill(255) 
    text("Em",loc_E[0],loc_E[1])
  }
    else if(dist(pose.leftWrist.x, pose.leftWrist.y, loc_G[0], loc_G[1]) < chordAreaSize){
      fill("#FFD233") 
      circle(loc_G[0],loc_G[1], chordAreaSize)
      fill(255) 
      text("G",loc_G[0],loc_G[1])

  }
  }


function resetPlay(){
  intervalPlaying = setTimeout(updateIfPlaying, 100)
}

function updateIfPlaying(){
  boolIsPlaying = false
}

function guitarStrummed(){
  intervalID = setInterval(checkrightWristY, 100)
}

function checkrightWristY(){

 
  if(rightWristPrev){
    if(pose.rightWrist.y-rightWristPrev.y>0){
      currentStrumType = 1
    }
    else{currentStrumType = -1}


    rightWristSpeedY = Math.abs(pose.rightWrist.y-rightWristPrev.y)

    if(rightWristSpeedY>100){
      rightWristPrev={x:pose.rightWrist.x,y:pose.rightWrist.y}
      boolGuitarsStrummed = true
      //console.log("strum")
  }
    else{
      boolGuitarsStrummed = false;
    }
  }
  else if(pose){rightWristPrev={x:pose.rightWrist.x,y:pose.rightWrist.y}
  }
}