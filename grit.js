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

var checkLetter = function(event) {
  var active = document.querySelector("#words .active");
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
    active.classList.remove("active");
    var next = active.nextSibling;
    if(next)
      next.classList.add("active");
    else
      document.querySelector("#words").classList.add("finished");
  } else {
    active.classList.add("error");
  }
  return true;
}

var makeSentence = function(event) {
  var words = document.querySelector("#words");
  words.classList.remove("finished");
  var sentence = generateSentence(100);
  var spans = [];
  words.innerHTML = "";
  for(i = 0; i < sentence.length; i++) {
    var s = document.createElement("span");
    s.innerHTML = sentence[i];
    spans.push(s);
    words.appendChild(s);
  }
  spans[0].classList.add("active");
};

var generatePage = function() {
  var lettersDiv = document.getElementById("letters");

  var letters = Object.keys(stats[1].freqs);
  letters = letters.sort(function(a,b) { return stats[1].freqs[a] < stats[1].freqs[b]})
  for(var i = 0; i < letters.length; i++) {
    var letter = letters[i];
    var div = document.createElement("div");
    div.setAttribute("data-state-char", letter);
    div.innerHTML = letter;
    lettersDiv.appendChild(div);
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
  startButton.addEventListener("click", makeSentence);
};

window.onload = init();
