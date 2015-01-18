'use strict';

function MemoSound(options) {
    
    options = options || {};
    
    // Number of stages
    this.numStages = options.numStages || 20;
    
    // Current stage
    this.stage = 0;
    
    // Score
    this.score = 0;
    
    // Number of lights
    this.numLights = options.numLights || 4;
    
    // MemoSound sequence array
    this.memoSequence = [];
    for (var i = 0; i < this.numStages; i++) {
        this.memoSequence[i] = 0;
    }
    
    // Init game
    this.resetGame();
}

// Resets game to initial state
MemoSound.prototype.resetGame = function() {
    // Reset score and stage
    this.stage = 0;
    this.score = 0;
    
    var self = this;
    
    var getRandomLight = function(previous) {
        var randomLight = previous;
        while(randomLight === previous) {
            randomLight = Math.floor(Math.random() * self.numLights);
        }
        return randomLight
    }
    
    // Generate the random light sequence
    for (var i = 0; i < this.memoSequence.length; i++) {
        this.memoSequence[i] = getRandomLight(this.memoSequence[i - 1]);
    }
    
    // Advance to stage 1
    this.advanceStage();
    
    return this;
}

// Returns the current stage sequence array
MemoSound.prototype.getStage = function(stage) {
    // Check that the stage is within the proper range
    stage = (stage === undefined) ? this.stage : stage;
    stage = (stage < 0) ? 0 : stage;
    stage = (stage > this.numStages) ? this.numStages : stage;
    
    // return the sliced sequence
    return this.memoSequence.slice(0, stage);
}

// Advances the given number of stages. Goes to next stage if param is ommited
MemoSound.prototype.advanceStage = function(repetitions) {
    repetitions = repetitions || 1;
    for (var i = 1; i <= repetitions ; i++) {
        this.score += (this.stage >= this.numStages) ? 0 : this.stage;
        this.stage += (this.stage >= this.numStages) ? 0 : 1;
    }
    return this;
}

// Determines if the game is finished
MemoSound.prototype.isFinished = function() {
    return this.stage >= this.numStages;
}

MemoSound.prototype.isPlaying = function() {
    return this.stage > 0;
}

// Validates a given sequence input against current stage
MemoSound.prototype.validate = function(input) {
    if(input.length !== this.stage) {
        return false;
    }
    
    var isValid = true;
    for (var i = 0; i < input.length; i++) {
        isValid = (this.getStage()[i] === input[i]);
    }
    return isValid;
}