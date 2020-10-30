function proliferate(elem, settings, no_override) {
  var setting, i;
  for(i in settings) {
    if(no_override && elem[i]) continue;
    if(typeof(setting = settings[i]) == "object") {
      if(!elem[i]) elem[i] = {};
      proliferate(elem[i], setting, no_override);
    }
    else elem[i] = setting;
  }
  return elem;
}

function createElement(type) {
  var elem = document.createElement(type || "div");
  var i = arguments.length;
  while(--i > 0) {
    proliferate(elem, arguments[i]);
  }
  return elem;
}

function getCanvas(width, height) {
  var canv = createElement("canvas", { width: width, height: height});
  var ctx = canv.getContext("2d");
  ctx.webkitImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.oImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  return canv;
}

function DataObject(amount, length, name) {
  this.amount = amount;
  this.length = length;
  this.name = name;
  this.element = createElement("td", {className: "indisplay"});
}

function updateDataElement(me) {
  var text = me.name + "\n" + (me.amount == "Infinity" ? "Inf" : me.amount);
  me.element.innerText = text;
  if(text.length > 14) me.element.style.width = "520px";
  else me.element.style.width = "";
}
