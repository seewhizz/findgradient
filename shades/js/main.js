function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function hex(c) {
  var s = "0123456789abcdef";
  var i = parseInt(c);
  if (i == 0 || isNaN(c)) return "00";
  i = Math.round(Math.min(Math.max(0, i), 255));
  return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
}

/* Convert an RGB triplet to a hex string */
function convertToHex(rgb) {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/* Remove '#' in color hex string */
function trim(s) {
  return s.charAt(0) == "#" ? s.substring(1, 7) : s;
}

/* Convert a hex string to an RGB triplet */
function convertToRGB(hex) {
  var color = [];
  color[0] = parseInt(trim(hex).substring(0, 2), 16);
  color[1] = parseInt(trim(hex).substring(2, 4), 16);
  color[2] = parseInt(trim(hex).substring(4, 6), 16);
  return color;
}

function generateColor(colorStart, colorEnd, colorCount) {
  // The beginning of your gradient
  var start = convertToRGB(colorStart);

  // The end of your gradient
  var end = convertToRGB(colorEnd);

  // The number of colors to compute
  var len = colorCount;

  //Alpha blending amount
  var alpha = 0.0;

  var saida = [];

  for (i = 0; i < len; i++) {
    var c = [];
    alpha += 1.0 / len;

    c[0] = start[0] * alpha + (1 - alpha) * end[0];
    c[1] = start[1] * alpha + (1 - alpha) * end[1];
    c[2] = start[2] * alpha + (1 - alpha) * end[2];

    saida.push(convertToHex(c));
  }

  return saida;
}

document.body.onkeyup = function (e) {
  if (e.keyCode == 32) {
    generateShades();
  }
  if (e.keycode == 65) {
    generateShades();
  }
};
generateShades();
document.getElementById("hint").addEventListener("click", generateShades, true);

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

$("div.grid-item").click(function () {
  var text = $(this).text();
  
  copyTextToClipboard(text);

  document.getElementById("hint").innerHTML = "Copied to Clipboard";
  document.getElementById("hint").style.fontWeight = "bold";

  setTimeout(function () {
    document.getElementById("hint").innerHTML = "press spacebar for new gradient";
    document.getElementById("hint").style.fontWeight = "normal";
  }, 2000);
});

function generateShades() {
  $("#shades").html("");

  var color1 = getRandomColor();
  var color2 = getRandomColor();

  var tmp = generateColor(color1, color2, 15);
  for (cor in tmp) {
    $("#shades").append(
      "<div id='code' class='grid-item' style='background-color:#" +
        tmp[cor] +
        "'>" +
        "#" +
        tmp[cor] +
        "</div>"
    );
  }

  document.body.style.background =
    "linear-gradient(to right," + color1 + ", " + color2 + ")";

  var brightness = lightOrDark(color1);

  if (brightness == "dark") {
    document.getElementById("title").style.color = "white";
    document.getElementById("hint").style.color = "white";
    document.getElementById("shades").style.color = "white";
    document.getElementById("shades").style.borderColor = "white";
    document.getElementById("shades").style.backgroundColor = "white";
  } else {
    document.getElementById("title").style.color = "black";
    document.getElementById("hint").style.color = "black";
    document.getElementById("shades").style.color = "black";
    document.getElementById("shades").style.borderColor = "black";
    document.getElementById("shades").style.backgroundColor = "black";
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

