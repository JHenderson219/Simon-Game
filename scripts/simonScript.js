document.addEventListener("DOMContentLoaded", function(){
var isPlayerTurn, currentSound;
var turnCount=0;
var sequenceArray=[];
var playerArray=[];
var gameIsRestarted=true;
var strictMode=false;
var accumulator = 0
//Thanks to MDN for this function! Generates an integer between min and max, inclusive.
	function getRandomIntInclusive(min, max) {
  		min = Math.ceil(min);
  		max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function restart(){
		isPlayerTurn=undefined;
		turnCount=0;
		sequenceArray=[];
		currentSound=undefined;
		gameIsRestarted=true;
		strictMode=false;
		$("#alertArea").empty();
		updateTurnCounter();
	}
	function playSound (quadrant){
		console.log("playSound's current quadrant is "+quadrant);
		console.log(quadrant+"Sound")
	currentSound = document.getElementById(quadrant+"Sound");
		currentSound.play();
	}

	function start(){
		if(gameIsRestarted){
		computerTurn();
		isPlayerTurn=true;
		gameIsRestarted=false;
		}
	}

	//Thanks to Daniel Vassallo on Stack Exchange for the idea for this function.
	// Plays back and animates the current array of quadrants.
	function playbackAndAnimateLoop(seqArr){
		var i=0;
		var playbackQuadrant=seqArr[i];
		$("#"+playbackQuadrant).removeClass("animated pulse");
		console.log("sequence array passed to playback function is "+seqArr);
		console.log("index "+i+" of seqArr is "+seqArr[i]);
		setTimeout(function(){
			playSound(playbackQuadrant);
			$("#"+playbackQuadrant).addClass("animated pulse");
		},500);
		i++;
		if (i<sequenceArray.length){
			playbackAndAnimateLoop();
		}
	}
	function computerTurn(){
		var currentQuadrant = getRandomIntInclusive(0,3);
		sequenceArray.push(currentQuadrant);
		console.log("sequence array is "+sequenceArray);
		turnCount++;
		updateTurnCounter();
		playbackAndAnimateLoop(sequenceArray);
	}
	function failureAlert(){
		if(!strictMode){
			$("#alertArea").append('<h1 class="text-center animated zoomIn"> Incorrect sequence. Please try again.</h3>')
			playbackAndAnimateLoop();
			playerTurn=true;
		}else{
			$("#alertArea").empty().append('<h1 class="text-center animated zoomIn"> You wanted strict. You got it. Incorrect sequence. Please restart and try again.</h3>')
		}
	}
	function playerTurn(quadrant){
		if(isPlayerTurn){
			playerArray.push(quadrant);
			console.log(playerArray.join(" "))
			if(playerArray[accumulator]!==sequenceArray[accumulator]){
				failureAlert();
			} else{
				playSound(quadrant);
				$("#"+quadrant).removeClass("animated pulse");
				accumulator++;
				setTimeout(function(){
					$("#"+quadrant).addClass("animated pulse");
				},10);
				isPlayerTurn=false;
				computerTurn();
			}
		}
	}
	function updateTurnCounter(){
		$("#turnCounter").empty().append("<h1 class='text-center animated fadeIn' id='turnCounter'> "+turnCount+"</h1>")
	}

	$("#0").on("click",function(){
		playerTurn(0);
	});
	$("#1").on("click",function(){
		playerTurn(1);
	});
	$("#2").on("click",function(){
		playerTurn(2);
	});
	$("#3").on("click",function(){
		playerTurn(3);
	});
	$("#startButton").on("click", function(){
		start();
	});
	$("#restartButton").on("click", function(){
		restart();
	});
	$("#strictButton").on("click", function(){

	});
});