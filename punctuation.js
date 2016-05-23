punctuation = {
  symbols: {
    ".": { },
    ",": { },
    "'": { "pos": "apostrophe" },
    '"': { "pos": "boundary" },
    "_": { "pos": "infix" },
   },
  add: function(word, sym) {
    switch(punctuation.symbols[sym].pos) {
      case "apostrophe":
        var r = Math.random();
        if(r < 0.3)
          return word + sym + 's';
        if(r < 0.5)
          return word + 's' + sym;
        if(r < 0.7)
          return word + sym;
        if(r < 0.8)
          return sym + word;
        // fall through
      case "infix":
        var i = Math.floor(Math.random() * (word.length - 2)) + 1;
        return word.slice(0, i) + sym + word.slice(i, word.length);
      case "boundary":
        if(Math.random() < 0.5)
          return sym + word;
        else
          return word + sym;
      default:
        return word + sym;
    }
  }
}

