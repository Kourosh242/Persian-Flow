/* ============================================================
   Persian Flow — Background Service Worker (MV3)
   ------------------------------------------------------------
   بررسی خودکار وجود آپدیت:
     • هر بار که کروم بالا می‌آید (runtime.onStartup)
     • هنگام نصب/آپدیت اکستنشن (runtime.onInstalled) + ساخت آلارم
     • هر ۶ ساعت (chrome.alarms — مصون از خاموشی سرویس‌ورکر)
   اگر آپدیت وجود داشته باشد:
     • نشان «↑» طلایی روی آیکون اکستنشن (badge) می‌نشیند
     • یک نوتیفیکیشن اصلی کروم نمایش داده می‌شود (فقط یک‌بار به‌ازای
       هر تگ — با کلیک به صفحه‌ی ریلیز می‌رود)
     • وضعیت در storage.local کش می‌شود تا پاپ‌آپ بی‌درنگ و حتی
       آفلاین آن را نمایش دهد (نشان «نسخه‌ی جدید موجود است» کنار ورژن)
   اگر آپدیت نباشد هیچ‌چیز نشان داده نمی‌شود.
   شبکه: api.github.com اجازه‌ی CORS= * می‌دهد، پس fetch از
   سرویس‌ورکر بدون host_permission کار می‌کند. سهمیه‌ی سرویس:
   ۶۰ درخواست/ساعت بدون توکن — کش ۶ ساعته رعایت می‌شود.
   ============================================================ */
(function () {
  "use strict";

  var RELEASES_API  = "https://api.github.com/repos/Kourosh242/Persian-Flow/releases/latest";
  var RELEASES_PAGE = "https://github.com/Kourosh242/Persian-Flow/releases/latest";
  var CACHE_KEY     = "pfLatestRelease";   // { tag, url, at }
  var NOTIFIED_KEY  = "pfLastNotifiedTag"; // رشته‌ی آخرین تگی که نوتیف رفت
  var ALARM_NAME    = "pfUpdateCheck";
  var ALARM_PERIOD_MIN = 360; // ۶ ساعت

  /* نسخه‌ها را به قطعات عددی می‌شکافیم: "v1.10.2" → [1,10,2] */
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

  /* ── نشان روی آیکون ── */
  function showBadge(tag) {
    try {
      chrome.action.setBadgeText({ text: "↑" });
      chrome.action.setBadgeBackgroundColor({ color: "#ECA72C" });
      chrome.action.setBadgeTextColor({ color: "#fff" });
      chrome.action.setTitle({ title: "Persian Flow — نسخه‌ی جدید " + tag + " موجود است" });
    } catch (e) {}
  }

  function clearBadge() {
    try {
      chrome.action.setBadgeText({ text: "" });
      chrome.action.setTitle({ title: "Persian Flow" });
    } catch (e) {}
  }

  /* ── نوتیفیکیشن کروم: فقط یک بار به‌ازای هر تگ ── */
  function notifyOnce(tag, url) {
    chrome.storage.local.get({ pfLastNotifiedTag: null }, function (r) {
      if (r.pfLastNotifiedTag === tag) return;
      chrome.storage.local.set({ pfLastNotifiedTag: tag });
      try {
        chrome.notifications.create("pf-update", {
          type: "basic",
          iconUrl: "icons/icon128.png",
          title: "Persian Flow",
          message: "نسخه‌ی جدید " + parseVersion(tag).join(".") + " منتشر شده — برای دانلود کلیک کنید",
          priority: 1
        }, function () { /* هدلس/مجوز — بی‌صدا */ });
      } catch (e) {}
    });
  }

  /* ── بررسی مرکزی ── */
  function checkUpdate(reason) {
    return fetch(RELEASES_API, {
      headers: { "Accept": "application/vnd.github+json" }
    }).then(function (res) {
      if (!res.ok) return null; // سهمیه/خطای شبکه — بی‌صدا
      return res.json();
    }).then(function (data) {
      if (!data || !data.tag_name) return;
      var tag = data.tag_name;
      var url = data.html_url || RELEASES_PAGE;
      var entry = { tag: tag, url: url, at: Date.now(), reason: reason };
      chrome.storage.local.set({ pfLatestRelease: entry }, function () {
        var current = chrome.runtime.getManifest().version;
        if (isNewer(tag, current)) {
          showBadge(tag);
          notifyOnce(tag, url);
        } else {
          clearBadge();
        }
      });
    }).catch(function () { /* آفلاین — بی‌صدا */ });
  }

  /* ── رویدادها (فقط در محیط اکستنشن ثبت می‌شوند) ── */
  var isExtensionEnv = (typeof chrome !== "undefined") && chrome.runtime
    && chrome.runtime.onStartup && chrome.alarms;

  if (isExtensionEnv) {
    // ۱) با هر بار بالا آمدن کروم
    chrome.runtime.onStartup.addListener(function () { checkUpdate("startup"); });

    // ۲) هنگام نصب/آپدیت + ساخت آلارم دوره‌ای
    chrome.runtime.onInstalled.addListener(function () {
      checkUpdate("install");
      chrome.alarms.create(ALARM_NAME, { periodInMinutes: ALARM_PERIOD_MIN });
    });

    // ۳) آلارم دوره‌ای (سرویس‌ورکر را هم بیدار می‌کند)
    chrome.alarms.onAlarm.addListener(function (alarm) {
      if (alarm && alarm.name === ALARM_NAME) checkUpdate("alarm");
    });

    // ۴) کلیک روی نوتیفیکیشن → صفحه‌ی ریلیز
    if (chrome.notifications && chrome.notifications.onClicked) {
      chrome.notifications.onClicked.addListener(function (id) {
        chrome.storage.local.get({ pfLatestRelease: null }, function (r) {
          var url = (r.pfLatestRelease && r.pfLatestRelease.url) || RELEASES_PAGE;
          try { chrome.tabs.create({ url: url }); } catch (e) {}
          try { chrome.notifications.clear(id); } catch (e2) {}
        });
      });
    }
  } else if (typeof globalThis !== "undefined") {
    // حالت تست Node: فقط منطق خالص را در معرض می‌گذاریم
    globalThis.__pfBg = { parseVersion: parseVersion, isNewer: isNewer };
  }
})();
