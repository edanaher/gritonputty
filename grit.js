var curHistory = [];

var now = function() {
  return (new Date()).getTime();
}

var pickOne = function(letters, weights, e) {
  e = e || 1
  var totalWeight = 0;
  for(var i = 0; i < letters.length; i++)
    totalWeight += Math.pow(weights[i], e);

  if(totalWeight < 1e-9)
    return letters[Math.floor(Math.random() * letters.length)];

  var r = Math.random() * totalWeight;
  var w = 0;
  for(var i = 0; i < letters.length; i++) {
    w += Math.pow(weights[i], e);
    if(w > r) break;
  }
  if(i == letters.length)
    console.log("Failed to pick letter from", letters, "according to", weights);
  return letters[i];
}

var letterOverThreshold = function(letter) {
  if(state.accuracy[letter] < state.unlock.accuracy)
    return false;
  if(state.speed[letter] < state.unlock.speed)
    return false;
  if(state.counts[letter] < state.unlock.counts)
    return false;
  return true;
}

var colorThresholds = function() {
  var thresholds = ["accuracy", "speed", "counts"];
  for(t in thresholds) {
    var threshold = thresholds[t];
    for(l in state[threshold]) {
      quote = l == '"' ? "'" : '"';
      var elem = document.querySelector("[data-state-path=" + quote + threshold + "-" + l + quote);
      if(!elem) continue;
      if(!state.counts[l]) continue;
      if(state[threshold][l] < state.unlock[threshold])
        elem.classList.add("low-stat");
      else
        elem.classList.remove("low-stat");
    }
  }
}

var generateTargets = function(letters) {
  var targets = [];
  var totalTargets = {};

  state.counts = state.counts || {};
  state.accuracy = state.accuracy || {};
  state.speed = state.speed || {};

  weights = state.targetTypeWeights;
  weights = weights || { counts: 1, accuracy: 1, speed: 1, threshold: 1 };

  for(var i = 0; i < letters.length; i++) {
    var l = letters[i];
    targets[i] = {
      counts: 1 / (1 + Math.sqrt(state.counts[l] || 0)),
      accuracy: (1 - (state.accuracy[l] || 0)*(state.accuracy[l] || 0)),
      speed: 1 / (1 + Math.sqrt(state.speed[l] || 0)),
      threshold: letterOverThreshold(l) ? 0 : 1,
    }
    for(var w in targets[i])
      totalTargets[w] = (totalTargets[w] || 0) + targets[i][w];
  }

  mixedTargets = [];
  for(var i = 0; i < letters.length; i++) {
    mixedTargets[i] = 0;
    for(w in targets[i])
      if(totalTargets[w])
        mixedTargets[i] += weights[w] * targets[i][w] / (totalTargets[w] || 1);
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

var weighClasses = function() {
  var classes = {
    letters: state.letters,
    punctuations: state.punctuations,
  }

  var symbols = [];
  for(var c in classes)
    symbols += classes[c];

  targets = generateTargets(symbols);

  var weights = {};
  var totalWeight = 0;
  var l = 0;
  for(var c in classes) {
    weights[c] = 0;
    for(i = 0; i < classes[c].length; i++)
      weights[c] += targets[l++];
    totalWeight += weights[c];
  }

  for(var c in weights)
    weights[c] /= totalWeight;

  return weights;
}

var generateWord = function(wordLen) {
  var letters = state.letters;
  var weights = [];

  var targets = generateTargets(letters);
  var classWeights = weighClasses();

  var totalTargets = 0;
  state.targets = {};
  for(var i = 0; i < letters.length; i++)
    totalTargets += targets[i];
  for(var i = 0; i < letters.length; i++)
    state.targets[letters[i]] = classWeights.letters * targets[i] / totalTargets;
  state.setArray("targets", "0");

  var word = pickOne(letters, targets, state.targetTypeWeights.pivotExponent);
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

    if(letter)
      word += letter;
  }

  if(word.length < wordLen)
    console.log("word is too short: ", word);

  var caps = Math.random()
  if(Math.random() < state.capital.chance * state.capital.chance)
    word = word.toUpperCase();
  else if(Math.random() < state.capital.chance)
    word = word.charAt(0).toUpperCase() + word.slice(1);


  var punctuations = state.punctuations;
  var punctTargets = generateTargets(punctuations);
  var totalPunctuationTargets = 0;

  for(var i = 0; i < punctuations.length; i++)
    totalPunctuationTargets += punctTargets[i];
  for(var i = 0; i < punctuations.length; i++)
    state.targets[punctuations[i]] = classWeights.punctuations * punctTargets[i] / totalPunctuationTargets;
  state.setArray("targets", "0");

  // TODO: Automatically pick probability for having punctuation at all
  var punctProb = classWeights.punctuations * state.punctuationMultiplier;
  for(var i = 0; i < wordLen; i++)
    if(Math.random() < punctProb) {
      var punct = pickOne(punctuations, punctTargets);
      word = punctuation.add(word, punct);
    }

  return word;
}

var generateSentence = function(length) {
  var sentence = "";
  for(var i = 0; i < length; i++) {
    sentence += generateWord(3 + Math.floor(Math.random() * 4));
    if(sentence.length > length)
      break;
    sentence += " ";
  }
  if(sentence.length < length)
    console.log("sentence is too short: ", sentence);
  if(state.capital.first)
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  return sentence;
}

var collectStats = function() {
  var correct = {}
  var incorrect = {}
  var speed = {}
  var lastTime = curHistory[0][0];
  for(var i = 0; i < curHistory.length; i++) {
    var entry = curHistory[i];
    if(entry[1] == entry[2]) { // correct press
      for(var c = 0; c < entry[1].length; c++) {
        var ch = entry[1][c].toLowerCase();
        correct[ch] = correct[ch] || 0;
        correct[ch]++;
        if(i > 0) { // No speed for the first character
          speed[ch] = speed[ch] || []
          // Split chord timing equally over its letters
          var charTime = (entry[0] - lastTime) / entry[1].length;
          // (60 seconds/minute) / (5 character/word) * (1000 ms/s) / (ms/char) = words/minute
          speed[ch].push(60 / 5 * 1000 / charTime);
        }
      }
      lastTime = entry[0];
    } else { // incorrect press
      for(var c = 0; c < entry[1].length; c++) {
        var ch = entry[1][c].toLowerCase();
        incorrect[ch] = incorrect[ch] || 0;
        incorrect[ch]++;
      }
    }
  }

  state.accuracy = state.accuracy || {}
  state.speed = state.speed || {}
  state.counts = state.counts || {}
  for(c in correct) {
    c = c.toLowerCase();
    state.counts[c] = state.counts[c] || 0;

    var newWeight = state.weight.sentence + (1-Math.pow(1-state.weight.letter, correct[c]));
    var letterFraction = correct[c] / (state.counts[c] + correct[c]);
    if(newWeight < letterFraction)
      newWeight = letterFraction;
    var oldWeight = 1 - newWeight;

    var accuracy = correct[c] / (correct[c] + (incorrect[c] || 0));
    state.accuracy[c] = state.accuracy[c] || 0;
    state.accuracy[c] = state.accuracy[c] * oldWeight + newWeight * accuracy;

    if(speed[c]) {
      var s = 0;
      for(var i = 0; i < speed[c].length; i++)
        s += speed[c][i];
      s /= speed[c].length;
      state.speed[c] = state.speed[c] || 0;
      state.speed[c] = state.speed[c] * oldWeight + newWeight * s;
    }

    state.counts[c] += correct[c];
  }
  state.setArray("accuracy");
  state.setArray("speed");
  state.setArray("counts");
  colorThresholds();
}

var checkAddNewLetter = function() {
  for(var i = 0; i < state.letters.length; i++)
    if(!letterOverThreshold(state.letters[i]))
      return false;
  for(var i = 0; i < state.punctuations.length; i++)
    if(!letterOverThreshold(state.punctuations[i]))
      return false;

  var letters = Object.keys(stats[1].freqs);

  if(state.letters.length < letters.length &&
     state.letters.length < 5 * state.punctuations.length) {
    // Unlock a letter
    letters = letters.sort(function(a,b) { return stats[1].freqs[a] < stats[1].freqs[b]})
    for(var i = 0; i < letters.length; i++)
      if(state.letters.indexOf(letters[i]) == -1) {
        // TODO: this is hacky.
        state.updateString({ target:
          document.querySelector("[data-state-path=letters][data-state-char=" + letters[i] + "]")});
        break;
      }
  } else {
    // TODO: is this hacky?
    var nextPunct = document.querySelector("#punctuation .symbol-enable:not(.active)");
    if(nextPunct)
      state.updateString({ target: nextPunct });
  }

  return true;
}

var checkLetter = function(event) {
  if(document.querySelector(":focus")) return;
  if(!event.ctrlKey && !event.altKey)
    event.preventDefault();
  var active = document.querySelector("#words .active");
  if(!active && event.keyCode != 13)
    return;
  if(event.keyCode == 8) { // backspace
    var prev = active.previousSibling;
    if(prev) {
      active.classList.remove("active");
      prev.classList.add("active");
    }
    drawTwiddlerSoon();
    return;
  }
  if(event.keyCode == 13) { // return
    if(active == null)
      makeSentence();
    return;
  }
  var wrongLetter = document.getElementById("wrong-letter");

  var keyPressed = String.fromCharCode(event.charCode);
  keyPressed = keyTranslationTable[keyPressed] || keyPressed;
  var lastHistory = curHistory[curHistory.length - 1];
  var chord = lastHistory && event.timeStamp - lastHistory[0] < state.chordThreshold;
  var expectedValue = active.childNodes[0].nodeValue;
  var keyCorrect = keyPressed == expectedValue;
  var chordWrong = chord && lastHistory[1] != lastHistory[2];
  if(chord)
    console.log("chord:", lastHistory[2] + keyPressed, " in ",
        event.timeStamp - lastHistory[0], "ms");
  var bad = active;
  var finished = false;

  if(keyCorrect && !chordWrong) { // A good keystroke, whether in a chord or not
    active.classList.remove("active");
    active.classList.add("correct");
    var next = active.nextSibling;
    if(next)
      next.classList.add("active");
    else
      finished = true;
    drawTwiddlerSoon();
  } else if(!keyCorrect && !chordWrong) { // The first wrong keystroke of a chord
    var chordLen = chord ? lastHistory[1].length + 1 : 1;
    active.classList.remove("active");
    active.classList.add("error");
    if(state.waitOnTypo)
      for(var i = 1; i < chordLen; i++) {
        active = active.previousSibling;
        active.classList.add("error");
      }
    else
        active = active.nextSibling;
    active.classList.add("active");
    drawTwiddler();
  } else { // a continuation of a wrong chord
    if(state.waitOnTypo)
      if(chord)
        for(var i = 0; i < lastHistory[1].length; i++)
          bad = bad.nextSibling;
    bad.classList.add("error");
    drawTwiddler();
  }

  if(chord) {
    lastHistory[1] += bad.innerHTML;
    lastHistory[2] += keyPressed;
  } else {
    curHistory.push([event.timeStamp, expectedValue, keyPressed]);
    lastHistory = curHistory[curHistory.length - 1];
  }

  if(lastHistory[1] != lastHistory[2])
    wrongLetter.innerHTML = lastHistory[2];
  else
    wrongLetter.innerHTML = "";

  if(finished) {
    document.querySelector("#words").classList.add("finished");
    collectStats();
    checkAddNewLetter();
    drawTwiddler();
  }

  return true;
}

var makeSentence = function(event) {
  var words = document.querySelector("#words");
  words.classList.remove("finished");
  var sentence = generateSentence(state["sentenceLength"]);
  colorThresholds();
  var spans = [];
  words.innerHTML = "";
  for(var i = 0; i < sentence.length; i++) {
    var s = document.createElement("span");
    s.innerHTML = sentence[i];
    spans.push(s);
    words.appendChild(s);
  }
  spans[0].classList.add("active");
  curHistory = [];
  drawTwiddlerSoon();
};

var createDataType = function(clas, type, path, def) {
  var div = document.createElement("div");
  div.classList.add(clas);
  div.setAttribute("data-state-type", type);
  div.setAttribute("data-state-path", path);
  div.setAttribute("data-state-default", def);
  div.innerHTML = def;
  return div;
}

var createSymbolDiv = function(sym, type) {
  var container = document.createElement("div");

  var div = document.createElement("div");
  div.classList.add("symbol-enable");
  div.setAttribute("data-state-type", "char-array");
  div.setAttribute("data-state-path", type + "s");
  div.setAttribute("data-state-char", sym);
  div.innerHTML = sym;
  container.appendChild(div);

  container.appendChild(createDataType(type + "-accuracy", "percentage", "accuracy-" + sym, "0"));
  container.appendChild(createDataType(type + "-speed", "int", "speed-" + sym, "0"));
  container.appendChild(createDataType(type + "-counts", "log", "counts-" + sym, "0"));
  container.appendChild(createDataType(type + "-targets", "percentage", "targets-" + sym, "0"));

  return container;
}

var loadTwiddlerConfig = function() {
  var input = document.getElementById("twiddler-config-file");
  if(!input.files[0])
    return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var binConfig = e.target.result;
    state.update("twiddlerBinConfig", binConfig);
    state.twiddlerLayout = new TwiddlerConfigV5(binConfig);
    drawTwiddlerSoon();
  }
  var binConfig = reader.readAsBinaryString(input.files[0])
}

var drawTwiddlerTimer = null;
var drawTwiddler = function() {
  if(drawTwiddlerTimer)
    clearTimeout(drawTwiddlerTimer)
  if(!state.twiddlerLayout)
    return;
  var active = document.querySelector("#words .active");
  var letter = active && active.childNodes[0].nodeValue
  var chord = letter && state.twiddlerLayout.toChord[letter];
  var twiddlerDisplay = document.getElementById("twiddler-display");
  // Ew... but this is currently necessary for capital letters.  Hopefully
  // upstream ConfigV5 will figure this out.
  if(!chord) {
    for(var r = 0; r < 5; r++)
      for(var c = 0; c < 3 + (r==0); c++)
        twiddlerDisplay.childNodes[r].childNodes[c].classList.remove("active");
    return;
  }
  var oldShift = chord.chord[0][3];
  if(letter != chord.text[0])
    chord.chord[0][3] = true;
  for(var r = 0; r < 5; r++)
    for(var c = 0; c < 3 + (r==0); c++)
      if(chord.chord[r][c])
        twiddlerDisplay.childNodes[r].childNodes[c].classList.add("active");
      else
        twiddlerDisplay.childNodes[r].childNodes[c].classList.remove("active");
  chord.chord[0][3] = oldShift;
}

var drawTwiddlerSoon = function() {
  var twiddlerDisplay = document.getElementById("twiddler-display");
  for(var r = 0; r < 5; r++)
    for(var c = 0; c < 3 + (r==0); c++)
      twiddlerDisplay.childNodes[r].childNodes[c].classList.remove("active");
  if(drawTwiddlerTimer)
    clearTimeout(drawTwiddlerTimer)
  drawTwiddlerTimer = setTimeout(drawTwiddler, state.showTwiddlerDelay * 1000);
}

var generatePage = function() {
  var inputs = document.querySelectorAll("input[data-state-type]");
  for(var i = 0; i < inputs.length; i++)
    if(!inputs[i].getAttribute("data-state-default"))
       inputs[i].setAttribute("data-state-default", inputs[i].value);


  var lettersDiv = document.getElementById("letters");

  var letters = Object.keys(stats[1].freqs);
  letters = letters.sort(function(a,b) { return stats[1].freqs[a] < stats[1].freqs[b]})
  for(var i = 0; i < letters.length; i++) {
    var letter = letters[i];

    lettersDiv.appendChild(createSymbolDiv(letter, "letter"));
  }

  var punctuationDiv = document.getElementById("punctuation");
  for(var p in punctuation.symbols) {
    var info = punctuation.symbols[p];
    punctuationDiv.appendChild(createSymbolDiv(p, "punctuation"));
  }

  var twiddlerDisplay = document.getElementById("twiddler-display");
  var row = document.createElement("div");
  row.classList.add("twiddler-row");
  for(var c = 0; c < 4; c++) {
    var cell = document.createElement("div");
    cell.classList.add("twiddler-cell");
    row.appendChild(cell);
  }
  twiddlerDisplay.appendChild(row);
  for(var r = 0; r < 4; r++) {
    var row = document.createElement("div");
    row.classList.add("twiddler-row");
    for(var c = 0; c < 3; c++) {
      var cell = document.createElement("div");
      cell.classList.add("twiddler-cell");
      row.appendChild(cell);
    }
    twiddlerDisplay.appendChild(row);
  }

  document.addEventListener("keypress", checkLetter);
  var loadbutton = document.getElementById("load-twiddler-config");
  loadbutton.addEventListener("click", loadTwiddlerConfig);
}

var calibrateChord =  {
  lastTime: 0,
  letters: [],
  timings: [],
  keypress: function(event) {
    if(document.querySelector(":focus")) return;
    if(!event.ctrlKey && !event.altKey)
      event.preventDefault();
    var dt = event.timeStamp - calibrateChord.lastTime;
    var keyPressed = String.fromCharCode(event.charCode);
    if(dt < 100) {
      timings.push(dt);
      calibrateChord.letters.push(keyPressed);
      var span = document.getElementById("calibrate-chord-time");
      span.innerHTML = calibrateChord.letters.join("") + ": " + timings.join(", ");
      if(dt > state.chordThreshold) {
        state.update("chordThreshold", Math.floor(dt * 1.1));
      }
    } else {
      timings = [];
      calibrateChord.letters = [keyPressed];
    }
    calibrateChord.lastTime = event.timeStamp;
  },

  start: function(event) {
    var calibrateButton = event.target;
    document.removeEventListener("keypress", checkLetter);
    document.addEventListener("keypress", calibrateChord.keypress);
    calibrateButton.removeEventListener("click", calibrateChord.start);
    calibrateButton.addEventListener("click", calibrateChord.stop);
    calibrateButton.innerHTML = "Stop";
  },

  stop: function(event) {
    var calibrateButton = event.target;
    document.removeEventListener("keypress", calibrateChord.keypress);
    document.addEventListener("keypress", checkLetter);
    calibrateButton.removeEventListener("click", calibrateChord.stop);
    calibrateButton.addEventListener("click", calibrateChord.start);
    calibrateButton.innerHTML = "Calibrate";
  },
}


var reset = function() {
  state.reset();
  makeSentence();
}

var init = function() {
  var startButton = document.querySelector("#start");
  var calibrateButton = document.querySelector("#calibrate-chord");
  if(!startButton || !calibrateButton) {
    setTimeout(init, 100);
    return;
  }

  generatePage();
  state.migrate();
  state.load();
  state.setup();
  makeSentence();
  keyboard.init();
  startButton.addEventListener("click", makeSentence);
  calibrateButton.addEventListener("click", calibrateChord.start);
  document.getElementById("reset").addEventListener("click", reset);
};

window.onload = init();
