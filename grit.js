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
  var sentence = "this is a test";
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
