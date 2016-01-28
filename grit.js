var generateWord = function(wordLen) {
  var letters = state.letters;
  var weights = [];
  var word = "";

  for(var l = 0; l < wordLen; l++) {
    for(var i = 0; i < letters.length; i++)
      weights[i] = stats[1].freqs[letters[i]];

    var totalWeight = 0;
    for(var i = 0; i < letters.length; i++)
      totalWeight += weights[i];

    var r = Math.random() * totalWeight;
    var w = 0;
    for(var i = 0; i < letters.length; i++) {
      w += weights[i];
      if(w > r) break;
    }
    if(i == letters.length) break;
    word += letters[i];
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
  console.log(spans[0]);
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
