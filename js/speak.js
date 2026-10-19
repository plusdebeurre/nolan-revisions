/**
 * Browser speech for Listen buttons. No audio files.
 * NolanSpeak.speak(text, lang) uses speechSynthesis.
 * If no matching voice is installed, speak() still tries the lang
 * and NolanSpeak.available(lang) is false so the game can say so.
 */
(function (global) {
  var warned = {};

  function voices() {
    if (!global.speechSynthesis || !global.speechSynthesis.getVoices) return [];
    return global.speechSynthesis.getVoices() || [];
  }

  function match(lang) {
    var want = String(lang || '').toLowerCase();
    var list = voices();
    var i;
    for (i = 0; i < list.length; i++) {
      if (String(list[i].lang || '').toLowerCase() === want) return list[i];
    }
    var prefix = want.split('-')[0];
    for (i = 0; i < list.length; i++) {
      if (String(list[i].lang || '').toLowerCase().indexOf(prefix) === 0) return list[i];
    }
    return null;
  }

  function available(lang) {
    return !!match(lang);
  }

  function missingNote(lang) {
    var name = lang === 'th-TH' ? 'Thai' : lang === 'fr-FR' ? 'French' : 'English';
    return 'No ' + name + ' voice on this device. You can still read and answer.';
  }

  function speak(text, lang) {
    if (!global.speechSynthesis || !text) return false;
    var synth = global.speechSynthesis;
    synth.cancel();
    var utter = new SpeechSynthesisUtterance(String(text));
    utter.lang = lang || 'en-US';
    utter.rate = lang === 'th-TH' ? 0.85 : 0.95;
    var voice = match(utter.lang);
    if (voice) utter.voice = voice;
    synth.speak(utter);
    return !!voice;
  }

  function stop() {
    if (global.speechSynthesis) global.speechSynthesis.cancel();
  }

  if (global.speechSynthesis && global.speechSynthesis.addEventListener) {
    global.speechSynthesis.addEventListener('voiceschanged', function () { warned = {}; });
  }

  global.NolanSpeak = {
    speak: speak,
    stop: stop,
    available: available,
    missingNote: missingNote,
    warned: warned
  };
})(window);
