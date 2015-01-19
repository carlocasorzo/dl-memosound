'use strict';

function MemoSoundController(options) {
    
    // Init MemoSound model
    this.memoSound = new MemoSound(options);
    
    // Set message area from the DOM
    this.messageArea = $("#message-area");
    
    // Get button sound beep from the DOM
    
    this.beep = $('#btn-beep');
    
    // Set sequence step duration
    this.stepDuration = options.stepDuration || 900;
    
    // Set boolean to capture user input
    this.canCaptureUserInput = false;
    
    // Init the user input array
    this.userInput = []; 

    // Init lights array from the DOM
    this.lights = [];
    for (var i = 0; i < this.numLights(); i++) {
        var btnId = "#btn-" + i;
        this.lights[i] = $(btnId);
    }
    
    // Add listeners to buttons
    var self = this;
    $.each(this.lights, function(index, button) {
        button.find("path")
            .mousedown(function() {
                if(self.canCaptureUserInput) { self.clickLightDown(index); }
            })
            .mouseup(function() {
                if(self.canCaptureUserInput) { self.clickLightUp(index); }
            })
            .click(function() {
                if(self.canCaptureUserInput) { self.captureUserInput(index); }
            });
    });
    
    $('#btn-stop').click(function() {
        self.resetGame();
    });
    
    $('#btn-play').click(function() {
        self.resetGame();
        self.playGame();
    });
}

// Plays beep when button is on
MemoSoundController.prototype.playBeep = function() {
    return this.beep[0].play();
}

// Turns the given light on
MemoSoundController.prototype.turnOn = function(i){
    this.playBeep();
    return this.lights[i].addClass('btn-on');
} 

// Turns the given light off
MemoSoundController.prototype.turnOff = function(i){
    return this.lights[i].removeClass('btn-on');
} 

// Turns all lights off
MemoSoundController.prototype.turnOffAll = function(){
    var self = this;
    this.lights.map(function(light, i) {
        self.turnOff(i);
    });
    return this.lights;
} 

// Resets the game delegating to memoSound
MemoSoundController.prototype.resetGame = function() {
    var newGame = this.memoSound.resetGame();
    this.messageArea.text("Game started");
    this.updateCounters();
    return newGame;
}

// Delegates numStages to memoSound
MemoSoundController.prototype.numStages = function() {
    return this.memoSound.numStages;
}

// Delegates numLights to memoSound
MemoSoundController.prototype.numLights = function() {
    return this.memoSound.numLights;
}

// Delegates score to memoSound
MemoSoundController.prototype.score = function() {
    return this.memoSound.score;
}

// Delegates stage to memoSound
MemoSoundController.prototype.stage = function() {
    return this.memoSound.stage;
}

// Delegates advanceStage() to memoSound
MemoSoundController.prototype.advanceStage = function(repetitions) {
    var nextStage = this.memoSound.advanceStage(repetitions);
    this.updateCounters();
    return nextStage;
}

// Delegates getStage() to memoSound
MemoSoundController.prototype.getStage = function() {
    return this.memoSound.getStage();
}

// Delegates stage to memoSound
MemoSoundController.prototype.stage = function() {
    return this.memoSound.stage;
}

// Handles button behavior on mouse down
MemoSoundController.prototype.clickLightDown = function(i) {
    return this.turnOn(i);
}

// Handles button behavior on mouse up
MemoSoundController.prototype.clickLightUp = function(i) {
    return this.turnOff(i);
}

// Updates the score and stage inputs
MemoSoundController.prototype.updateCounters = function() {
    $('#score').val(this.score());
    $('#stage').val(this.stage());
 
}

// Handles button behavior on click
// Lets user enter the current stage sequence and captures it for validation
MemoSoundController.prototype.captureUserInput = function(i) {
    if(this.userInput.length < this.getStage().length) {
        this.userInput.push(i);
    } 
    
    if(this.userInput.length >= this.getStage().length) {
        this.canCaptureUserInput = false;
        this.validateUserInput();
    }
    
}

// Plays one stage of the game
MemoSoundController.prototype.playGame = function() {
    // Reset user input to store current stage's input
    this.userInput = [];
    // Show current stage sequence to player
    this.showCurrentStageLights();
    // if valid, add score and advance stage
    // else, end game
}

// Shows current stage sequence to player
// using closures to keep track of current light
MemoSoundController.prototype.showCurrentStageLights = function() {
    this.canCaptureUserInput = false;
    var self = this;
    var intervalHandler;
    var playCurrentLight = function() { 
        var lightItr = 0;
        return function() {
            if(lightItr >= self.getStage().length) {
                self.turnOffAll();
                self.canCaptureUserInput = true;
                clearInterval(intervalHandler);
                return;
            }
            self.turnOffAll();
            var currentLight = self.getStage()[lightItr];
            self.turnOn(currentLight);
            lightItr += 1;
            
        }
    }
    
    intervalHandler = setInterval(playCurrentLight(), this.stepDuration);
}

// Lets user enter the current stage sequence and captures it for validation
MemoSoundController.prototype.validateUserInput = function() {
    var isStageCleared = this.memoSound.validate(this.userInput);
    
    if(isStageCleared && this.stage() === this.numStages()) {
        this.messageArea.text("Congratulations, you won!");
    } else if(isStageCleared) {
        this.messageArea.text("Stage "+ this.stage() +" cleared!");
        this.advanceStage();
        this.playGame();
    } else {
        this.messageArea.text("Game Over");
    }
}