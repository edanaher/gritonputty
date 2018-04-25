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

  rotateTwiddler: function() {
    var rotated = document.getElementById("rotate-twiddler").checked;
    var mirrored = document.getElementById("mirror-twiddler").checked;
    var twiddlerDisplay = document.getElementById("twiddler-display");
    if(rotated)
      twiddlerDisplay.classList.add("rotated");
    else
      twiddlerDisplay.classList.remove("rotated");
    if(mirrored)
      twiddlerDisplay.classList.add("mirrored");
    else
      twiddlerDisplay.classList.remove("mirrored");
  },

  init: function() {
    document.getElementById("layout-physical").addEventListener("change", keyboard.updateTable);
    document.getElementById("layout-logical").addEventListener("change", keyboard.updateTable);
    document.getElementById("rotate-twiddler").addEventListener("change", keyboard.rotateTwiddler);
    document.getElementById("mirror-twiddler").addEventListener("change", keyboard.rotateTwiddler);
    keyTranslationTable = {};
    keyboard.updateTable();
    keyboard.rotateTwiddler();
    document.getElementById("twiddler-display-1-0").classList.add("active");
  }
}
