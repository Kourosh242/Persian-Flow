// Persian Flow v1.4.0 — popup
// کلیدهای ذخیره‌سازی با نسخه‌های قبلی یکی است تا تنظیمات کاربر حفظ شود.
// v1.2.0: دید انتخاب فونت داخل همان پاپ‌آپ (بدون تب جدید) + لیبل داینامیک.
(function () {
  "use strict";

  var toggleRTL    = document.getElementById("toggle-rtl");
  var toggleFont   = document.getElementById("toggle-font");
  var toggleDigits = document.getElementById("toggle-digits"); // v1.4.0: فارسی‌سازی اعداد

  /* ═══ v1.2.0: انتخاب فونت از رجیستری مشترک (pf-fonts.js) ═══ */
  var FONTS = (window.PF_FONTS && window.PF_FONTS.length) ? window.PF_FONTS : [];
  var fontById = window.PF_FONT_BY_ID || function (id) {
    for (var i = 0; i < FONTS.length; i++) if (FONTS[i].id === id) return FONTS[i];
    return FONTS[0];
  };
  var FONT_STORAGE_KEY = "pfFontFamily";
  var FONT_DEFAULT_ID = FONTS.length ? FONTS[0].id : "vazirmatn";

  var viewMain   = document.getElementById("view-main");
  var viewFonts  = document.getElementById("view-fonts");
  var gear       = document.getElementById("gear");
  var backbtn    = document.getElementById("backbtn");
  var fontList   = document.getElementById("font-list");
  var fontLabel  = document.getElementById("font-label-name");

  var currentFontId = FONT_DEFAULT_ID;
  var previewInjected = false;
  var rowsBuilt = false;

  // فونت‌های پیش‌نمایش فقط هنگام ورود به دید فونت‌ها لود می‌شوند
  // (پاپ‌آپ باید لحظه‌ای باز شود). آدرس نسبی در صفحات خودِ اکستنشن مجاز است.
  function ensurePreviewFaces() {
    if (previewInjected) return;
    previewInjected = true;
    try {
      var css = "";
      for (var i = 0; i < FONTS.length; i++) {
        var f = FONTS[i];
        css += "@font-face{font-family:'" + f.family + "';font-style:normal;"
          + "font-weight:" + f.faces[0].weight + ";font-display:swap;"
          + "src:url('fonts/" + f.faces[0].file + "') format('woff2');}";
      }
      var s = document.createElement("style");
      s.textContent = css;
      document.head.appendChild(s);
    } catch (e) {}
  }

  function buildRows() {
    if (rowsBuilt) return;
    rowsBuilt = true;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < FONTS.length; i++) {
      (function (f) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "font-row";
        btn.setAttribute("data-id", f.id);
        btn.setAttribute("role", "option");

        var dot = document.createElement("span");
        dot.className = "fdot";

        var main = document.createElement("span");
        main.className = "fmain";

        var name = document.createElement("span");
        name.className = "fname";
        name.textContent = f.faName;
        if (f.isDefault) {
          var def = document.createElement("em");
          def.className = "fdef";
          def.textContent = "پیش‌فرض";
          name.appendChild(def);
        }

        var sample = document.createElement("span");
        sample.className = "fsample";
        sample.textContent = "سلام کاربر! نوشته ۱۲۳۴۵۶۷۸۹۰ Salam";
        sample.style.fontFamily = "'" + f.family + "', 'Vazirmatn', Tahoma, sans-serif";

        main.appendChild(name);
        main.appendChild(sample);
        btn.appendChild(dot);
        btn.appendChild(main);

        btn.addEventListener("click", function () { selectFont(f.id); });
        frag.appendChild(btn);
      })(FONTS[i]);
    }
    fontList.appendChild(frag);
  }

  function markActiveRow() {
    try {
      var rows = fontList.querySelectorAll(".font-row");
      for (var i = 0; i < rows.length; i++) {
        var active = rows[i].getAttribute("data-id") === currentFontId;
        rows[i].classList.toggle("active", active);
        rows[i].setAttribute("aria-selected", active ? "true" : "false");
      }
    } catch (e) {}
  }

  function updateMainLabel() {
    try {
      var f = fontById(currentFontId);
      if (fontLabel && f) fontLabel.textContent = f.faName;
    } catch (e) {}
  }

  function selectFont(id) {
    var f = fontById(id);
    currentFontId = f.id;
    markActiveRow();
    updateMainLabel();
    // انتخاب فونت = اعمالِ فونت با همان یک کلیک: اگر تاگل خاموش بود خودکار
    // روشن می‌شود (گزارشِ کاربر: «برای اعمال فونت باید دوبار بزنم»).
    chrome.storage.sync.set({ pfFontFamily: currentFontId, fontEnabled: true });
    if (toggleFont) toggleFont.checked = true;
  }

  function openFontsView() {
    buildRows();
    ensurePreviewFaces();
    markActiveRow();
    viewMain.hidden = true;
    viewFonts.hidden = false;
  }

  function closeFontsView() {
    viewFonts.hidden = true;
    viewMain.hidden = false;
  }

  if (gear) gear.addEventListener("click", openFontsView);
  if (backbtn) backbtn.addEventListener("click", closeFontsView);

  /* ═══ خواندن تنظیمات ═══ */
  var def = { rtlEnabled: true, fontEnabled: true, pfDigits: false };
  def[FONT_STORAGE_KEY] = FONT_DEFAULT_ID;
  chrome.storage.sync.get(def, function (prefs) {
    toggleRTL.checked  = !!prefs.rtlEnabled;
    toggleFont.checked = !!prefs.fontEnabled;
    toggleDigits.checked = !!prefs.pfDigits;
    currentFontId = fontById(prefs[FONT_STORAGE_KEY]).id;
    updateMainLabel();
    markActiveRow();
  });

  toggleRTL.addEventListener("change", function () {
    chrome.storage.sync.set({ rtlEnabled: toggleRTL.checked });
  });

  toggleFont.addEventListener("change", function () {
    chrome.storage.sync.set({ fontEnabled: toggleFont.checked });
  });

  toggleDigits.addEventListener("change", function () {
    chrome.storage.sync.set({ pfDigits: toggleDigits.checked });
  });

  // همگام‌سازی وقتی جای دیگری (تب/پاپ‌آپ دوم) تنظیمات را عوض کند —
  // FIX-X (v1.4.0): قبلاً فقط فونت همگام می‌شد و هر سه تاگل کهنه می‌ماندند
  try {
    chrome.storage.onChanged.addListener(function (changes) {
      if (changes[FONT_STORAGE_KEY] !== undefined) {
        currentFontId = fontById(changes[FONT_STORAGE_KEY].newValue).id;
        updateMainLabel();
        markActiveRow();
      }
      if (changes.rtlEnabled  !== undefined) toggleRTL.checked    = !!changes.rtlEnabled.newValue;
      if (changes.fontEnabled !== undefined) toggleFont.checked   = !!changes.fontEnabled.newValue;
      if (changes.pfDigits    !== undefined) toggleDigits.checked = !!changes.pfDigits.newValue;
    });
  } catch (e) {}

  /* ── بررسی آپدیت از ریلیزهای گیت‌هاب ─────────────────────────
     تگ آخرین ریلیز عمومی با نسخه‌ی فعلی مقایسه می‌شود؛ اگر بزرگ‌تر
     بود پیام «آپدیت جدید» با لینک همان ریلیز نمایان می‌شود.
     نتیجه ۶ ساعت در storage.local کش می‌شود (سهمیه‌ی API بدون توکن
     ۶۰ درخواست در ساعت است) و چون فقط با باز شدن پاپ‌آپ اجرا
     می‌گردد، مصرف شبکه ناچیز است. خطاها بی‌صدا نادیده گرفته
     می‌شوند تا تجربه‌ی کاربر مخدوش نشود.                        */
  var RELEASES_API = "https://api.github.com/repos/Kourosh242/Persian-Flow/releases/latest";
  var RELEASES_URL = "https://github.com/Kourosh242/Persian-Flow/releases/latest";
  var CACHE_KEY = "pfLatestRelease";
  var CACHE_TTL_MS = 6 * 60 * 60 * 1000; // ۶ ساعت

  function parseVersion(tag) {
    return String(tag).trim().replace(/^v/i, "").split(".").map(function (n) {
      return parseInt(n, 10) || 0;
    });
  }

  function isNewer(latestTag, current) {
    var a = parseVersion(latestTag), b = parseVersion(current);
    var len = Math.max(a.length, b.length);
    for (var i = 0; i < len; i++) {
      var x = a[i] || 0, y = b[i] || 0;
      if (x > y) return true;
      if (x < y) return false;
    }
    return false;
  }

  function showUpdate(tag, url) {
    var row = document.getElementById("update-row");
    var text = document.getElementById("update-text");
    if (!row || !text) return;
    text.textContent = "🔔 نسخه‌ی جدید " + parseVersion(tag).join(".") + " منتشر شده — برای دانلود کلیک کنید";
    row.href = url || RELEASES_URL;
    row.hidden = false;

    // نشان فوری کنار شماره‌ی نسخه در هدر پاپ‌آپ (کلیک → صفحه‌ی ریلیز)
    var badge = document.getElementById("version-badge");
    var hint = document.getElementById("version-hint");
    var stat = document.getElementById("version-static");
    if (badge && hint) {
      hint.textContent = "نسخه‌ی جدید ↑"; // FIX-O: کوتاه تا هدر همیشه جا شود
      badge.href = url || RELEASES_URL;
      badge.hidden = false;
      if (stat) stat.hidden = true;
    }
  }

  function checkTag(tag, url) {
    var current = chrome.runtime.getManifest().version;
    if (isNewer(tag, current)) showUpdate(tag, url);
  }

  function fetchLatestRelease() {
    fetch(RELEASES_API)
      .then(function (res) {
        if (!res.ok) throw new Error("release status " + res.status);
        return res.json();
      })
      .then(function (data) {
        var next = { tag: data.tag_name, url: data.html_url, at: Date.now() };
        chrome.storage.local.set({ pfLatestRelease: next });
        checkTag(next.tag, next.url);
      })
      .catch(function () { /* آفلاین یا سهمیه پر شده — بی‌صدا رد می‌شویم */ });
  }

  chrome.storage.local.get({ pfLatestRelease: null }, function (cache) {
    var c = cache.pfLatestRelease;
    if (c && c.tag && (Date.now() - c.at) < CACHE_TTL_MS) {
      checkTag(c.tag, c.url); // کش تازه — بدون درخواست شبکه
      return;
    }
    fetchLatestRelease();
  });
})();
