state = {
  letters: "sieontrah",

  updateString: function(event) {
    var elem = event.target;
    var par = elem.parentNode;
    if(par.attributes["data-state-type"].value != "string") {
      console.log("Bad target for updateString: ", elem, "under", par);
      return;
    }
    var path = par.id;
    var letter = elem.attributes["data-state-char"].value;
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
    console.log("updating int: ", event);
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
    var strings = document.querySelectorAll("[data-state-type=string]");
    for(var i = 0; i < strings.length; i++) {
      var elem = strings[i];
      var path = elem.id;
      for(var j = 0; j < elem.children.length; j++) {
        var child = elem.children[j];
        var c = child.attributes["data-state-char"].value;
        if(state[path].indexOf(c) >= 0)
          child.classList.add("active");
        child.addEventListener("click", state.updateString);
      }
    }

    var ints = document.querySelectorAll("[data-state-type=int]");
    console.log(ints);
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
    }
  }
}
