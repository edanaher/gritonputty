state = {
  letters: "sieontrah",

  readElem: function(event) {
    var elem = event.target;
    var path = elem.getAttribute("data-state-path") || elem.id;
    switch(elem.getAttribute("data-state-type")) {
      case "int":
        state[path] = parseInt(elem.value);
        break;
      case "float":
        state[path] = parseFloat(elem.value);
        break;
      default:
        state[path] = elem.value;
    }
    localStorage[path] = JSON.stringify(state[path]);
  },

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
    state[path] = parseInt(elem.value);
    localStorage[path] = state[path];
  },

  updateFloat: function(event) {
    var elem = event.target;
    if(elem.attributes["data-state-type"].value != "float") {
      console.log("Bad target for updateFloat: ", elem);
      return;
    }
    var path = elem.id;
    state[path] = parseFloat(elem.value);
    localStorage[path] = state[path];
  },

  setArray: function(path, def) {
    state[path] = state[path] || {}
    var elems = document.querySelectorAll("[data-state-path=" + path + "]");
    for(i = 0; i < elems.length; i++) {
      var elem = elems[i];
      var type = elem.getAttribute("data-state-type") || "string";
      var key = elem.getAttribute("data-state-key");
      var val = state[path][key] || def;
      if(val !== undefined) {
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

  parseValue: function(path, val, type) {
    switch(type) {
      case "int":
        return parseInt(val);
        break;
      case "float":
        return parseFloat(val);
        break;
      default:
        return val;
    }
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

    var elems = document.querySelectorAll("[data-state-type]");
    for(var i = 0; i < elems.length; i++) {
      var elem = elems[i];
      var path = elem.getAttribute("data-state-path") || elem.id;
      var type = elem.getAttribute("data-state-type");

      if(type.slice(-5) == "array")
        continue;

      if(state[path] || elem.tagName != "INPUT")
        elem.value = state[path];
      else
        state[path] = state.parseValue(path, elem.value, type);
      elem.addEventListener("change", state.readElem);
    }

    var arrays = document.querySelectorAll("[data-state-type$=array]");
    var doneArrays = {}
    for(var i = 0; i < arrays.length; i++) {
      var elem = arrays[i];
      var path = elem.getAttribute("data-state-path");
      if(doneArrays[path])
        continue;
      state.setArray(path, 0);
      doneArrays[path] = true;
    }
  },

  load: function() {
    for(var i = 0; i < localStorage.length; i++) {
      path = localStorage.key(i);
      state[path] = localStorage[path];
      try {
        console.log(state[path]);
        state[path] = JSON.parse(state[path]);
      } catch(e) {
        console.log("Error parsing JSON: ", e, "on", path, "=>", state[path]);
      }
    }
  },

  reset: function() {
    for(path in state) {
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
