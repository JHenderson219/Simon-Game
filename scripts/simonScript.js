document.addEventListener("DOMContentLoaded", function(){
var isPlayerTurn, currentSound;
var turnCount=0;
var sequenceArray=[];
var playerArray=[];
var gameIsRestarted=true;
var strictMode=false;
var accumulator = 0;
var playbackLoopIterator=0;
//Thanks to MDN for this function! Generates an integer between min and max, inclusive.
	function getRandomIntInclusive(min, max) {
  		min = Math.ceil(min);
  		max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function globalVarsToDefaults(){
		isPlayerTurn=undefined;
		currentSound=undefined;
		playbackLoopIterator=0;
		turnCount=0;
		accumulator = 0;
		sequenceArray=[];
		playerArray=[];
		gameIsRestarted=true;
		strictMode=false;
	}
	function restart(){
		globalVarsToDefaults();
		$("#alertArea").empty();
		updateTurnCounter();
	}
	function playSound (quadrant){
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
		var playbackQuadrant=seqArr[playbackLoopIterator];
		setTimeout(function(){
			setTimeout(function(){
				$("#"+playbackQuadrant).removeClass("animated pulse");
				}, 5);
			setTimeout(function(){
				playSound(playbackQuadrant);
				$("#"+playbackQuadrant).addClass("animated pulse");
				playbackLoopIterator++;
				if (playbackLoopIterator<sequenceArray.length){
					playbackAndAnimateLoop(sequenceArray);
				} else{
					playbackLoopIterator=0;
					}
				},505);
		},500);
	}

	function computerTurn(){
		setTimeout(function(){
			var currentQuadrant = getRandomIntInclusive(0,3);
			sequenceArray.push(currentQuadrant);
			turnCount++;
			updateTurnCounter();
			playbackAndAnimateLoop(sequenceArray);
			isPlayerTurn=true;
		},500);
	}

	function failureAlert(){
		if(!strictMode){
			$("#alertArea").empty().append('<h1 class="text-center animated zoomIn" id="alertText"> Incorrect sequence. Please try again.</h3>');
			setTimeout(function(){
				$("#alertText").removeClass("animated zoomIn");
			},1000);
			setTimeout(function(){
				$("#alertText").addClass("animated zoomOut");
			},2000);
			playbackAndAnimateLoop(sequenceArray);
			isPlayerTurn=true;
		}else{
			$("#alertText").empty().append('<h1 class="text-center animated zoomIn" id="alertText"> You wanted strict. You got it. Incorrect sequence. Please restart and try again.</h3>');
		}
	}
	/*function playerTurn(quadrant){
		debugger;
		playerArray=[];
		if(isPlayerTurn && accumulator<sequenceArray.length){
			playerClicksQuadrant(quadrant);
			playerArray.push(quadrant);
			accumulator++;
		} else if (isPlayerTurn&&accumulator==playerArray.length){
			playerArray.push(quadrant);
			accumulator=0;
			if(playerArray.join("")!=sequenceArray.join("")){
				failureAlert();
			} else{
				playerClicksQuadrant(quadrant);
				isPlayerTurn=false;
				setTimeout(function(){
					computerTurn();
				},500);
			}
		}
	}*/

	function playerTurn(quadrant){
		if(isPlayerTurn){
			if(checkForFailure(quadrant,accumulator)){
				isPlayerTurn=false;
				playerArray=[];
				accumulator=0;
				failureAlert();
			}else {
				playerArray.push(quadrant);
				accumulator++;
				playerClicksQuadrant(quadrant);
				if(accumulator===20){
					playerVictory();
				} else if (playerArray.length==sequenceArray.length){
					endPlayerTurn();
				}
			}
		}
	}
	function victoryFanfare(){
		playSound(2);
		setTimeout(function(){
			playSound(0);
		},400);
		setTimeout(function(){
			playSound(1);
		},800);
		setTimeout(function(){
			playSound(3);
		},1200);
	}
	function checkForFailure(quad,index){
		if(quad!==sequenceArray[index]){
			return true;
		}
		return false;
	}
	function playerVictory(){
		console.log("Player wins!")
		isPlayerTurn=false;
		$("#alertArea").empty().append('<h1 class="text-center animated zoomIn" id="alertText"> You win!</h1>');
		victoryFanfare();
	}
	function endPlayerTurn(){
		isPlayerTurn=false;
		accumulator=0;
		playerArray=[];
		setTimeout(function(){
			computerTurn();
		},500);
	}
	function playerClicksQuadrant(quad){
		playSound(quad);
		$("#"+quad).removeClass("animated pulse");
		setTimeout(function(){
			$("#"+quad).addClass("animated pulse");
			},10);
	}

	function updateTurnCounter(){
		$("#turnCounter").empty().append("<h1 class='text-center animated fadeIn' id='turnCounter'> "+turnCount+"</h1>")
	}
	function strictModeOn(){
		if (gameIsRestarted){
			strictMode=true;
			$("#alertArea").empty().append('<h1 class="text-center animated zoomIn" id="alertText"> Strict Mode Activated!</h1>');
		}
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
		strictModeOn();
	});
});