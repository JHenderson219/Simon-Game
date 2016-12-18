document.addEventListener("DOMContentLoaded", function(){
//The following few variables are used throughout in various ways.
var isPlayerTurn, currentSound;
var turnCount=0;
var sequenceArray=[];
var playerArray=[];
var gameIsRestarted=true;
var strictMode=false;
var accumulator=0;
var playbackLoopIterator=0;
var playbackQuadrant;

	// Thanks to MDN for this function! 
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	// Generates an integer between a given min and max values, inclusive.
	function getRandomIntInclusive(min, max) {
  		min = Math.ceil(min);
  		max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Resets all globally scoped variables to their default states.
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
		playbackQuadrant=undefined;
	}
	
	// Sets all global variables to default, clears alertArea, and resets turn counter.
	function restart(){
		globalVarsToDefaults();
		$("#alertArea").empty();
		updateTurnCounter();
	}

	// Given a quadrant, plays the sound associated with that quadrant.
	function playSound (quadrant){
		currentSound = document.getElementById(quadrant+"Sound");
		currentSound.play();
	}
	
	// Starts the game with the computer's turn, if game is not already in progress. 
	function start(){
		if(gameIsRestarted){
		computerTurn();
		isPlayerTurn=true;
		gameIsRestarted=false;
		}
	}

	// Thanks to Daniel Vassallo on Stack Exchange for the idea for the initial idea for this function.
	// http://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
	// Accepts the current sequence of lays back and animates the current array of quadrants.
	function playbackAndAnimateLoop(seqArr){
		playbackQuadrant=seqArr[playbackLoopIterator];
		setTimeout(function(){
			setTimeout(function(){
				removeQuadrantAnimation(playbackQuadrant);
				}, 5);
			setTimeout(function(){
				playbackAndAnimateQuadrant(playbackQuadrant);
				playbackLoopIterator++;
				if (playbackLoopIterator<sequenceArray.length){
					playbackAndAnimateLoop(sequenceArray);
				} else{
					playbackLoopIterator=0;
					}
				},505);
		},500);
	}

	// Removes the pulse animation from a given quadrant.
	function removeQuadrantAnimation(quad){
		$("#"+quad).removeClass("animated pulse");
	}
	// Adds pulse animaton and plays back sound for a given quadrant.
	function playbackAndAnimateQuadrant(quad){
		playSound(quad);
		$("#"+quad).addClass("animated pulse");
	}
	
	// After a 500 ms delay, gets a random integer from 0-3, pushes that number to the sequence array.
	// Then, iterates turn count and updates turn counter. 
	// Finally, plays back current array of quadrants and lets player take turn.
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

	// If Strict Mode is disabled, displays alert text in alert area, then replays current sequence.
	// Otherwise, forces player to restart game to continue playing.
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

	// If it is the player's turn, checks selected quadrant against the current sequence.
	// If it doesn't match, resets variables to restart player's turn and calls failureAlert.
	// Otherwise, pushes result to player's current array, iterates accumulator.
	// If accumulator equals twenty, the player wins and function calles playerVictory.
	// Otherwise, if the player has input the full array of correct quadrants, ends the player's turn.
	function playerTurn(quadrant){
		if(isPlayerTurn){
			if(checkForFailure(quadrant,accumulator)){
				failureVarReset();
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

	// Resets a limited selection of variables in the event of a failed quadrant entry.
	function failureVarReset(){
		isPlayerTurn=false;
		playerArray=[];
		accumulator=0;
	}

	// Plays a short series of sounds to celebrate player victory!
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

	//Checks a given quadrant against an index of the current sequence, returning true for failure, false for success.
	function checkForFailure(quad,index){
		if(quad!==sequenceArray[index]){
			return true;
		}
		return false;
	}

	//Prevents player from interacting with quadrants after a victory, displays a victory message, plays a fanfare.
	function playerVictory(){
		console.log("Player wins!")
		isPlayerTurn=false;
		$("#alertArea").empty().append('<h1 class="text-center animated zoomIn" id="alertText"> You win!</h1>');
		victoryFanfare();
	}

	//Ends the player's turn, resets variables in preparation for next turn, and starts computer's turn after 500 ms.
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

	$("#0").on("tap",function(){
		playerTurn(0);
	});
	$("#1").on("tap",function(){
		playerTurn(1);
	});
	$("#2").on("tap",function(){
		playerTurn(2);
	});
	$("#3").on("tap",function(){
		playerTurn(3);
	});
	$("#startButton").on("tap", function(){
		start();
	});
	$("#restartButton").on("tap", function(){
		restart();
	});
	$("#strictButton").on("tap", function(){
		strictModeOn();
	});
});