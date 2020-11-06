let sentiment;
let statusEl;
let inputBox;
let submitBtn;
let sentimentResult;
let input2;
let subcheck = false;
let hover = false;

var socket;

let consolefont;

function preload() {
	consolefont = loadFont('assets/Inconsolata-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
	background(0);
  // initialize sentiment
  sentiment = ml5.sentiment('movieReviews', modelReady);

	//socket code
	socket = io.connect('http://localhost:3000');
	socket.on('opinionupdate', updateOpinion);
	socket.on('opinion', updateAverage);
	socket.on('curropinion', updateAverage);

	fill(255);
	textSize(30);
	textFont(consolefont);
	text('How do you feel about AI?', 40, 80);
	textSize(20);
	text('Current crowdsourced opinion:', 700, 50);

  inputBox = createInput('Answer here.');
	inputBox.position(40, 120);
  inputBox.attribute('size', '75');

	submitBtn = createButton('submit');
	submitBtn.position(40, 160);

  // predicting the sentiment on mousePressed()
  submitBtn.mousePressed(getSentiment);
}

/*function mousePressed() {
	if (mouseX < 130 && mouseX > 40 && mouseY < 210 && mouseY > 180) {
		getSentiment();
	}
	console.log(mouseX + ', ' + mouseY);
}*/

/*function draw() {
	if (subcheck == true) {
		if (mouseX < 130 && mouseX > 40 && mouseY < 210 && mouseY > 180) {
			if (hover == false) {
				fill('yellow');
				submitBtn = text('Submit', 40, 200);
				hover = true;
				}
		} else {
			fill('white');
			submitBtn = text('Submit', 40, 200);
			hover = false;
		}
	}
}*/

/*function onInput() {
  if (this.value().length > 15 && (subcheck == false)) {
		submitBtn = text('Submit', 40, 200);
		subcheck = true;
	}
}*/

function updateOpinion(data) {
	fill(100);
	textSize(30);
	var string = data;
	text(string, random(40, width - 500), random(200, height - 10));
}

function updateAverage(data) {
	fill(0);
	rect(600, 0, 1000, 200);
	let color = map(data, 0, 1, 0, 255);
	fill(255 - color, color, 0);
	textSize(20);
	text('Current crowdsourced opinion:', 700, 75);
	textSize(100);
	var string = data - data % 0.01;
	text(string, 700, 175);
}

function getSentiment() {
  // get the values from the input
  const text = inputBox.value();

  // make the prediction
  const prediction = sentiment.predict(text);

	var data = {
		val: prediction.score,
		str: inputBox.value()
	};

	socket.emit('opinion', data);
}

function modelReady() {
  // model is ready
  console.log('model loaded');
}
