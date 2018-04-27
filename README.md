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

Twiddler-specific tweaks
------------------------
One feature of the twiddler is chords sending multiple keystrokes.  This can confuse typing tutors; if next two letters are "ne", and the "an" chord is pressed, a naive implementation would have a typo for "a" immediately followed by a correct "n".  However, the overall chord is wrong.

In my tests, the twiddler always sent chords with 7 or 8 milliseconds between characters.  So if keystrokes are received within a (configurable) threshold (defaulting to 10 ms), they are treated as a single unit, either all correct or all incorrect.

Future work
-----------
Lots of work remains:
- Requiring chords: In a perfect world, multi-letter chords should be used on the twiddler wherever possible to speed up typing.  After letters are learned, start adding in chords that *must* be used, rejecting the individual characters as errors, even though they are technically correct.
- Changing letter ordering: currently letters are added based on approximate frequency, but for learning a traditional layout, it would make sense to order them based on keyboard layout (home row first, etc.).
- Pretty UI: Right now it's functional, but pretty ugly.  Once the features are fundamentally done, figure out a better layout.

No-longer future work
---------------------
This stuff has been done:
- Non-alpha keys: Punctuation works.  Though the twiddler display is iffy due to incomplete twiddler.cfg parsing.
- Twiddler display: The twiddler can be displayed (after a configurable delay or on young letters), and should work.  It's kind of ugly, but Works For Me.
