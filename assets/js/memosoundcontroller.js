'use strict';

function MemoSoundController(options) {
    
    // Init MemoSound model
    this.memoSound = new MemoSound(options);
    
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
    
    // Add mouse up/down listeners to buttons
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
}


// Turns the given light on
MemoSoundController.prototype.turnOn = function(i){
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
    return this.memoSound.resetGame();
}

// Delegates numStages to memoSound
MemoSoundController.prototype.numStages = function() {
    return this.memoSound.numStages;
}

// Delegates numLights to memoSound
MemoSoundController.prototype.numLights = function() {
    return this.memoSound.numLights;
}

// Delegates advanceStage() to memoSound
MemoSoundController.prototype.advanceStage = function(repetitions) {
    return this.memoSound.advanceStage(repetitions);
}

// Delegates getStage() to memoSound
MemoSoundController.prototype.getStage = function() {
    return this.memoSound.getStage();
}

// Handles button behavior on mouse down
MemoSoundController.prototype.clickLightDown = function(i) {
    return this.turnOn(i);
}

// Handles button behavior on mouse up
MemoSoundController.prototype.clickLightUp = function(i) {
    return this.turnOff(i);
}

// Handles button behavior on click
// Lets user enter the current stage sequence and captures it for validation
MemoSoundController.prototype.captureUserInput = function(i) {
    if(this.userInput.length < this.getStage().length) {
        this.userInput.push(i);
        console.log(this.userInput);
    } 
    
    if(this.userInput.length >= this.getStage().length) {
        this.canCaptureUserInput = false;
        this.validateUserInput();
    }
    
}

// Plays one stage of the game
MemoSoundController.prototype.playStage = function() {
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
    if(isStageCleared) {
        console.log("Stage cleared!");
        this.advanceStage();
        this.playStage();
    } else {
        console.log("Game Over");
    }
}