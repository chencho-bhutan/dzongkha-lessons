// Shared sound effects for Learn Dzongkha exercises, synthesized with the
// Web Audio API (no audio files needed). Include this before any game script
// that references DzongkhaSounds.

var DzongkhaSounds = (function () {
  let ctx;
  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function isMuted() {
    return localStorage.getItem("dzongkha_sound_muted") === "1";
  }

  function setMuted(muted) {
    localStorage.setItem("dzongkha_sound_muted", muted ? "1" : "0");
  }

  function playSingleClap(startTime, freqBase) {
    const c = getCtx();
    const duration = 0.07;
    const bufferSize = Math.floor(c.sampleRate * duration);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Sharp, fast-decaying envelope — a real clap is a very brief broadband snap.
      const decay = Math.pow(1 - i / bufferSize, 5);
      data[i] = (Math.random() * 2 - 1) * decay;
    }
    const noise = c.createBufferSource();
    noise.buffer = buffer;

    const bandpass = c.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = freqBase;
    bandpass.Q.value = 1.1;

    const highpass = c.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 900;

    const gain = c.createGain();
    gain.gain.setValueAtTime(1, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    noise.connect(bandpass).connect(highpass).connect(gain).connect(c.destination);
    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  function playCorrect() {
    if (isMuted()) return;
    const c = getCtx();
    const now = c.currentTime;
    // Two or three near-simultaneous claps read as a single crisp "clap" rather than a beep.
    playSingleClap(now, 1800);
    playSingleClap(now + 0.012, 2600);
    playSingleClap(now + 0.02, 2100);
  }

  function playWrong() {
    if (isMuted()) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(180, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, c.currentTime + 0.25);
    gain.gain.setValueAtTime(0.12, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.25);
  }

  function playComplete() {
    if (isMuted()) return;
    const c = getCtx();
    let t = c.currentTime;
    // A short round of applause: several claps at slightly randomized intervals.
    for (let i = 0; i < 7; i++) {
      playSingleClap(t, 1600 + Math.random() * 1600);
      t += 0.08 + Math.random() * 0.07;
    }
  }

  return { playCorrect, playWrong, playComplete, isMuted, setMuted };
})();
