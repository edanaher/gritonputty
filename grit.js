var curHistory = [];

var now = function() {
  return (new Date()).getTime();
}

var generateWeights = function(letters, prefix) {
  weights = [];
  whichtable = prefix.length < 3 ? "firsts" : "freqs"
  prefix = prefix.substr(-2);
  table = stats[prefix.length + 1][whichtable];

  for(var i = 0; i < letters.length; i++)
    weights[i] = table[prefix + letters[i]] || 0;
  return weights;
};

var pickOne = function(letters, weights) {
  var totalWeight = 0;
  for(var i = 0; i < letters.length; i++)
    totalWeight += weights[i];

  var r = Math.random() * totalWeight;
  var w = 0;
  for(var i = 0; i < letters.length; i++) {
    w += weights[i];
    if(w > r) break;
  }
  return letters[i];
}

var generateWord = function(wordLen) {
  var letters = state.letters;
  var weights = [];
  var word = "";

  for(var l = 0; l < wordLen; l++) {
    weights = generateWeights(letters, word);
    letter = pickOne(letters, weights);

    if(!letter) break;
    word += letter;
  }

  return word;
}

var generateSentence = function(length) {
  var sentence = "";
  for(i = 0; i < length; i++) {
    sentence += generateWord(3 + Math.floor(Math.random() * 4));
    if(sentence.length > length)
      break;
    sentence += " ";
  }
  return sentence;
}

var collectStats = function() {
  var correct = {}
  var incorrect = {}
  var speed = {}
  var lastTime = curHistory[0][0];
  var badRun = 0;
  for(var i = 1; i < curHistory.length; i++) {
    var entry = curHistory[i];
    if(entry[1]) { // correct press
      correct[entry[2]] = correct[entry[2]] || 0;
      correct[entry[2]]++;
      speed[entry[2]] = speed[entry[2]] || []
      // (60 seconds/minute) / (5 character/word) * (1000 ms/s) / (ms/char) = words/minute
      speed[entry[2]].push(60 / 5 * 1000 / (entry[0] - lastTime));
      console.log(entry[0] - lastTime, speed[entry[2]]);
      lastTime = entry[0];
    } else { // incorrect press
      badRun++;
      incorrect[entry[2]] = incorrect[entry[2]] || 0;
      incorrect[entry[2]]++;
    }
  }

  state.accuracy = state.accuracy || {}
  state.speed = state.speed || {}
  state.counts = state.counts || {}
  for(c in correct) {
    var accuracy = correct[c] / (correct[c] + (incorrect[c] || 0));
    state.accuracy[c] = state.accuracy[c] || 0;
    state.accuracy[c] = state.accuracy[c] * 0.8 + 0.2 * accuracy;

    var s = 0;
    for(var i = 0; i < speed[c].length; i++)
      s += speed[c][i];
    s /= speed[c].length;
    state.speed[c] = state.speed[c] || 0;
    state.speed[c] = state.speed[c] * 0.8 + 0.2 * s;

    state.counts[c] = state.counts[c] || 0;
    console.log(c, state.counts[c], correct[c]);
    state.counts[c] += correct[c];
  }
  state.setArray("accuracy");
  state.setArray("speed");
  state.setArray("counts");
}


var checkLetter = function(event) {
  if(document.querySelector(":focus")) return;
  var active = document.querySelector("#words .active");
  if(!active && event.keyCode != 13)
    return;
  if(event.keyCode == 8) { // backspace
    var prev = active.previousSibling;
    console.log("backspace: ", prev, active)
    if(prev) {
      active.classList.remove("active");
      prev.classList.add("active");
    }
    return;
  }
  if(event.keyCode == 13) { // return
    console.log("active is ", active);
    if(active == null)
      makeSentence();
    return;
  }
  if(event.charCode == active.innerHTML.charCodeAt(0)) {
    curHistory.push([now(), true, active.innerHTML])
    active.classList.remove("active");
    var next = active.nextSibling;
    if(next)
      next.classList.add("active");
    else {
      document.querySelector("#words").classList.add("finished");
      collectStats();
    }
  } else {
    curHistory.push([now(), false, active.innerHTML, String.fromCharCode(event.charCode)])
    active.classList.add("error");
  }
  return true;
}

var makeSentence = function(event) {
  var words = document.querySelector("#words");
  words.classList.remove("finished");
  var sentence = generateSentence(state["sentence-length"]);
  var spans = [];
  words.innerHTML = "";
  for(i = 0; i < sentence.length; i++) {
    var s = document.createElement("span");
    s.innerHTML = sentence[i];
    spans.push(s);
    words.appendChild(s);
  }
  spans[0].classList.add("active");
  curHistory = [];
};

var createDataType = function(clas, type, path, key, def) {
  var div = document.createElement("div");
  div.classList.add(clas);
  div.setAttribute("data-state-type", type);
  div.setAttribute("data-state-path", path);
  div.setAttribute("data-state-key", key);
  div.innerHTML = def;
  return div;
}

var generatePage = function() {
  var lettersDiv = document.getElementById("letters");

  var letters = Object.keys(stats[1].freqs);
  letters = letters.sort(function(a,b) { return stats[1].freqs[a] < stats[1].freqs[b]})
  for(var i = 0; i < letters.length; i++) {
    var letter = letters[i];

    var container = document.createElement("div");

    var div = document.createElement("div");
    div.classList.add("letter-enable");
    div.setAttribute("data-state-type", "char-array");
    div.setAttribute("data-state-path", "letters");
    div.setAttribute("data-state-char", letter);
    div.innerHTML = letter;
    container.appendChild(div);


    container.appendChild(createDataType("letter-accuracy", "percentage-array", "accuracy", letter, "0"));
    container.appendChild(createDataType("letter-speed", "int-array", "speed", letter, "0"));
    container.appendChild(createDataType("letter-counts", "log-array", "counts", letter, "0"));

    lettersDiv.appendChild(container);
  }

  document.addEventListener("keypress", checkLetter);
}

var init = function() {
  startButton = document.querySelector("#start");
  if(!startButton) {
    setTimeout(init, 100);
    return;
  }

  generatePage();
  state.load();
  state.setup();
  makeSentence();
  startButton.addEventListener("click", makeSentence);
};

window.onload = init();
