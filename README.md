Grit on Putty
=============

An engineer's typing tutor
--------------------------

This is a work in progress typing tutor I'm using to learn typing on a [Twiddler3](http://twiddler.tekgear.com/).

Heavily inspired by [keybr.com](http://www.keybr.com), but far more tunable and with more exposed information.

Rather than slowly adding new letters as a mysterious "confidence" score
increases, accuracy, speed, and letter counts are directly exposed, along with
thresholds to meet to unlock new letters.  You can also directly lock or unlock
new letters by clicking on them.

The scores for each letter are updated according to an exponentially-weighted average, with tunable weights for each letter occurring in a sentence as well as the overall sentence average.  (This provides an extra boost for rare letters; with the default letter weight of 0.01 and sentence weight of 0.02, a single letter would have a weight of roughly 0.03 in the update; three letters would have a weight of roughly 0.05.)

The word generation is also tuned to my liking - rather than focusing on a letter for each phrase, which I find irritating, the algorithm weights letters based on (functions of) accuracy, speed, rarity, and if they're below the unlock threshold, according to configurable weights.  But to generate English-like text, it also chooses letters based on letter frequencies, as well as digrams and trigrams.

More precisely, for each word, a "pivot" letter is picked.  (This choice can be further biased towards heavily-weighted letters by increasing the pivot exponent.)  This pivot letter is assigned a random position in the word, and the remaining letters are chosen by multiplying the likelihood in English text (based on frequency, digrams, and trigrams) by the "weight" of the letter based on how much trouble the user is having with it (speed, accuracy, and count seen so far).

The overall result is, to me, an excellent blend of focusing on problem or new letters, typing realistic combinations of letters, and avoiding single-minded focus on problem letters.

