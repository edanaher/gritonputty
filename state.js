state = {
  letters: "sieontrah",

  getPath(path) {
    path = path.split("-");
    var obj = state;
    for(var i = 0; i < path.length - 1; i++) {
      obj[path[i]] = obj[path[i]] || {};
      obj = obj[path[i]];
    }
    key = path[path.length - 1];
    return [path[0], obj, key];
  },

  readElem: function(event) {
    var elem = event.target;
    var path = elem.getAttribute("data-state-path") || elem.id;
    var [head, obj, key] = state.getPath(path);

    switch(elem.getAttribute("data-state-type")) {
      case "int":
        obj[key] = parseInt(elem.value);
        break;
      case "float":
        obj[key] = parseFloat(elem.value);
        break;
      default:
        obj[key] = elem.value;
    }
    localStorage[head] = JSON.stringify(state[head]);
  },

  setElem: function(elem, def) {
    var path = elem.getAttribute("data-state-path") || elem.id;
    var type = elem.getAttribute("data-state-type");

    if(type == "char-array")
      return;

    [head, obj, key] = state.getPath(path);

    if(obj[key] === null || obj[key] === undefined)
      obj[key] = state.parseValue(def, type);

    if(obj[key] && (elem.tagName == "INPUT" || elem.tagName == "SELECT"))
      elem.value = obj[key];
    else if(obj[key] !== null && obj[key] !== undefined)
      elem.innerHTML = state.displayValue(obj[key], type);
    else if(elem.tagName == "INPUT" || elem.tagName == "SELECT")
      obj[key] = state.parseValue(elem.value, type);
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

  setArray: function(path, def) {
    state[path] = state[path] || {}
    var elems = document.querySelectorAll("[data-state-path^=" + path + "]");
    for(i = 0; i < elems.length; i++)
      state.setElem(elems[i], def);
    localStorage[path] = JSON.stringify(state[path]);
  },

  parseValue: function(val, type) {
    switch(type) {
      case "int":
        return parseInt(val);
        break;
      case "float":
      case "percentage":
      case "log":
        return parseFloat(val);
        break;
      default:
        return val;
    }
  },

  displayValue: function(val, type) {
    switch(type) {
      case "int":
        return Math.floor(val);
      case "percentage":
        return Math.floor(val * 100);
      case "log":
        val = parseFloat(val);
        return val > 0 ? Math.floor(Math.log2(val)) : "-";
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
      state.setElem(elems[i], elems[i].getAttribute("data-state-default"));
      elems[i].addEventListener("change", state.readElem);
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
        state[path] = JSON.parse(state[path]);
      } catch(e) {
        console.log("Error parsing JSON: ", e, "on", path, "=>", state[path]);
      }
    }
  },

  migrate: function() {
    var unlocks = { "unlockAccuracy": "accuracy",
                    "unlockSpeed": "speed",
                    "unlockCount": "count" };
    for(key in unlocks)
      if(localStorage[key]) {
        var unlock = JSON.parse(localStorage.unlock || "{}")
        unlock[unlocks[key]] = parseFloat(localStorage.unlockAccuracy);
        localStorage.unlock = JSON.stringify(unlock);
        localStorage.removeItem(key);
      }
    var weights = { "statsLetterWeight": "letter",
                    "statsSentenceWeight": "sentence" };
    for(key in weights)
      if(localStorage[key]) {
        var weight = JSON.parse(localStorage.weight || "{}")
        weight[weights[key]] = parseFloat(localStorage.weight);
        localStorage.weight = JSON.stringify(weight);
        localStorage.removeItem(key);
      }
  },

  reset: function() {
    for(path in state) {
      if(state[path] instanceof Function)
        continue;
      delete state[path];
      localStorage.removeItem(path);
    }

    state.letters = "sieontrah";
    state.setup();
  }
}
