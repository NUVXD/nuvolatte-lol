var whiteKeyMap = '1234567890qwertyuiopasdfghjklzxcvbnm'.split('');
var blackKeyMap = '!@$%^*(QWERTYIOPSDGHJLZCV'.split('');

function paeCodeForKeyAtIndex(keyIndex) {
    if (keyIndex < 0) return "";
    var semitoneOffset = keyIndex;
    var baseOctave = 2;
    var noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    var noteIndex = semitoneOffset % 12;
    var octaveShift = Math.floor(semitoneOffset / 12);
    var octave = baseOctave + octaveShift;
    if (octave < 2 || octave > 7) return "";
    return noteNames[noteIndex] + octave;
}

function bindKeysToFunction(callback) {
    var keyElements = Array.from(document.querySelectorAll(".DA-PianoKeyboard li"));

    keyElements.forEach(function (el, idx) {
        el.addEventListener('mousedown', function () {
            el.classList.add('pressed');
            var noteLabel = paeCodeForKeyAtIndex(idx);
            callback(el, noteLabel, 'down');
        });
        el.addEventListener('mouseup', function () {
            el.classList.remove('pressed');
            var noteLabel = paeCodeForKeyAtIndex(idx);
            callback(el, noteLabel, 'up');
        });
        el.addEventListener('mouseleave', function () {
            el.classList.remove('pressed');
            var noteLabel = paeCodeForKeyAtIndex(idx);
            callback(el, noteLabel, 'up');
        });
    });

    var pressedKeys = {};
    var keyIndexMap = {};
    keyElements.forEach(function (el, idx) {
        var k = el.getAttribute('data-key');
        if (k) keyIndexMap[k] = idx;
    });

    document.addEventListener('keydown', function (e) {
        var code = e.code;
        if (pressedKeys[code]) return;
        pressedKeys[code] = e.key;

        var liIndex = keyIndexMap[e.key];
        if (liIndex !== undefined) {
            var el = keyElements[liIndex];
            el.classList.add('pressed');
            var noteLabel = paeCodeForKeyAtIndex(liIndex);
            callback(el, noteLabel, 'down');
        }
    });

    document.addEventListener('keyup', function (e) {
        var code = e.code;
        var originalKey = pressedKeys[code];
        if (!originalKey) return;
        pressedKeys[code] = null;

        var liIndex = keyIndexMap[originalKey];
        if (liIndex !== undefined) {
            var el = keyElements[liIndex];
            el.classList.remove('pressed');
            var noteLabel = paeCodeForKeyAtIndex(liIndex);
            callback(el, noteLabel, 'up');
        }
    });

    window.addEventListener('blur', function () {
        pressedKeys = {};
        keyElements.forEach(function (el) {
            el.classList.remove('pressed');
        });
    });
}