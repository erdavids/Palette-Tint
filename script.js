// noprotect

var w = window.innerWidth;
var h = window.innerHeight;

const opts = {
  // Generation Details
  overlay_color: "#ffffff",
  overlay_opacity: 255,
  overlay_enabled: false,
  show_original_colors: false,
  palette_input: "",
  remove_index: "",

  // Add colors here for initial palette list
  palette_list: [
    ["#50514f","#f25f5c","#ffe066","#247ba0","#70c1b3"],
    ["#52489c","#4062bb","#59c3c3","#ebebeb","#f45b69","#ff9fb2"]
  ],
  palette_sep:0,

  // // Additional Functions
  Print: () => printPalettes(),
  Generate: () => randomize(),
  Save: () => save(),
  SourceCode: () => sourceCode(),
  Twitter: () => twitter()
};

function sourceCode() {
  window.open('https://www.twitter.com/TheBuffED')
}

function twitter() {
  window.open('https://www.twitter.com/TheBuffED')
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function parsePalette(p) {
  // Use any comma separated format for hex code?
  if (p && p.length > 0) {
    p_list = p.split(",");
    p_to_add = [];
    if (p_list && p_list.length > 0) {
      for (let i = 0; i < p_list.length; i++) {
        current_color = p_list[i].trim();
        current_color = current_color.replaceAll("'", "");
        current_color = current_color.replaceAll('"', "");
        current_color = current_color.replaceAll("#", "");
        current_color = "#" + current_color;
        print(current_color);

        p_to_add.push(current_color);
      }
    }
    if (opts.palette_list.includes(p_to_add) == false) {
      opts.palette_list.push(p_to_add);
    }
  }
}

function printPalettes() {
  console.log("Here are the colors with overlay");

  // Go through and get the color of each
  overlay_palettes = [];
  if (opts.palette_list) {
    row_height = h / opts.palette_list.length;
    for (let p = 0; p < opts.palette_list.length; p++) {
      current_palette = [];
      column_width = w / opts.palette_list[p].length;
      for (let c = 0; c < opts.palette_list[p].length; c++) {
        current_color = get(
          c * column_width + column_width / 2,
          p * row_height + row_height / 2
        );
        current_palette.push(
          rgbToHex(current_color[0], current_color[1], current_color[2])
        );
      }
      overlay_palettes.push(current_palette);
    }
  }
  print(overlay_palettes);
  console.log("Here are the original palettes");
  console.log(opts.palette_list);
}

function removePalette() {}

window.onload = function () {
  var gui = new dat.GUI({ width: 300 });
  gui.addColor(opts, "overlay_color").name("Overlay Color").onChange(randomize);
  gui.add(opts, "overlay_opacity", 0, 255).step(1).name("Overlay Opacity").onChange(randomize);
  gui.add(opts, "overlay_enabled").name("Overlay Enabled").onChange(randomize);
  gui.add(opts, "show_original_colors").name("Show Original Colors").onChange(randomize);
  gui.add(opts, "palette_input").name("Input Palette").onFinishChange(function (v) {
    // Add palette to list
    parsePalette(v);
    randomize();
  });
  gui.add(opts, "remove_index").name("Remove Index").onFinishChange(function (v) {
    if (v && opts.palette_list.length > 1 ) {
      opts.palette_list.splice(v, 1);
      randomize();
    }
  });
  gui.add(opts, "palette_sep", 0, 50).name("Palette Sep").step(1).onChange(randomize);

  gui.add(opts, "Print").name("Log to Console");
  gui.add(opts, "Generate").name("Refresh");
  gui.add(opts, "Save").name("Save Image");
  var made = gui.addFolder("Made by Eric Davidson");
  made.add(opts, "Twitter");
};

function randomize() {
  setup();
}

function rn(a, b) {
  return a + (b - a) * fxrand(1);
}
function ri(a, b) {
  return Math.floor(rn(a, b + 1));
}
function rp(l) {
  return l[ri(0, l.length - 1)];
}
function rd() {
  return fxrand(1);
}

function get_rgb(c) {
  return [red(c), green(c), blue(c)];
}

function setup() {
  createCanvas(w, h).elt.id = "sketch";
  background('#FAF0E1');
  noStroke();

  // Draw each palette across canvas
  if (opts.palette_list) {
    row_height = h / opts.palette_list.length;
    for (let p = 0; p < opts.palette_list.length; p++) {
      column_width = w / opts.palette_list[p].length;
      for (let c = 0; c < opts.palette_list[p].length; c++) {
        fill(opts.palette_list[p][c]);
        rect(c * column_width, p * row_height + opts.palette_sep, column_width, row_height - (opts.palette_sep*2));
      }
    }
  }

  if (opts.overlay_enabled) {
    // Put the overlay over the entire image
    fill(...get_rgb(opts.overlay_color), opts.overlay_opacity);
    if (opts.show_original_colors) {
      if (opts.palette_list) {
        row_height = h / opts.palette_list.length;
        for (let p = 0; p < opts.palette_list.length; p++) {
          rect(0, p * row_height + row_height/2, w, row_height/2)
        }
      }
    } else {
      rect(0, 0, w, h);
    }
  }
}
