function iosInit() {
  var osc = atx.createOscillator();
  osc.frequency.value = 0.1;
  osc.connect(atx.destination);
  osc.start(0);
  setTimeout(function() {
    osc.stop(0);
    osc.disconnect();
  }, 0);
}

var initted = false;
var sounds = [];
var atx = new AudioContext();
var mainVol = atx.createGain();
var compressor = atx.createDynamicsCompressor();
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var play = false; //global play bit

window.onclick = function() {
  if (initted) return;
  initted = true;

  compressor.threshold.value = -20;
  compressor.knee.value = 20;
  compressor.ratio.value = 20;
  compressor.reduction.value = -30;
  compressor.attack.value = 0;
  compressor.release.value = 0.25;
  mainVol.gain.value = 0.1;
  mainVol.connect(compressor);
  compressor.connect(atx.destination);
};
var button_play = document.getElementById('button_play');

function playPause() {
  if (play) {
    play = false;
  } else {
    play = true;
    loop();
  }
}

var chromatic = [
  65.406,
  69.296,
  73.416,
  77.782,
  82.407,
  87.307,
  92.499,
  97.999,
  103.826,
  110.0,
  116.541,
  123.471,
];

var major = [65.406, 73.416, 82.407, 87.307, 97.999, 110.0, 123.471];

var minor = [65.406, 73.416, 77.782, 87.307, 97.999, 103.826, 116.541];

var pentatonic = [65.406, 77.782, 87.307, 97.999, 116.541];

var minorChord = [
  65.406,
  77.782,
  //87.307,
  97.999,
  //116.541
];

var scale = chromatic;

function loop() {
  if (!sounds[sounds.length - 1].playing) {
    //last object in the array was started longes time ago among the Sound objects, try if it's not playing
    if (Math.random() > 0) {
      //skip note if break occurs

      //set scale
      var scaleVal = 1 - $('#xyTemSca')[0].relY;

      if (scaleVal <= 0.25) {
        scale = minorChord;
      } else if (scaleVal <= 0.5) {
        scale = pentatonic;
      } else if (scaleVal <= 0.75) {
        scale = minor;
      } else {
        scale = chromatic;
      }

      var index = Math.floor(Math.random() * scale.length);
      //var oct = Math.ceil(parseInt(input_octaves.value)*Math.random());
      var oct = Math.ceil(
        (Math.floor((1 - $('#xyOctTra')[0].relY) * 3) + 1) * Math.random()
      );

      //var att = parseInt(input_attack.value);
      var att = $('#xyAttRel')[0].relX * 4990 + 10;

      //	var rel = parseInt(input_release.value);
      var rel = (1 - $('#xyAttRel')[0].relY) * 4990 + 10;

      var fDelta; //this is the difference between lower and higher chromatic note
      if (index === 0) {
        fDelta = (scale[1] - scale[0]) * 2;
      } else if (index === scale.length - 1) {
        fDelta = (scale[scale.length - 1] - scale[scale.length - 2]) * 2;
      } else {
        fDelta = scale[index + 1] - scale[index - 1];
      }

      //			var frq = (scale[index]+fDelta*(Math.random()-0.5)*(parseInt(input_detune.value)/100))*Math.pow(2,oct+parseInt(input_transpose.value))*0.25;

      var frq =
        (scale[index] +
          fDelta * (Math.random() - 0.5) * ($('#xyDetDyn')[0].relX * 0.3)) *
        Math.pow(2, oct + 5 - Math.floor((1 - $('#xyOctTra')[0].relX) * 5)) *
        0.25;

      if (!isNaN(frq)) {
        sounds[sounds.length - 1].linearScale = (log2(frq / 440.0) + 4) / 10;
        sounds[sounds.length - 1].trigger(att, rel, frq); //trigger last in the sounds list
      }
    }
  }
  if (play) {
    setTimeout(loop, 60000 / ($('#xyTemSca')[0].relX * 300 + 20));
  }
}

function log2(x) {
  return Math.log(x) / Math.log(2);
}

function Sound() {
  this.osc = atx.createOscillator();
  this.vol = atx.createGain();
  this.linearScale = 0.5; //between 0..1 representing the frequency in linear scale like piano keys
  this.playing = false;
}

Sound.prototype.trigger = function(att, rel, frq) {
  var now = atx.currentTime;
  //var dyn = 1-parseInt(input_dynamics.value)/100;
  var dyn = $('#xyDetDyn')[0].relY;

  this.vol.gain.cancelScheduledValues(now);
  this.vol.gain.setValueAtTime(0, now);
  this.vol.gain.linearRampToValueAtTime(
    dyn + Math.random() * (1 - dyn),
    now + att / 1000
  );
  var self = this;

  setTimeout(function() {
    //
    self.vol.gain.cancelScheduledValues(atx.currentTime);
    self.vol.gain.setValueAtTime(self.vol.gain.value, atx.currentTime);
    self.vol.gain.linearRampToValueAtTime(0, atx.currentTime + rel / 1000);
  }, att);

  this.osc.frequency.setValueAtTime(frq, now);
  this.playing = true;
  sounds.unshift(sounds.pop()); //this is the last object in the array, move to be the first

  function isReady(t) {
    setTimeout(function() {
      if (self.vol.gain.value != 0) {
        //if value ramp not ready yet...
        isReady(15); //...wait 15ms and try again :)
      } else {
        //Ramp done! execute callback if there's one
        self.playing = false;
      }
    }, t);
  }

  isReady(att + rel);
};

function initSounds() {
  //creates Sound objects and starts playing them
  console.log(Sound);
  var polyphony = 20; //how many sounds available for simultaneous playback
  for (var i = 0; i < polyphony; i++) {
    sounds[i] = new Sound();
    sounds[i].vol.connect(mainVol);
    sounds[i].osc.connect(sounds[i].vol);
    sounds[i].vol.gain.setValueAtTime(0, atx.currentTime); //muse first
    sounds[i].osc.frequency.value = 440;
    sounds[i].osc.start(0);
  }
}

var view_then = Date.now();
var view_step = 0.02;

var viewLoop = function() {
  var now = Date.now(); //update what's the time now
  var delta = now - view_then; //calculate how long it is since last cycle, result is "delta"
  view_step = delta / 1000 || 0.01; //convert delta to seconds, is then called ctr.step which is global variable
  view_then = now; //update what's the new "now" after the function are executed
  view_render();
  requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.mozRequestAnimationFrame; //this will start calling the gameLoop
  requestAnimationFrame(viewLoop);
};

function view_render() {
  ctx.fillStyle =
    'rgb(' +
    Math.round($('#xyDetDyn')[0].relX * 555) +
    ',' +
    Math.round($('#xyAttRel')[0].relX * 126 + $('#xyTemSca')[0].relY * 126) +
    ',' +
    Math.round($('#xyTemSca')[0].relX * 255) +
    ')';
  sounds.forEach(function(s) {
    if (s.playing) {
      ctx.globalAlpha = s.vol.gain.value;
      ctx.fillRect(s.linearScale * canvas.width, canvas.height - 1, 1, 1); //draw one line to the bottom
    }
  });
  shift_canvas(canvas.width, canvas.height, 0, -1);
}

function shift_canvas(w, h, dx, dy) {
  var imageData = ctx.getImageData(0, 0, w, h);
  ctx.clearRect(0, 0, w, h);
  ctx.putImageData(imageData, dx, dy);
}
