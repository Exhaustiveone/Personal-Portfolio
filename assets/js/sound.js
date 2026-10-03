/* ==========================================================================
   SOUND ENGINE
   Every sound on the site is synthesised live with the Web Audio API.
   No audio files to load.
   ========================================================================== */
(function () {
  const S = {
    ctx: null,
    master: null,
    ambBus: null,
    sfx: null,
    on: false,
    started: false
  };

  function ctx() {
    if (!S.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      S.ctx = new AC();
      S.master = S.ctx.createGain();
      S.master.gain.value = 0;
      const comp = S.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      S.master.connect(comp).connect(S.ctx.destination);
      S.sfx = S.ctx.createGain();
      S.sfx.gain.value = 0.9;
      S.sfx.connect(S.master);
      S.ambBus = S.ctx.createGain();
      S.ambBus.gain.value = 0;
      S.ambBus.connect(S.master);
      S.reverb = makeReverb(2.8);
      S.reverb.connect(S.master);
    }
    return S.ctx;
  }

  function noiseBuffer(sec, type) {
    const c = S.ctx;
    const len = Math.floor(c.sampleRate * sec);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (type === "brown") {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      } else d[i] = w;
    }
    return buf;
  }

  function makeReverb(sec) {
    const c = S.ctx;
    const conv = c.createConvolver();
    const len = c.sampleRate * sec;
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    conv.buffer = buf;
    const g = c.createGain();
    g.gain.value = 0.35;
    conv.connect(g);
    // expose input as conv, output as g
    g.input = conv;
    return Object.assign(g, { input: conv });
  }

  function send(node, amt) {
    const g = S.ctx.createGain();
    g.gain.value = amt;
    node.connect(g).connect(S.reverb.input);
  }

  function env(g, t, a, peak, d) {
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  /* ---------- one-shots ---------- */
  const fx = {
    beep(freq = 1000) {
      const c = S.ctx, t = c.currentTime;
      const o = c.createOscillator();
      o.frequency.value = freq;
      const g = c.createGain();
      o.connect(g).connect(S.sfx);
      env(g, t, 0.005, 0.25, 0.11);
      o.start(t);
      o.stop(t + 0.2);
    },
    tick(freq = 2400, vol = 0.06) {
      const c = S.ctx, t = c.currentTime;
      const o = c.createOscillator();
      o.type = "triangle";
      o.frequency.setValueAtTime(freq, t);
      o.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.05);
      const g = c.createGain();
      o.connect(g).connect(S.sfx);
      env(g, t, 0.002, vol, 0.06);
      o.start(t);
      o.stop(t + 0.1);
    },
    projector(dur = 3) {
      const c = S.ctx, t = c.currentTime;
      const src = c.createBufferSource();
      src.buffer = noiseBuffer(0.02, "white");
      // 24 clicks per second for the length of the leader
      const g = c.createGain();
      g.gain.value = 0.0001;
      const hp = c.createBiquadFilter();
      hp.type = "bandpass";
      hp.frequency.value = 2200;
      hp.Q.value = 1.4;
      g.connect(hp).connect(S.sfx);
      for (let i = 0; i < dur * 24; i++) {
        const s = c.createBufferSource();
        s.buffer = src.buffer;
        const sg = c.createGain();
        sg.gain.value = 0.12 + Math.random() * 0.06;
        s.connect(sg).connect(hp);
        s.start(t + i / 24);
      }
    },
    whoosh(dur = 0.7, up = true) {
      const c = S.ctx, t = c.currentTime;
      const n = c.createBufferSource();
      n.buffer = noiseBuffer(dur + 0.1, "white");
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 2.2;
      bp.frequency.setValueAtTime(up ? 250 : 3200, t);
      bp.frequency.exponentialRampToValueAtTime(up ? 3200 : 250, t + dur);
      const g = c.createGain();
      n.connect(bp).connect(g).connect(S.sfx);
      send(g, 0.4);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.35, t + dur * 0.6);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      n.start(t);
      n.stop(t + dur + 0.1);
    },
    braam() {
      const c = S.ctx, t = c.currentTime;
      const shaper = c.createWaveShaper();
      const k = 40, curve = new Float32Array(1024);
      for (let i = 0; i < 1024; i++) {
        const x = (i * 2) / 1024 - 1;
        curve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
      }
      shaper.curve = curve;
      const lp = c.createBiquadFilter();
      lp.type = "lowpass";
      lp.Q.value = 3;
      lp.frequency.setValueAtTime(120, t);
      lp.frequency.exponentialRampToValueAtTime(1400, t + 0.35);
      lp.frequency.exponentialRampToValueAtTime(140, t + 3.2);
      const g = c.createGain();
      shaper.connect(lp).connect(g).connect(S.sfx);
      send(g, 0.9);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.9, t + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
      [41.2, 41.6, 82.4, 61.7].forEach((f) => {
        const o = c.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = f;
        o.connect(shaper);
        o.start(t);
        o.stop(t + 3.8);
      });
      // sub hit
      const sub = c.createOscillator();
      sub.frequency.setValueAtTime(90, t);
      sub.frequency.exponentialRampToValueAtTime(32, t + 0.8);
      const sg = c.createGain();
      sub.connect(sg).connect(S.sfx);
      env(sg, t, 0.01, 0.9, 1.4);
      sub.start(t);
      sub.stop(t + 1.6);
    },
    damru() {
      // two-headed hand drum: quick pitch-dropping hits in a rolling pattern
      const c = S.ctx, t0 = c.currentTime;
      const pattern = [0, 0.11, 0.22, 0.29, 0.36, 0.55, 0.62, 0.69];
      pattern.forEach((dt, i) => {
        const t = t0 + dt;
        const o = c.createOscillator();
        const base = i % 2 ? 210 : 165;
        o.frequency.setValueAtTime(base * 1.8, t);
        o.frequency.exponentialRampToValueAtTime(base, t + 0.04);
        const g = c.createGain();
        o.connect(g).connect(S.sfx);
        send(g, 0.5);
        env(g, t, 0.002, i === 5 ? 0.7 : 0.45, 0.14);
        o.start(t);
        o.stop(t + 0.2);
        // skin slap
        const n = c.createBufferSource();
        n.buffer = noiseBuffer(0.05, "white");
        const hp = c.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 1800;
        const ng = c.createGain();
        n.connect(hp).connect(ng).connect(S.sfx);
        env(ng, t, 0.001, 0.18, 0.03);
        n.start(t);
      });
      // low drum under the last hit
      const k = c.createOscillator();
      const kt = t0 + 0.55;
      k.frequency.setValueAtTime(110, kt);
      k.frequency.exponentialRampToValueAtTime(40, kt + 0.5);
      const kg = c.createGain();
      k.connect(kg).connect(S.sfx);
      env(kg, kt, 0.005, 1, 0.7);
      k.start(kt);
      k.stop(kt + 0.9);
    },
    shutter() {
      const c = S.ctx, t = c.currentTime;
      [0, 0.075].forEach((dt, i) => {
        const n = c.createBufferSource();
        n.buffer = noiseBuffer(0.04, "white");
        const bp = c.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = i ? 3800 : 2400;
        bp.Q.value = 0.9;
        const g = c.createGain();
        n.connect(bp).connect(g).connect(S.sfx);
        env(g, t + dt, 0.001, 0.5, 0.035);
        n.start(t + dt);
      });
    },
    clap() {
      // clapperboard: sharp wooden crack with a short body
      const c = S.ctx, t = c.currentTime;
      const n = c.createBufferSource();
      n.buffer = noiseBuffer(0.12, "white");
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1300;
      bp.Q.value = 1.6;
      const g = c.createGain();
      n.connect(bp).connect(g).connect(S.sfx);
      send(g, 0.6);
      env(g, t, 0.001, 1, 0.09);
      n.start(t);
      const o = c.createOscillator();
      o.frequency.setValueAtTime(420, t);
      o.frequency.exponentialRampToValueAtTime(160, t + 0.06);
      const og = c.createGain();
      o.connect(og).connect(S.sfx);
      env(og, t, 0.001, 0.5, 0.08);
      o.start(t);
      o.stop(t + 0.12);
    },
    flip(freq = 600) {
      const c = S.ctx, t = c.currentTime;
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, t);
      o.frequency.exponentialRampToValueAtTime(freq * 2, t + 0.12);
      const g = c.createGain();
      o.connect(g).connect(S.sfx);
      send(g, 0.6);
      env(g, t, 0.005, 0.16, 0.25);
      o.start(t);
      o.stop(t + 0.3);
    },
    chord(notes) {
      const c = S.ctx, t = c.currentTime;
      notes.forEach((f, i) => {
        const o = c.createOscillator();
        o.type = "triangle";
        o.frequency.value = f;
        const g = c.createGain();
        o.connect(g).connect(S.sfx);
        send(g, 0.8);
        env(g, t + i * 0.06, 0.01, 0.09, 1.6);
        o.start(t + i * 0.06);
        o.stop(t + 2);
      });
    }
  };

  const Sound = {
    get on() {
      return S.on;
    },
    enable() {
      const c = ctx();
      if (!c) return;
      if (c.state === "suspended") c.resume();
      // no background drone: only short effects play when you interact
      S.on = true;
      const t = c.currentTime;
      S.master.gain.cancelScheduledValues(t);
      S.master.gain.setTargetAtTime(0.9, t, 0.15);
      document.documentElement.classList.add("sound-on");
    },
    disable() {
      S.on = false;
      document.documentElement.classList.remove("sound-on");
      if (!S.ctx) return;
      S.master.gain.setTargetAtTime(0, S.ctx.currentTime, 0.12);
    },
    toggle() {
      S.on ? this.disable() : this.enable();
      return S.on;
    },
    play(name, ...args) {
      if (!S.on || !S.ctx || !fx[name]) return;
      try {
        fx[name](...args);
      } catch (e) {}
    }
  };

  window.Sound = Sound;
})();
