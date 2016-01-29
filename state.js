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

  setArray: function(path) {
    if(!state[path])
      return;
    var elems = document.querySelectorAll("[data-state-path=" + path + "]");
    for(i = 0; i < elems.length; i++) {
      var elem = elems[i];
      var type = elem.getAttribute("data-state-type") || "string";
      var key = elem.getAttribute("data-state-key");
      var val = state[path][key];
      if(val) {
        switch(type) {
          case "percentage-array":
            elem.innerHTML = Math.floor(val * 100);
            break;
          case "int-array":
            elem.innerHTML = Math.floor(val);
            break;
          case "log-array":
            elem.innerHTML = Math.floor(Math.log2(val || 1));
            break;
          default:
            elem.innerHTML = val;
        }
      }
    }
    localStorage[path] = JSON.stringify(state[path]);
  },

  setup: function() {
    var charArrays = document.querySelectorAll("[data-state-type=char-array]");
    for(var i = 0; i < charArrays.length; i++) {
      var elem = charArrays[i];
      var path = elem.getAttribute("data-state-path");
      var c = elem.getAttribute("data-state-char");
      if(state[path].indexOf(c) >= 0)
        elem.classList.add("active");
      else
        elem.classList.remove("active");
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
      elem.addEventListener("change", state.updateInt);
    }

    var arrays = document.querySelectorAll("[data-state-key]");
    var doneArrays = {}
    for(var i = 0; i < arrays.length; i++) {
      var elem = arrays[i];
      var path = elem.getAttribute("data-state-path");
      if(doneArrays[path])
        continue;
      state.setArray(path);
      doneArrays[path] = true;
    }
  },

  load: function() {
    for(path in localStorage) {
      state[path] = localStorage[path];
      var elem = document.getElementById(path);
      if(!elem)
        elem = document.querySelector("[data-state-path=" + path + "]");
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
        case "percentage-array":
        case "int-array":
        case "log-array":
          state[path] = JSON.parse(state[path]);
      }
    }
  },

  reset: function() {
    for(path in state) {
      console.log("Trying to reset", path);
      if(state[path] instanceof Function)
        continue;
      console.log("Resetting", path);
      delete state[path];
      localStorage.removeItem(path);
    }

    state.letters = "sieontrah";
    state.setup();
  }
}
