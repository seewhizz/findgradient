function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function changeColor() {
    var color1 = getRandomColor();
    var color2 = getRandomColor();
    document.body.style.background = "linear-gradient(to right,"+color1+", "+color2+")";
    document.getElementById("code").innerHTML = color1.toUpperCase() + "   " + color2.toUpperCase();
  
    var brightness = lightOrDark(color1);
  
    if (brightness == "dark") {
      document.getElementById("title").style.color = "white";
      document.getElementById("shades").style.color = "white";
      document.getElementById("code").style.color = "white";
      document.getElementById("hint").style.color = "white";
    } else {
      document.getElementById("title").style.color = "black";
      document.getElementById("shades").style.color = "black";
      document.getElementById("code").style.color = "black";
      document.getElementById("hint").style.color = "black";
    }
  }
  document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {
      changeColor();
    }
    if (e.keycode == 65) {
      changeColor();
    }
  };
  changeColor();
  
  document.getElementById("code").addEventListener("click", copyText, true);
  document.getElementById("hint").addEventListener("click", changeColor, true);
  
  function copyText() {
    var copyText = document.getElementById("code").innerText;
  
    copyTextToClipboard(copyText);
  
    document.getElementById("hint").innerHTML = "Copied to Clipboard";
    document.getElementById("hint").style.fontWeight = "bold";
  
    setTimeout(function () {
      document.getElementById("hint").innerHTML = "press spacebar for new color";
      document.getElementById("hint").style.fontWeight = "normal";
    }, 2000);
  }
  
  function lightOrDark(color) {
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(
        /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
      );
  
      r = color[1];
      g = color[2];
      b = color[3];
    } else {
      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));
  
      r = color >> 16;
      g = (color >> 8) & 255;
      b = color & 255;
    }
  
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  
    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {
      return "light";
    } else {
      return "dark";
    }
  }
  
  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
  
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      console.log("Fallback: Copying text command was " + msg);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
  
    document.body.removeChild(textArea);
  }
  
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        console.log("Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Could not copy text: ", err);
      }
    );
  }