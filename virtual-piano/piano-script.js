// |----------------------------------------------------|
// |--------------- MAPPING AND PRESSING ---------------|
// |----------------------------------------------------|

// ordered html key elements & keyboard keys maps
var whiteKeyMap = '1234567890qwertyuiopasdfghjklzxcvbnm'.split('');
var blackKeyMap = '!@$%^*(QWERTYIOPSDGHJLZCV'.split('');
let transposeSemitones = 0; // -3 to 3

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

// MAIN BINDING LOGIC
function bindKeysToFunction(callback) {
    // MOUSE 
    var keyElements = Array.from(document.querySelectorAll(".DA-PianoKeyboard li"));
    keyElements.forEach(function (el, idx) {
        el.addEventListener('mousedown', function () {
            el.classList.add('pressed');
            var noteLabel = paeCodeForKeyAtIndex(idx);
            callback(el, noteLabel, 'down', idx);
        });
        el.addEventListener('mouseup', function () {
            el.classList.remove('pressed');
            var noteLabel = paeCodeForKeyAtIndex(idx);
            callback(el, noteLabel, 'up', idx);
        });
        el.addEventListener('mouseleave', function () {
            el.classList.remove('pressed');
            var noteLabel = paeCodeForKeyAtIndex(idx);
            callback(el, noteLabel, 'up', idx);
        });
    });

    // KEYBOARD 
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
            callback(el, noteLabel, 'down', liIndex);
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
            callback(el, noteLabel, 'up', liIndex);
        }
    });

    // to prevent the window-swapping bug-thingy
    window.addEventListener('blur', function () {
        pressedKeys = {};
        // remove highlight
        keyElements.forEach(function (el) {
            el.classList.remove('pressed');
        });
        // stop sound
        activeNotes.forEach((_, keyIndex) => {
            synthNoteOff(keyIndex);
        });
    });
}

// |----------------------------------------------------|
// |-------------------- AUDIO STUFF -------------------|
// |----------------------------------------------------|

// GLOBAL CONSTANTS 
const audio = new (window.AudioContext)();
const mainGain = audio.createGain();
const activeNotes = new Map();

// initialize audio context
async function ensureAudio() {
    if (audio.state === "suspended") {
        await audio.resume();
    }
}

// audio gain (input volume) 
mainGain.gain.value = 0.3;
mainGain.connect(audio.destination);

// key index to MIDI to Hz 
function freqFromKeyIndex(keyIndex) {
    const midi = 36 + keyIndex + transposeSemitones; // C2 = 36 (MIDI note)
    return 440 * Math.pow(2, (midi - 69) / 12); // 440Hz = A4 = 69 (heheh 69... nice)
}

// KEY PRESS 
function synthNoteOn(keyIndex, velocity = 1) {
    const freq = freqFromKeyIndex(keyIndex);

    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = "triangle";
    osc.frequency.value = freq;

    const now = audio.currentTime;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(velocity, now + 0.01);

    osc.connect(gain).connect(mainGain);
    osc.start(now);

    activeNotes.set(keyIndex, { osc, gain });
}

// KEY RELEASE 
function synthNoteOff(keyIndex) {
    const voice = activeNotes.get(keyIndex);
    if (!voice) return;

    const now = audio.currentTime;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 1);

    voice.osc.stop(now + 1.01);

    activeNotes.delete(keyIndex);
}