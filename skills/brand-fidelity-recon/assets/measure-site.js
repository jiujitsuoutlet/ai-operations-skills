/**
 * Brand recon payload. Paste as the browser tool's script body, on the live
 * site, once at a mobile width and once at a desktop width.
 *
 * Wrapped in an IIFE on purpose: repeated tool calls share one global scope,
 * so bare `const` declarations throw "Identifier already declared" on the
 * second run.
 */
(function () {
  var out = {};
  var cs = getComputedStyle(document.body);
  out.viewport = innerWidth;
  out.body = { bg: cs.backgroundColor, color: cs.color, font: cs.fontFamily, size: cs.fontSize };

  // ---- palette by frequency, so the real brand colors sort to the top
  var counts = {};
  document.querySelectorAll('*').forEach(function (el) {
    var s = getComputedStyle(el);
    [s.backgroundColor, s.color].forEach(function (c) {
      if (c && c !== 'rgba(0, 0, 0, 0)') counts[c] = (counts[c] || 0) + 1;
    });
  });
  out.palette = Object.entries(counts).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 14);

  // ---- the accent, and whether there is more than one of it
  var accents = new Set();
  document.querySelectorAll('*').forEach(function (el) {
    var s = getComputedStyle(el);
    [s.color, s.backgroundColor, s.borderTopColor].forEach(function (v) {
      if (/^rgba?\((1[0-9]{2}|2[0-5][0-9]), ([0-9]{1,2}), ([0-9]{1,2})/.test(v)) accents.add(v);
    });
  });
  out.warmAccents = [...accents];

  // ---- type scale
  function type(sel) {
    var e = document.querySelector(sel);
    if (!e) return null;
    var s = getComputedStyle(e);
    return {
      text: (e.textContent || '').trim().slice(0, 40),
      size: s.fontSize, weight: s.fontWeight, tracking: s.letterSpacing,
      leading: s.lineHeight, transform: s.textTransform, color: s.color,
      vw: (parseFloat(s.fontSize) / innerWidth * 100).toFixed(2) + 'vw',
      html: e.innerHTML.slice(0, 200)
    };
  }
  out.type = { h1: type('h1'), h2: type('h2'), h3: type('h3'), p: type('p') };

  // ---- buttons: gradient, radius, padding, and whether a shadow exists
  out.buttons = [].slice.call(document.querySelectorAll('a,button')).filter(function (e) {
    var s = getComputedStyle(e);
    return s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.backgroundImage.indexOf('gradient') > -1;
  }).slice(0, 4).map(function (e) {
    var s = getComputedStyle(e);
    return {
      text: e.textContent.trim().slice(0, 28), bg: s.backgroundColor,
      gradient: s.backgroundImage.slice(0, 110), radius: s.borderRadius,
      pad: s.padding, weight: s.fontWeight, size: s.fontSize,
      tracking: s.letterSpacing, transform: s.textTransform,
      shadow: s.boxShadow === 'none' ? 'NONE' : s.boxShadow.slice(0, 70)
    };
  });

  // ---- structural devices: clip paths, transforms, small-caps labels
  out.clipPaths = [].slice.call(document.querySelectorAll('*')).filter(function (e) {
    return getComputedStyle(e).clipPath !== 'none';
  }).slice(0, 6).map(function (e) {
    var s = getComputedStyle(e);
    return { clip: s.clipPath, bg: s.backgroundColor, cls: (e.className || '').toString().slice(0, 60) };
  });

  out.transforms = [].slice.call(document.querySelectorAll('*')).filter(function (e) {
    var t = getComputedStyle(e).transform;
    return t && t !== 'none' && !/^matrix\(1, 0, 0, 1/.test(t);
  }).slice(0, 6).map(function (e) {
    return { transform: getComputedStyle(e).transform, cls: (e.className || '').toString().slice(0, 60) };
  });

  out.microLabels = [].slice.call(document.querySelectorAll('p,span,h3,div')).filter(function (e) {
    var s = getComputedStyle(e);
    return s.textTransform === 'uppercase' && parseFloat(s.letterSpacing) >= 1.5 &&
           parseFloat(s.fontSize) <= 14 && e.textContent.trim().length < 30;
  }).slice(0, 8).map(function (e) {
    var s = getComputedStyle(e);
    return {
      text: e.textContent.trim().slice(0, 24), color: s.color, bg: s.backgroundColor,
      size: s.fontSize, weight: s.fontWeight, tracking: s.letterSpacing, radius: s.borderRadius
    };
  });

  // ---- cards: radius, padding, border, shadow
  out.cards = [].slice.call(document.querySelectorAll('div,section,article')).filter(function (e) {
    var s = getComputedStyle(e), r = e.getBoundingClientRect();
    return parseFloat(s.borderRadius) >= 8 && r.height > 80 && r.width < 600;
  }).slice(0, 4).map(function (e) {
    var s = getComputedStyle(e);
    return { radius: s.borderRadius, pad: s.padding, bg: s.backgroundColor, border: s.border, shadow: s.boxShadow.slice(0, 50) };
  });

  return JSON.stringify(out, null, 1);
})()
