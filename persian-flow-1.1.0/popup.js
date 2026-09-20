// Persian Flow v1 — popup
// کلیدهای ذخیره‌سازی با نسخه‌های قبلی یکی است تا تنظیمات کاربر حفظ شود.
(function () {
  "use strict";

  var toggleRTL  = document.getElementById("toggle-rtl");
  var toggleFont = document.getElementById("toggle-font");

  chrome.storage.sync.get({ rtlEnabled: true, fontEnabled: true }, function (prefs) {
    toggleRTL.checked  = !!prefs.rtlEnabled;
    toggleFont.checked = !!prefs.fontEnabled;
  });

  toggleRTL.addEventListener("change", function () {
    chrome.storage.sync.set({ rtlEnabled: toggleRTL.checked });
  });

  toggleFont.addEventListener("change", function () {
    chrome.storage.sync.set({ fontEnabled: toggleFont.checked });
  });

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
      hint.textContent = "نسخه جدید موجود است";
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
