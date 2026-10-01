// Small progressive-enhancement script: theme toggle + mobile menu. The site works without it.
(function () {
  var root = document.documentElement;

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var saved = safeGet('theme');
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  var themeBtn = document.getElementById('theme-btn');
  function paintBtn() {
    if (!themeBtn) return;
    themeBtn.textContent = isDark() ? '☀' : '☾';
    themeBtn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  }
  if (themeBtn) {
    paintBtn();
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      safeSet('theme', next);
      paintBtn();
    });
  }

  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('primary-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Copy-email button: uses the clipboard when allowed, otherwise selects the text so it can be copied by hand.
  var copyBtn = document.getElementById('copy-email');
  var emailEl = document.getElementById('email-text');
  if (copyBtn && emailEl) {
    var original = copyBtn.textContent;
    function selectEmail() {
      try {
        var r = document.createRange(); r.selectNodeContents(emailEl);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      } catch (e) {}
    }
    function flash(msg) {
      copyBtn.textContent = msg;
      setTimeout(function () { copyBtn.textContent = original; }, 2200);
    }
    copyBtn.addEventListener('click', function () {
      var text = emailEl.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { flash('Copied'); }, function () { selectEmail(); flash('Press Ctrl/Cmd+C'); });
      } else { selectEmail(); flash('Press Ctrl/Cmd+C'); }
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
