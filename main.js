var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

document.cookie = 'SameSite=Lax;';
 
function onYouTubeIframeAPIReady() {
  new YT.Player('player', {
    videoId: 'KnnvBbzDUpM',
    playerVars: {
      html5: 1,
      rel: 0,
      controls:  0,
      modestbranding : 1,
      enablejsapi: 1,
      disablekb: 1,
      showinfo: 0,
      autoplay: 1,
    },
    events: {
      "onReady": onPlayerReady,
      "onStateChange": onPlayerStateChange
    }
  });
}

function main() {

  window.body = document.body;
  window.canvas = getCanvas(window.innerWidth, window.innerHeight);
  window.context = canvas.getContext("2d");
  window.body.appendChild(canvas);
  window.characters = [];
  window.items = [];
  window.solids = [];
  window.scenery = [];
  window.view_x = 0;
  window.view_left_x  = 0;
  window.view_right_x = 0;
  window.view_y = 0;
  window.focus_x = 500;
  window.focus_y = 700;
  window.left_edge  = 200;
  window.right_edge = 500;
  window.up_edge  = 600;
  window.down_edge = 650;
  window.sounds = {};
  window.KeyState = new Array(256);
  window.KeyState.fill(0);
  
  //window.collisionFinder = new CollisionFinder(window.innerWidth, window.innerHeight, 4); 
  //startLoadingSounds();

  function updateCarema() {

    const pos_x = mainChar.x - view_x;
    const pos_y = mainChar.y - view_y;
    const _view_dx = Math.min(pos_x, left_edge) - left_edge;
    const view_dx = _view_dx ? _view_dx : Math.max(pos_x, right_edge) - right_edge;
    const view_dy = Math.min(Math.max(pos_y, up_edge), down_edge) - view_y - focus_y;

    if (0 <= mainChar.x && mainChar.x < 12300) {
       view_x += (view_dx/24);
       view_left_x  = view_x;
       view_right_x = view_x + 2560;
    }

    view_y += (view_dy/256);

    let back_pos = ((-view_x*.3) - 50);
    if (back_pos > 0) {
      back_pos = 0;
    }

    body.style.backgroundPosition = back_pos + "px";

    const d = document.getElementById('title');
    d.style.position = "absolute";
    d.style.left = (-view_x) + "px";
    const e = document.getElementById('credit');
    e.style.position = "absolute";
    e.style.left = (-view_x +270) + "px";
    const f = document.getElementById('explanation');
    f.style.position = "absolute";
    f.style.left = (-view_x +50) + "px";  
  }

  function upkeep() {

    updateCarema();

//    mainChar.handleKeys(KeyState);

//    collisionFinder.clear();

//    world.updateForNext();
//    chars.updateForNext();

//    collisionFinder.hitTest();

//    chars.updateForNow();
//    world.updateForNow();

    renderkeep();
  }

  function renderkeep() {

    refillCanvas();

    updateDataElement(window.score);
    updateDataElement(window.time);
    updateDataElement(window.coins);
    updateDataElement(window.lives);
  }

  function timerkeeper() {
    window.time.amount --;
    updateDataElement(window.time);
  }

  function keydown(event) {
    KeyState[event.keyCode] = 1;
  }

  function keyup (event) {
    KeyState[event.keyCode] = 0;
  }
  
  // window.timer = new Timer(1/120);
  // timer.update = function update(deltaTime) { upkeep(); renderkeep(); }

  // window.gametimer = new Timer(1/2);
  // gametimer.update = function update(deltaTime) { timerkeeper(); }

  window.DIR = {LEFT:-1,RIGHT:1}
  
  window.start = function () {
  //  GameStart();
  }

  document.onkeydown = keydown;
  document.onkeyup   = keyup;

  //setImages();

  GameStart();
}

function GameStart() {

  // window.world = new World();
  // window.chars = new Characters();
  // window.mainChar = Mario.getNew(0, 0, 32, 32, 32, DIR.RIGHT);
  // characters.push(mainChar);

  window.score = new DataObject(0, 0, "SCORE");
  window.time  = new DataObject(0, 0, "TIME");
  window.coins = new DataObject(0, 0, "COINS");
  window.lives = new DataObject(0, 0, "LIVES");

  const display = createElement("table", {id:"data_display", className:"display", style:{width: (window.innerWidth) + "px"}});
  display.appendChild(window.score.element);
  display.appendChild(window.time.element);
  display.appendChild(window.coins.element);
  display.appendChild(window.lives.element);

  window.body.appendChild(display);

  let greeter = "";
  greeter += "<div id='title' style='";
  greeter += "position:absolute;";
  greeter += "left:100px;top:120px;";
  greeter += "width:360px;max-height:360px;background-color:#d64d00;border-radius:7px;box-shadow:3px 3px #efb28b inset, -3px -3px black inset;";
  greeter += "background-image: url(\"Theme/Greeting.gif\"), url(\"Theme/Greeting.gif\"), url(\"Theme/Greeting.gif\"), url(\"Theme/Greeting.gif\");";
  greeter += "background-repeat: no-repeat;";
  greeter += "background-position: 10px 10px, 10px 170px, 340px 10px, 340px 170px";
  greeter += "'>";
  greeter += "  <p style='text-align:left;padding:20px 20px 20px 20px;color:#ffcccc;font-family:Super Plumber Bros;font-size:12px;text-shadow:3px 3px black'>";
  greeter += "    <span style='font-size:48px;line-height:48px;text-shadow:3px 6px black'>SUPER</span><br><br>";
  greeter += "    <span style='font-size:58px;line-height:58px;text-shadow:3px 6px black'>MORIO BROS.</span>";
  greeter += "  </p>";
  greeter += "</div>";
  greeter += "<div id='credit' style='text-align:right; position: absolute; left: 620px;top: 320px; color:#ffcccc;margin-top:-7px'>&copy;2020 S.ISHIZUKI</div>";
  greeter += "<p id='explanation' style='position: absolute; font-family: Press Start; left: 400px;top: 340px; text-align:center; margin-left:7px;'>";
  greeter += "  Arrow keys move";
  greeter += "  <br><br>";
  greeter += "  Space to Jump";
  greeter += "  <br>";
  greeter += "</p>";

  const element = document.createElement('div');
  element.setAttribute('class', 'className');
  element.innerHTML = greeter;

  const objBody = document.getElementsByTagName("body").item(0);
  objBody.appendChild(element);
  // timer.start();
  // gametimer.start();

  document.getElementById("player").removeAttribute("tabIndex");
  
  // document.bind("contextmenu",function(e) {
  //   e.preventDefault();
  // });

  focus();
}

var ready = false;

function onPlayerReady(event) {
  console.log("function onPlayerReady(event)");
}

function onPlayerStateChange(event) {
  const youtubePlayer = event.target;
  if (event.data === YT.PlayerState.ENDED) {
    youtubePlayer.seekTo(1);
  }
  else if (event.data == 1)  {
  }
  else if (event.data == -1) {
    youtubePlayer.playVideo();
  }
  else if (event.data == 2) {
  }
  console.log(event.data);
}

addEventListener('load', main);