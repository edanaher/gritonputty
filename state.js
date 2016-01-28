state = {
  letters: "sieontrah",

  updateString: function(event) {
    var elem = event.target;
    var par = elem.parentNode;
    if(par.attributes["data-state-type"].value != "string") {
      console.log("Bad target for updateString: ", elem, "under", par);
      return;
    }
    var path = par.attributes["data-state-path"].value;
    var letter = elem.attributes["data-state-char"].value;
    if(elem.classList.contains("active")) {
      elem.classList.remove("active");
      state[path] = state[path].replace(letter, "");
    } else {
      elem.classList.add("active");
      state[path] += letter;
    }
  },

  setup: function() {
    var strings = document.querySelectorAll("[data-state-type=string]");
    for(var i = 0; i < strings.length; i++) {
      var elem = strings[i];
      var path = elem.attributes["data-state-path"].value;
      for(var j = 0; j < elem.children.length; j++) {
        var child = elem.children[j];
        var c = child.attributes["data-state-char"].value;
        if(state[path].indexOf(c) >= 0)
          child.classList.add("active");
        child.addEventListener("click", state.updateString);
      }
    }
  }
}
