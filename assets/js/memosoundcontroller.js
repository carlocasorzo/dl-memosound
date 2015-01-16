'use strict';

function MemoSoundController(options) {
    
    // Init MemoSound model
    this.memoSound = new MemoSound(options);
    
    // Init lights array from DOM
    this.lights = [];
    for (var i = 0; i < this.numLights(); i++) {
        var btnId = "#btn-" + i;
        this.lights[i] = $(btnId);
    }
    
    // Add mouse up/down listeners to buttons
    var self = this;
    $.each(this.lights, function(index, value) {
        this.find("path")
            .mousedown(function() {
                self.clickLightDown(index);
            })
            .mouseup(function() {
                self.clickLightUp(index);
            });
    });
}


// Light manipulation methods
MemoSoundController.prototype.turnOn = function(i){
    //console.log(i);
    return this.lights[i].addClass('btn-on');
} 

MemoSoundController.prototype.turnOff = function(i){
    return this.lights[i].removeClass('btn-on');
} 

// Delegate methods
MemoSoundController.prototype.numStages = function() {
    return this.memoSound.numStages;
}

MemoSoundController.prototype.numLights = function() {
    return this.memoSound.numLights;
}

// Button click listeners
MemoSoundController.prototype.clickLightDown = function(i) {
    return this.turnOn(i);
}
MemoSoundController.prototype.clickLightUp = function(i) {
    return this.turnOff(i);
}