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

  init: function() {
    document.getElementById("layout-physical").addEventListener("change", keyboard.updateTable);
    document.getElementById("layout-logical").addEventListener("change", keyboard.updateTable);
    keyTranslationTable = {};
    keyboard.updateTable();
  }
}
