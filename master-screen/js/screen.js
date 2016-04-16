var ParaparaScreen = function (screen, parent) {
  this.frames = [];
  this.parent = parent;
  
  if (screen) {
    this.canvas = screen;
    this.context = screen.getContext("2d");
  } else if (parent) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    parent.appendChild(this.canvas);
  }
};

ParaparaScreen.prototype.setSize = function (width, height) {
  this.canvas.width = width;
  this.canvas.height = height;
};

ParaparaScreen.prototype.setPosition = function (x, y) {
  this.canvas.style.left = x + "px";
  this.canvas.style.top = y + "px";
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
    this.screens[id] = new ParaparaScreen(null, this.element);
  }
};

ScreenServer.prototype.removeScreen = function (id) {
  if (id in this.screens) {
    delete this.addScreen[id];
  }
};

ScreenServer.prototype.getScreen = function (id) {
  if (id === undefined) {
    return this.screens;
  }
  if (id in this.screens) {
    return this.screens[id];
  }
  return false;
};
