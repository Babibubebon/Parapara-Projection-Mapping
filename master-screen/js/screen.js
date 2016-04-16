var ParaparaScreen = function (screen) {
  this.frames = [];
  this.currentIndex = 0;
  this.isPlaying = false;
  
  if (screen) {
    this.canvas = screen;
    this.context = screen.getContext("2d");
  } else {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
  }
  
  this.addFrame();
};

ParaparaScreen.prototype.setSize = function (width, height) {
  this.canvas.width = width;
  this.canvas.height = height;
};

ParaparaScreen.prototype.setPosition = function (x, y) {
  this.canvas.style.left = x + "px";
  this.canvas.style.top = y + "px";
};

ParaparaScreen.prototype.setId = function (id) {
  this.canvas.id = id;
};

ParaparaScreen.prototype.getImageData = function () {
  return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
};

ParaparaScreen.prototype.addFrame = function (index) {
  if (index === undefined || this.frames.length <= index) {
    index = this.frames.length;
  }
  
  var img = this.context.createImageData(this.canvas.width, this.canvas.height);
  this.frames.splice(index, 0, img);
};

ParaparaScreen.prototype.removeFrame = function (index) {
  if (0 <= index && index < this.frames.length) {
    this.frames.splice(index, 1);
  
    if (this.currentIndex === index && this.frames.length > 0) {
      // 現在のフレームを削除する場合
      if (index >= this.frames.length) {
        index = this.frames.length - 1; // 末尾
      }
      this.context.putImageData(this.frames[index], 0, 0);
      this.changeCurrentFrame(index);
    }
    if (index < this.currentIndex) {
      this.currentIndex--;
    }
  }
};

ParaparaScreen.prototype.changeCurrentFrame = function (index) {
  if (index < this.frames.length) {
    var currentImage = this.getImageData();
    this.frames[this.currentIndex] = currentImage;
    
    var img = this.frames[index];
    this.context.putImageData(img, 0, 0);
    
    this.currentIndex = index;
  }
};

ParaparaScreen.prototype.play = function (interval) {
  if (this.isPlaying !== false) {
    return false;
  }
  if (interval === undefined) {
    interval = 250;
  }
  
  var playingFrame = 0;
  this.isPlaying = setInterval(function() {
    playingFrame = (playingFrame + 1) % this.frames.length;
    this.changeCurrentFrame(playingFrame);
  }.bind(this), interval);
};

ParaparaScreen.prototype.stop = function () {
  if (this.isPlaying === false) {
    return false;
  }
  clearInterval(this.isPlaying);
  this.isPlaying = false;
  this.changeCurrentFrame(this.currentIndex);
};

ParaparaScreen.prototype.draw = function (begin, end, options) {
  if (options) {
    this.context.lineWidth = options.lineWidth !== undefined ? options.lineWidth : 1;
    this.context.strokeStyle = options.strokeStyle !== undefined ? options.strokeStyle : "#000000";
    this.context.lineCap = options.lineCap !== undefined ? options.lineCap : "round";
  }
  
  this.context.beginPath();
  this.context.moveTo(begin.x, begin.y);
  this.context.lineTo(end.x, end.y);
  this.context.stroke();
};


var ScreenServer = function(elm) {
  this.screens = {};
  this.element = elm;
};

ScreenServer.prototype.appendScreen = function (id) {
  if ( ! (id in this.screens)) {
    this.screens[id] = new ParaparaScreen(null);
    this.screens[id].setId(id);
    this.element.appendChild(this.screens[id].canvas);
    
    return this.screens[id];
  }
  return false;
};

ScreenServer.prototype.removeScreen = function (id) {
  if (id in this.screens) {
    this.element.removeChild(this.screens[id].canvas);
    delete this.screens[id];
  }
};

ScreenServer.prototype.getScreens = function () {
  return this.screens;
};

ScreenServer.prototype.getScreen = function (id) {
  if (id in this.screens) {
    return this.screens[id];
  }
  return false;
};
