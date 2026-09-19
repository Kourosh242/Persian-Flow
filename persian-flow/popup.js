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
})();
