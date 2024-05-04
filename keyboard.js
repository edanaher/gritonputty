keyboard = {
  layouts:  {
    qwerty: ["qwertyuiop[]\\", "asdfghjkl;'", "zxcvbnm,./",
             "QWERTYUIOP{}|", "ASDFGHJKL:\"", "ZXCVBNM<>?"],
    workman: ["qdrwbjfup;[]\\", "ashtgyneoi'", "zxmcvkl,./",
              "QDRWBJFUP:{}|", "ASHTGYNEOI\"", "ZXMCVKL<>?"]
  },

  buildTable: function(physical, logical) {
    var phys = keyboard.layouts[physical];
    var log = keyboard.layouts[logical];
    if(!phys || !log)
      return null 

    var table = {}
    for(var i = 0; i < phys.length; i++)
      for(j = 0; j < phys[i].length; j++)
        table[phys[i][j]] = log[i][j];
    return table;
  },

  updateTable: function() {
    var phys = document.getElementById("layout-physical").value;
    var log = document.getElementById("layout-logical").value;
    var table = keyboard.buildTable(phys, log);
    if(table)
      keyTranslationTable = table;
  },

  toggleDummyInput: function() {
    var dummyInput = document.getElementById("dummy-input");
    var val = document.getElementById("show-dummy-input").checked;
    if(val)
      dummyInput.classList.remove("hidden");
    else
      dummyInput.classList.add("hidden");
  },

  toggleTwiddlerClass: function(checkbox, clas, inverted) {
    var twiddlerDisplay = document.getElementById("twiddler-display");
    var val = document.getElementById(checkbox).checked;
    if(inverted)
      val = !val;
    if(val)
      twiddlerDisplay.classList.add(clas);
    else
      twiddlerDisplay.classList.remove(clas);
  },

  rotateTwiddler: function() {
    keyboard.toggleTwiddlerClass("show-twiddler", "hidden", true);
    keyboard.toggleTwiddlerClass("rotate-twiddler", "rotated");
    keyboard.toggleTwiddlerClass("mirror-twiddler", "mirrored");
    keyboard.toggleTwiddlerClass("flip-twiddler", "flipped");
  },

  init: function() {
    document.getElementById("layout-physical").addEventListener("change", keyboard.updateTable);
    document.getElementById("layout-logical").addEventListener("change", keyboard.updateTable);
    document.getElementById("rotate-twiddler").addEventListener("change", keyboard.rotateTwiddler);
    document.getElementById("mirror-twiddler").addEventListener("change", keyboard.rotateTwiddler);
    document.getElementById("flip-twiddler").addEventListener("change", keyboard.rotateTwiddler);
    document.getElementById("show-twiddler").addEventListener("change", keyboard.rotateTwiddler);
    document.getElementById("show-dummy-input").addEventListener("change", keyboard.toggleDummyInput);
    keyTranslationTable = {};
    keyboard.updateTable();
    keyboard.rotateTwiddler();
    keyboard.toggleDummyInput();
    if(state.twiddlerBinConfig)
      state.twiddlerLayout = new TwiddlerConfigV5(state.twiddlerBinConfig);
    drawTwiddler();
  }
}
