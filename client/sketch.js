function setup() {
  createCanvas(displayWidth, displayHeight);
  // createCanvas(windowWidth,windowHeight);
  strokeWeight(10)
	stroke(0);
}

function touchMoved() {
	line(mouseX, mouseY, pmouseX, pmouseY);
	return false;
}

function draw() {
  background(200);
  ellipse(50, 50, 80, 80);
}
