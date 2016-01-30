var curHistory = [];

var now = function() {
  return (new Date()).getTime();
}

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

var generateTargets = function(letters) {
  var targets = [];
  var totalTargets = {};

  state.counts = state.counts || {};
  state.accuracy = state.accuracy || {};
  state.speed = state.speed || {};

  for(var i = 0; i < letters.length; i++) {
    var l = letters[i];
    targets[i] = {
      rarity: 1 / (1 + Math.sqrt(state.counts[l] || 0)),
      accuracy: (1 - (state.accuracy[l] || 0)),
      speed: 1 / (1 + Math.sqrt(state.speed[l] || 0)),
    }
    for(var w in targets[i])
      totalTargets[w] = (totalTargets[w] || 0) + targets[i][w];
  }

  mixedTargets = [];
  for(var i = 0; i < letters.length; i++) {
    mixedTargets[i] = 0;
    for(w in targets[i])
      mixedTargets[i] += targets[i][w] / totalTargets[w];
  }

  return mixedTargets;
}

var generateWeights = function(letters, targets, prefix, suffix, start) {
  var weights = [];
  var whichtable = start ? "firsts" : "freqs";
  var ngramLength = prefix ? prefix.length + 1 : suffix.length + 1
  if(ngramLength > 3)
    ngramLength = 3;
  var table = stats[ngramLength][whichtable];

  if(prefix)
    prefix = prefix.substr(-2);
  else
    suffix = suffix.substr(0, 2);

  for(var i = 0; i < letters.length; i++) {
    var l = letters[i];
    var ngram = prefix ? prefix + l : l + suffix;
    weights[i] = (table[ngram] || 0) * Math.sqrt(targets[i]);
  }

  return weights;
};

var generateWord = function(wordLen) {
  var letters = state.letters;
  var weights = [];

  var targets = generateTargets(letters);
  var word = pickOne(letters, targets);
  var pivotPos = Math.floor(Math.random() * wordLen);

  for(var l = pivotPos - 1; l >= 0; l--) {
    weights = generateWeights(letters, targets, null, word, l == 0);
    letter = pickOne(letters, weights);

    if(letter)
      word = letter + word;
  }

  for(var l = pivotPos + 1; l < wordLen; l++) {
    weights = generateWeights(letters, targets, word, null, l < 3);
    letter = pickOne(letters, weights);

    if(letter);
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
    state.counts[c] += correct[c];
  }
  state.setArray("accuracy");
  state.setArray("speed");
  state.setArray("counts");
}

var checkAddNewLetter = function() {
  for(var i = 0; i < state.letters.length; i++) {
    var letter = state.letters[i];
    if(state.accuracy[letter] < state.unlockAccuracy)
      return false;
    if(state.speed[letter] < state.unlockSpeed)
      return false;
    if(state.counts[letter] < state.unlockCount)
      return false;
  }
  var letters = Object.keys(stats[1].freqs);
  letters = letters.sort(function(a,b) { return stats[1].freqs[a] < stats[1].freqs[b]})
  for(var i = 0; i < letters.length; i++)
    if(state.letters.indexOf(letters[i]) == -1) {
      // TODO: this is hacky.
      state.updateString({ target:
        document.querySelector("[data-state-path=letters][data-state-char=" + letters[i] + "]")});
      break;
    }

  return true;
}

var checkLetter = function(event) {
  if(document.querySelector(":focus")) return;
  var active = document.querySelector("#words .active");
  if(!active && event.keyCode != 13)
    return;
  if(event.keyCode == 8) { // backspace
    var prev = active.previousSibling;
    if(prev) {
      active.classList.remove("active");
      prev.classList.add("active");
    }
    return;
  }
  if(event.keyCode == 13) { // return
    if(active == null)
      makeSentence();
    return;
  }
  var wrongLetter = document.getElementById("wrong-letter");

  var lastHistory = curHistory[curHistory.length - 1];
  var chord = lastHistory && now() - lastHistory[0] < state.chordThreshold;
  var keyCorrect = event.charCode == active.innerHTML.charCodeAt(0);
  var chordWrong = chord && lastHistory[1] != lastHistory[2];
  if(chord)
    console.log("chord:", lastHistory[2] + String.fromCharCode(event.charCode), " in ", now() - lastHistory[0], "ms");

  if(keyCorrect && !chordWrong) { // A good keystroke, whether in a chord or not
    //console.log("Good  keystroke: ", String.fromCharCode(event.charCode));
    active.classList.remove("active");
    var next = active.nextSibling;
    if(next)
      next.classList.add("active");
    else {
      document.querySelector("#words").classList.add("finished");
      collectStats();
      checkAddNewLetter();
    }
  } else if(!keyCorrect && !chordWrong) { // The first wrong keystroke of a chord
    //console.log("Bad first keystroke: ", String.fromCharCode(event.charCode));
    var chordLen = chord ? lastHistory[1].length + 1 : 1;
    active.classList.remove("active");
    active.classList.add("error");
    for(var i = 1; i < chordLen; i++) {
      active = active.previousSibling;
      active.classList.add("error");
    }
    active.classList.add("active");
  } else { // a continuation of a wrong chord
    //console.log("Continued bad keystroke: ", String.fromCharCode(event.charCode));
    var bad = active;
    if(chord)
      for(var i = 0; i < lastHistory[1].length; i++)
        bad = bad.nextSibling;
    bad.classList.add("error");
  }

  if(chord) {
    lastHistory[1] += active.innerHTML;
    lastHistory[2] += String.fromCharCode(event.charCode);
  } else {
    curHistory.push([now(), active.innerHTML, String.fromCharCode(event.charCode)]);
    lastHistory = curHistory[curHistory.length - 1];
  }

  if(lastHistory[1] != lastHistory[2])
    wrongLetter.innerHTML = lastHistory[2];
  else
    wrongLetter.innerHTML = "";

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

var reset = function() {
  state.reset();
  makeSentence();
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
  document.getElementById("reset").addEventListener("click", reset);
};

window.onload = init();
