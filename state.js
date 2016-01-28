state = {
  letters: "sieontrah",

  updateString: function(event) {
    var elem = event.target;
    if(elem.attributes["data-state-type"].value != "char-array") {
      console.log("Bad target for updateString: ", elem, "under", par);
      return;
    }
    var path = elem.getAttribute("data-state-path");
    var letter = elem.getAttribute("data-state-char");
    if(elem.classList.contains("active")) {
      elem.classList.remove("active");
      state[path] = state[path].replace(letter, "");
    } else {
      elem.classList.add("active");
      state[path] += letter;
    }
    localStorage[path] = state[path];
  },

  updateInt: function(event) {
    var elem = event.target;
    if(elem.attributes["data-state-type"].value != "int") {
      console.log("Bad target for updateInt: ", elem);
      return;
    }
    var path = elem.id;
    state[path] = elem.value;
    localStorage[path] = state[path];
  },

  setup: function() {
    var charArrays = document.querySelectorAll("[data-state-type=char-array]");
    for(var i = 0; i < charArrays.length; i++) {
      var elem = charArrays[i];
      var path = elem.getAttribute("data-state-path");
      var c = elem.getAttribute("data-state-char");
      if(state[path].indexOf(c) >= 0)
        elem.classList.add("active");
      elem.addEventListener("click", state.updateString);
    }

    var ints = document.querySelectorAll("[data-state-type=int]");
    for(var i = 0; i < ints.length; i++) {
      var elem = ints[i];
      var path = elem.id;
      if(state[path])
        elem.value = state[path];
      else
        state[path] = elem.value;
      console.log("Adding listener on ", elem);
      elem.addEventListener("change", state.updateInt);
    }
  },

  load: function() {
    for(path in localStorage) {
      state[path] = localStorage[path];
      var elem = document.getElementById(path);
      if(!elem) continue;
      var type = elem.getAttribute("data-state-type");
      if(!type) continue;
      switch(type) {
        case "int":
          state[path] = parseInt(state[path]);
          break;
        case "float":
          state[path] = parseFloat(state[path]);
          break;
      }
    }
  }
}
