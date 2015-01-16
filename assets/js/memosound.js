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


MemoSound.prototype.resetGame = function() {
    // Reset score and stage
    this.stage = 0;
    this.score = 0;
    
    // Generate the random light sequence
    for (var i = 0; i < this.memoSequence.length; i++) {
        this.memoSequence[i] = Math.floor(Math.random() * this.numLights);
    }
    
    return this;
}

MemoSound.prototype.getStage = function(stage) {
    // Check that the stage is within the proper range
    stage = (stage === undefined) ? (this.stage + 1) : stage;
    stage = (stage < 1) ? 1 : stage;
    stage = (stage > this.numStages) ? this.numStages : stage;
    
    // return the sliced sequence
    return this.memoSequence.slice(0, stage);
}

MemoSound.prototype.advanceStage = function() {
    this.stage += (this.stage >= this.numStages) ? 0 : 1;
    this.score += this.stage;
    
    return this;
}

// Game state methods
MemoSound.prototype.isFinished = function() {
    return this.stage >= this.numStages;
}

MemoSound.prototype.isPlaying = function() {
    return this.stage > 0;
}

// User input validation
MemoSound.prototype.validate = function(input) {
    
    if(input.length !== this.stage + 1) {
        return false;
    }
    
    var isValid = true;
    // this.memoSequence.map(function(light, i) {
    //     isValid = (light === input[i]);
    // });
    for (var i = 0; i <= this.stage; i++) {
        isValid = (this.getStage()[i] === input[i]);
    }
    
    return isValid;
}