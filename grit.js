var generateWeights = function(letters, prefix) {
  weights = [];
  whichtable = prefix.length < 3 ? "firsts" : "freqs"
  prefix = prefix.substr(-2);
  table = stats[prefix.length + 1][whichtable];

  for(var i = 0; i < letters.length; i++)
    weights[i] = table[prefix + letters[i]] || 0;
  console.log(prefix, letters, weights);
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
  var active = document.querySelector(".active");
  if(event.charCode == active.innerHTML.charCodeAt(0)) {
    active.classList.remove("active");
    var next = active.nextSibling;
    if(next)
      active.nextSibling.classList.add("active");
    else
      makeSentence();
  }
  return true;
}

var makeSentence = function(event) {
  var words = document.querySelector("#words");
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
  document.addEventListener("keypress", checkLetter);
};

var init = function() {
  startButton = document.querySelector("#start");
  if(!startButton) {
    setTimeout(init, 100);
    return;
  }
  startButton.addEventListener("click", makeSentence);
};

window.onload = init();
