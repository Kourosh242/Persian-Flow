/* ============================================================
   Persian Flow v1.1.0 — RTL + فونت وزیرمتن برای محتوای فارسی
   ------------------------------------------------------------
   نسخه‌ی رفع باگ (همه از بررسی کل سورس):
   FIX-A (تاگل‌ها به هم گره خورده بودند): با تغییر هر تاگل قبلاً
     کل صفحه strip و دوباره اسکن می‌شد؛ در صفحات سنگین (>۳۰۰هزار
     کاراکتر) اسکن کامل کلاً اجرا نمی‌شد و همه‌چیز پاک می‌ماند.
     حالا «فهرست المان‌های علامت‌خورده» نگه داشته می‌شود و تغییر
     تنظیمات فقط همان‌ها را بازارزیابی می‌کند — فوری، حتی در
     صفحات غول‌پیکر، و بدون ریلود.
   FIX-B (متن فارسیِ همراه لاتین RTL نمی‌شد): تشخیص هایبرید —
     شروعِ فارسی همیشه RTL است (مثل plaintext) و شروعِ لاتین هم
     اگر سهم حروف فارسی از ۰٫۳۵ رد شود RTL می‌شود (رفع هر دو باگ
     «فارسی+لاتین» و «شروع با کلمه‌ی لاتین اما متن فارسی»).
   FIX-C (گره‌های گمشده در استریم): پردازش بیشتر از FLUSH_CAP در
     هر فریم قبلاً دور ریخته می‌شد؛ حالا پشتِ صف بعدی برمی‌گردد.
   FIX-D (پاپ‌آپ): فونت رابط پاپ‌آپ هم وزیرمتن شد.
   FIX-E (پیام‌های خردشده): حباب‌های flex که پیام را به چند span
     تقسیم می‌کنند (الگوی ری‌اکت) حالا یکسره mark می‌شوند تا پاراگراف
     یکپارچه بماند و جزیره‌های RTL به‌هم نریزند — همان باگی که در
     arena.ai پرانتز/کوتیشن را جابه‌جا می‌کرد. آواتار/img این Modal را
     غیرفعال می‌کند تا لی‌آوت سایت سالم بماند.
   FIX-F (علامت‌های کهنه بعد از تغییر ساختار): اگر کانتینرِ مارک‌شده
     بعداً ساختارش عوض شود (ری‌اکت آواتار/بلوک داخلی تزریق کند یا فرزند
     کم/زیاد کند)، کلاس‌های flex/dir روی آن می‌ماندند چون کشِ justify
     هرگز بی‌اعتبار نمی‌شد و والدِ مارک‌دار در موتاسیون‌های افزودن
     فرزند به صف نمی‌رفت. همچنین رشد متن از سقف ۳۰۰۰ کاراکتر، بدون
     پاک‌سازی علائم return می‌شد. حالا کش بی‌اعتبار می‌شود و علائم
     کهنه در هر دو حالت پاک می‌گردند.
   بهینه‌سازی‌ها (سیستم‌های ضعیف): تحلیل تک‌پاس بدون regex، کشِ
     امضای متن، حذف اجداد تکراری صف، اسکن دوره‌ای فقط وقتی صفحه
     کثیف است، تب پنهان هیچ کاری نمی‌کند، تاگل فوری و بدون هنگ.
   ============================================================ */
(function () {
  "use strict";

  /* ─────────────── ثابت‌ها ─────────────── */

  var RTL_CLASS      = "__pf-rtl__";
  var FONT_CLASS     = "__pf-font__";
  var RTLFLEX_CLASS  = "__pf-rtlflex__";
  var RTLFLEXEND_CLASS = "__pf-rtlflexend__";
  var DIR_MARK       = "data-pf-dir";

  var MAX_CONTAINER_TEXT = 3000;   // کانتینر بزرگ‌تر از این = چیدمان، نه پیام
  var MAX_PAGE_TEXT      = 300000; // صفحات غول‌پیکر: فقط روی موتاسیون‌ها تکیه کن
  var SCAN_NODE_CAP      = 4000;   // سقف گره‌متنی در هر اسکن
  var FIELD_CAP          = 300;    // سقف فیلدهای بررسی‌شده در هر اسکن
  var FLUSH_CAP          = 150;    // سقف پردازش در هر فریمِ موتاسیون
  var SCAN_INTERVAL      = 4000;   // میلی‌ثانیه
  var SHADOW_DISCOVER_MS = 8000;   // حداقل فاصله‌ی کشف idle
  var SHADOW_DISCOVER_CAP = 2500;  // المان

  var NO = { fa: false, dominant: false };

  /* ─────────────── مجموعه‌های تگ ─────────────── */

  var SKIP = new Set([
    "SCRIPT","STYLE","NOSCRIPT","TEMPLATE","IFRAME","OBJECT","EMBED",
    "CODE","PRE","KBD","SAMP","SVG","CANVAS","VIDEO","AUDIO","MAP",
    "HEAD","META","LINK","TITLE","BASE","SELECT","OPTGROUP","OPTION",
    "BR","HR","IMG","TEXTAREA"
  ]);

  var STOP = new Set([
    "HTML","BODY","MAIN","NAV","ASIDE","HEADER","FOOTER","ARTICLE",
    "SECTION","FORM","FIELDSET","TABLE","THEAD","TBODY","TFOOT","TR",
    "UL","OL","DL","MENU","DIALOG"
  ]);

  var INLINE = new Set([
    "SPAN","A","B","I","STRONG","EM","MARK","SMALL","ABBR","CITE","Q",
    "TIME","U","S","DEL","INS","SUB","SUP","TT","DFN","DATA","RUBY",
    "RT","RP","BDO","BDI","WBR","FONT","NOBR","BIG","STRIKE"
  ]);

  // سلکتورهای بلوکیِ متنی وقتی display نامشخص است
  var BLOCK_TAG_RE = /^(P|LI|TD|TH|DT|DD|H\d|BLOCKQUOTE|FIGCAPTION|CAPTION|LABEL|LEGEND|SUMMARY|BUTTON|DIV|ADDRESS|OUTPUT)$/;

  var FLEX_KINDS = new Set([
    "flex","inline-flex","grid","inline-grid",
    "table","table-row","table-row-group","table-header-group","table-footer-group","table-column","table-column-group"
  ]);

  var OK_INPUT_TYPES = new Set(["text","search","url","tel","email","password"]);

  /* ─────────────── وضعیت ─────────────── */

  var RTL_ENABLED  = true;
  var FONT_ENABLED = true;

  var displayCache = new WeakMap(); // el → "block" | "flex" | "inline" ...
  var sigCache     = new WeakMap(); // el → {sig, fa, dominant}
  var savedDirs    = new WeakMap(); // el → مقدار dir اصلی سایت
  var shadowRoots  = new Set();
  var styledShadows = new WeakSet();
  var marked       = new Set();  // FIX-A: هر المانی که کلاس/dir گرفته — برای بازارزیابی فوری تاگل‌ها

  /* ─────────────── استایل و فونت تزریقی ───────────────
     دلیل مهمِ تزریق فونت با JS:
     آدرس نسبیِ فونت داخل styles.css تزریق‌شده از مانیفست، نسبت به
     URL خود صفحه resolve می‌شود (نه اکستنشن!) و فونت ۴۰۴ می‌شود —
     دقیقاً همان باگی که باعث می‌شد وزیرمتن اعمال نشود.
     پس @font-face را با آدرس مطلق chrome-extension:// تزریق می‌کنیم؛
     کلاس‌ها همچنان از مانیفست می‌آیند (سریع و مصون از CSP). */

  var FONT_FILE = "Vazirmatn-Variable.woff2";

  function fontBase() {
    try { return chrome.runtime.getURL("fonts/"); } catch (e) { return ""; }
  }

  function fontFaceCSS(base) {
    return "@font-face{font-family:'Vazirmatn';font-style:normal;"
      + "font-weight:100 900;font-display:swap;"
      + "src:url('" + base + FONT_FILE + "') format('woff2');}";
  }

  // همان قوانین styles.css برای محیط‌هایی که مانیفست نمی‌رسد (shadow root)
  function rulesCSS() {
    return "." + RTL_CLASS + "{unicode-bidi:plaintext!important;text-align:right!important}"
      + "." + RTL_CLASS + " pre," + "." + RTL_CLASS + " code{text-align:left!important}"
      + "." + RTLFLEX_CLASS + "{direction:rtl!important;text-align:right!important}"
      + "." + RTLFLEXEND_CLASS + "{direction:rtl!important;text-align:right!important;justify-content:flex-start!important}"
      + "." + FONT_CLASS + "," + "." + FONT_CLASS + " *{"
      + "font-family:'Vazirmatn','Vazir',Tahoma,'Segoe UI',sans-serif,"
      + "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji'!important;}";
  }

  // تزریق stylesheet به document یا shadowRoot؛ adoptedStyleSheets مصون از style-src صفحه است
  function addSheet(target, cssText, isDoc) {
    try {
      if (typeof CSSStyleSheet !== "undefined") {
        var sheet = new CSSStyleSheet();
        sheet.replaceSync(cssText);
        if (isDoc && "adoptedStyleSheets" in document) {
          document.adoptedStyleSheets = document.adoptedStyleSheets.concat([sheet]);
          return true;
        }
        if (!isDoc && "adoptedStyleSheets" in target) {
          target.adoptedStyleSheets = target.adoptedStyleSheets.concat([sheet]);
          return true;
        }
      }
    } catch (e) {}
    try {
      var doc = isDoc ? document : (target.ownerDocument || document);
      var style = doc.createElement("style");
      style.setAttribute("data-pf", "");
      style.textContent = cssText;
      if (isDoc) (doc.head || doc.documentElement || doc).appendChild(style);
      else target.appendChild(style);
      return true;
    } catch (e) { return false; }
  }

  // تزریق فونتِ سند اصلی (فقط یک‌بار، در همان document_start)
  var injectedFont = false;
  function injectFontFace() {
    if (injectedFont) return;
    try { if (addSheet(document, fontFaceCSS(fontBase()), true)) injectedFont = true; }
    catch (e) {}
  }

  function styleShadowRoot(sr) {
    if (styledShadows.has(sr)) return;
    styledShadows.add(sr);
    var css = fontFaceCSS(fontBase()) + rulesCSS();
    addSheet(sr, css, false);
  }

  /* ─────────────── تحلیل display (با کش) ─────────────── */

  function displayOf(el) {
    var d = displayCache.get(el);
    if (d === undefined) {
      d = "";
      try {
        var win = el.ownerDocument.defaultView;
        if (el.isConnected !== false && win && win.getComputedStyle) {
          var cs = win.getComputedStyle(el);
          d = cs ? cs.display || "" : "";
        }
      } catch (e) { d = ""; }
      displayCache.set(el, d);
    }
    return d;
  }

  // آیا این المان «بلوکِ متنی» قابل علامت‌گذاری است؟
  function isTextBlock(el) {
    var tag = el.tagName;
    if (!tag || SKIP.has(tag) || STOP.has(tag)) return false;
    if (INLINE.has(tag)) return false;
    if (tag === "INPUT") return false;
    var d = displayOf(el);
    if (FLEX_KINDS.has(d)) {
      // بدون فرزند المنت = متنِ خام داخل flex (امن، مثل block)
      if (el.childElementCount === 0) return true;
      // FIX-E v2: فرگمنت‌های متنی inline → کانتینر یکسره بلوکِ متنی است
      return isFlexFragText(el);
    }
    if (!d) return BLOCK_TAG_RE.test(tag);
    if (d === "inline" || d.indexOf("ruby") === 0) return false;
    return true;
  }

  // FIX-E v2: کانتینر flex/grid که همه‌ی فرزندانش فرگمنتِ متنیِ inline‌اند.
  // این الگو «پیامِ خردشده به span» در ری‌اکت است (نه منوی سایت!)
  // - هر فرزندی غیر‑inline (آواتار، دکمه، svg، div) → رد
  // - کانتینری که همه‌ی بچه‌هایش لینک (<a>) است = نوبار/منو → رد
  function isFlexFragText(el) {
    var ch = el.children;
    var n = ch ? ch.length : 0;
    if (n < 2 || n > 60) return false;
    var d = displayOf(el);
    if (d.indexOf("flex") === -1 && d.indexOf("grid") === -1) return false;
    var links = 0;
    for (var i = 0; i < n; i++) {
      var tg = ch[i].tagName;
      if (!tg) return false;
      if (tg === "A") { links++; continue; }
      if (!INLINE.has(tg) && tg !== "BR") return false;
    }
    if (links === n) return false; // همه لینک = منو
    return true;
  }

  // نوع کلاسِ flex: اگر سایت خودش justify:*-end داشته، برای حفظ لنگر بصری
  // با تعویض جهت، justify را به flex-start جبران می‌کنیم.
  function flexFragKind(el) {
    if (!isFlexFragText(el)) return 0;
    try {
      var jc = "";
      var win = el.ownerDocument.defaultView;
      if (win && win.getComputedStyle) {
        var cs = win.getComputedStyle(el);
        jc = cs ? (cs.justifyContent || "") : "";
      }
      if (/end$/i.test(jc)) return 2;
    } catch (e) {}
    return 1;
  }

  // بلاک‌های بزرگِ چیدمانی را رد کن تا «کل سایت» راست‌چین نشود
  function isEligibleBlock(el) {
    var kids = el.childElementCount;
    if (!kids) return true;
    if (isFlexFragText(el)) return true; // فرگمنت‌های متنی: سقف متن در applyEl چک می‌شود
    if (kids > 14) return false;
    if (kids > 4) {
      try {
        var t = el.textContent;
        if (t && t.length > 1200) return false;
      } catch (e) {}
    }
    return true;
  }

  // ادیتور contenteditable (ریشه، نه فرزندان داخلش)
  function editableRoot(el) {
    try {
      if (!el || !el.tagName) return false;
      var own = el.getAttribute && el.getAttribute("contenteditable");
      var ownEditable = own !== null && String(own).toLowerCase() !== "false";
      if (!el.isContentEditable && !ownEditable) return false;
      if (!el.closest) return ownEditable;
      var host = el.closest("[contenteditable]");
      return host === el || (ownEditable && !host);
    } catch (e) { return false; }
  }

  function editableAncestor(node) {
    var el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    var depth = 0;
    while (el && depth < 10) {
      if (editableRoot(el)) return el;
      el = el.parentElement;
      depth++;
    }
    return null;
  }

  /* ─────────────── یافتن کانتینر ───────────────
     اول نزدیک‌ترین بلوکِ واجد شرایط؛ اگر پیدا نشد (مثلاً داخل
     flex با spanها)، به نزدیک‌ترین المان inline برمی‌گردیم تا
     حداقل جهت و فونتِ خودِ متن درست شود — روی inlineها جهت‌گذاری
     لی‌آوت صفحه را نمی‌شکند. */

  function getContainer(textNode) {
    var el = textNode.parentElement;
    var inlineFallback = null;
    var depth = 0;
    while (el && depth < 14) {
      var tag = el.tagName;
      if (!tag) return inlineFallback;
      if (SKIP.has(tag) || STOP.has(tag)) break;
      if (editableRoot(el)) return null; // ادیتور جداگانه مدیریت می‌شود
      if (!inlineFallback && INLINE.has(tag)) inlineFallback = el;
      if (isTextBlock(el) && isEligibleBlock(el)) return el;
      el = el.parentElement;
      depth++;
    }
    return inlineFallback;
  }

  /* ─────────────── تشخیص فارسی (تک‌پاس، بدون regex) ─────────────── */

  function analyze(t) {
    if (!t) return NO;
    var n = t.length;
    if (!n) return NO;
    var fa = 0, la = 0, first = 0; // first: 0=هیچ 1=فارسی 2=لاتین
    for (var i = 0; i < n; i++) {
      var c = t.charCodeAt(i);
      // ایموجی‌ها و کاراکترهای surrogate: خنثی، رد شو
      if (c >= 0xD800 && c <= 0xDBFF) { i++; continue; }
      if (c >= 0x0600 && c <= 0x06FF || c >= 0x0750 && c <= 0x077F ||
          c >= 0x08A0 && c <= 0x08FF || c >= 0xFB50 && c <= 0xFDFF ||
          c >= 0xFE70 && c <= 0xFEFF) {
        fa++; if (!first) first = 1;
      } else if ((c >= 0x41 && c <= 0x5A) || (c >= 0x61 && c <= 0x7A) ||
                 (c >= 0xC0 && c <= 0x24F)) {
        la++; if (!first) first = 2;
      }
    }
    if (!fa) return NO;
    // FIX-B (تکمیل‌شده): تشخیص هوشمند دومرحله‌ای — نه صرفاً اولین حرف!
    //   الف) شروع فارسی → همیشه RTL (مثل plaintext؛ حتی با لاتینِ زیاد در میان)
    //   ب) شروع لاتین ولی سهم حروف فارسی ≥ ۰٫۳۵ → RTL
    //      (مثل «apt دانلودش نشد، بذار وضعیت npm رو چک کنم» که غالباً
    //      فارسی است و با قانونِ فقط-اولین-حرف اشتباهی LTR می‌شد.)
    var total = fa + la;
    var ratio = total ? fa / total : 1;
    var dominant = (first === 1) || ratio >= 0.35;
    return { fa: true, dominant: dominant };
  }

  // امضای ارزان متن برای کش؛ متن‌های کوتاه کامل، بلندها نمونه‌برداری
  function textSig(t) {
    var n = t.length;
    var h = n;
    var step = n > 600 ? (n / 64) | 0 : 1;
    for (var i = 0; i < n; i += step) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0;
    return h;
  }

  /* ─────────────── اعمال کلاس‌ها ─────────────── */

  var jcCache = new WeakMap(); // کش justifyContent برای flexFragKind

  function flexFragKindCached(el) {
    var k = jcCache.get(el);
    if (k === undefined) {
      k = flexFragKind(el);
      jcCache.set(el, k);
    }
    return k;
  }

  function applyClasses(el, fa, dominant) {
    try {
      var wantRtl = !!(RTL_ENABLED && fa && dominant);
      var kind = wantRtl ? flexFragKindCached(el) : 0;
      // کانتینر flex با فرگمنت‌های inline: plaintext کافی نیست — ظرفِ فلکس
      // هر span را جدا پاراگراف می‌بیند. با direction روی ظرف، ترتیب بصری
      // فرگمنت‌ها معکوس می‌شود. برای *-endها هم لنگر راست جبران می‌گردد.
      el.classList.toggle(RTL_CLASS,        wantRtl && kind === 0);
      el.classList.toggle(RTLFLEX_CLASS,    wantRtl && kind === 1);
      el.classList.toggle(RTLFLEXEND_CLASS, wantRtl && kind === 2);
      el.classList.toggle(FONT_CLASS, !!(FONT_ENABLED && fa));
      // FIX-A: اگر هنوز نشانه‌ای روی المان هست ثبتش کن، وگرنه از فهرست خارجش کن
      if (el.classList.contains(RTL_CLASS) || el.classList.contains(FONT_CLASS)
          || el.classList.contains(RTLFLEX_CLASS) || el.classList.contains(RTLFLEXEND_CLASS)) marked.add(el);
      else if (!el.hasAttribute || !el.hasAttribute(DIR_MARK)) marked.delete(el);
    } catch (e) {}
  }

  // پاکسازی کامل علائم از یک المان (کلاس‌ها + dir + کش‌ها + فهرست)
  function clearEl(el) {
    sigCache.delete(el);
    jcCache.delete(el);
    try {
      el.classList.remove(RTL_CLASS);
      el.classList.remove(FONT_CLASS);
      el.classList.remove(RTLFLEX_CLASS);
      el.classList.remove(RTLFLEXEND_CLASS);
    } catch (e) {}
    try {
      if (el.hasAttribute && el.hasAttribute(DIR_MARK)) restoreDir(el);
    } catch (e) {}
    marked.delete(el);
  }

  function applyEl(el) {
    if (!el || !el.tagName) return;
    var tag = el.tagName;
    if (SKIP.has(tag) || STOP.has(tag)) return;
    if (tag === "INPUT" || tag === "TEXTAREA" || editableRoot(el)) {
      applyField(el);
      return;
    }
    var t;
    try { t = el.textContent || ""; } catch (e) { return; }
    if (!t) {
      sigCache.delete(el);
      applyClasses(el, false, false);
      return;
    }
    // FIX-F: عبور از سقف باید علائم کهنه را بشوید — قبلاً return خشک بود
    if (t.length > MAX_CONTAINER_TEXT) { clearEl(el); return; }

    var sig = textSig(t);
    var cached = sigCache.get(el);
    var r;
    if (cached && cached.sig === sig) {
      r = cached; // متن عوض نشده؛ تحلیل دوباره لازم نیست
    } else {
      r = analyze(t);
      sigCache.set(el, { sig: sig, fa: r.fa, dominant: r.dominant });
    }
    applyClasses(el, r.fa, r.dominant);
  }

  /* ─────────────── فیلدها: input / textarea / contenteditable ─────────────── */

  function restoreDir(el) {
    if (!savedDirs.has(el)) return;
    var orig = savedDirs.get(el);
    savedDirs.delete(el);
    try {
      if (orig === null || orig === undefined) el.removeAttribute("dir");
      else el.setAttribute("dir", orig);
      el.removeAttribute(DIR_MARK);
    } catch (e) {}
  }

  function applyField(el) {
    if (!el || !el.tagName) return;
    var tag = el.tagName;
    if (tag === "INPUT") {
      var type = (el.getAttribute("type") || "text").toLowerCase();
      if (!OK_INPUT_TYPES.has(type)) return;
    }
    var t;
    try {
      t = (tag === "INPUT" || tag === "TEXTAREA") ? (el.value || "") : (el.textContent || "");
    } catch (e) { return; }
    if (t.length > MAX_CONTAINER_TEXT) return;
    var r = t ? analyze(t) : NO;

    try { el.classList.toggle(FONT_CLASS, !!(FONT_ENABLED && r.fa)); } catch (e) {}

    // dir=auto بومی: هنگام تایپ فارسی خودش راست‌چین می‌شود،
    // انگلیسی چپ‌چین می‌ماند، و مقدار اصلی سایت بازگردانده می‌شود.
    if (RTL_ENABLED && r.fa) {
      if (!savedDirs.has(el)) savedDirs.set(el, el.getAttribute("dir"));
      try {
        if (el.getAttribute("dir") !== "auto") el.setAttribute("dir", "auto");
        el.setAttribute(DIR_MARK, "");
      } catch (e) {}
    } else {
      restoreDir(el);
    }
    // FIX-A: فیلد هم در فهرست علامت‌خورده‌ها نگه داشته شود
    try {
      if (el.classList.contains(FONT_CLASS) || el.hasAttribute(DIR_MARK)) marked.add(el);
      else marked.delete(el);
    } catch (e) {}
  }

  /* ─────────────── اسکن ─────────────── */

  function acceptNode(node) {
    var p = node.parentElement;
    if (!p) return NodeFilter.FILTER_REJECT;
    if (SKIP.has(p.tagName)) return NodeFilter.FILTER_REJECT;
    if (!node.nodeValue.trim()) return NodeFilter.FILTER_SKIP;
    return NodeFilter.FILTER_ACCEPT;
  }

  function scanRoot(root) {
    if (!root) return;
    var doc = root.ownerDocument || document;

    if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE) styleShadowRoot(root);

    var walker;
    try {
      walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: acceptNode });
    } catch (e) { return; }

    var seen = new Set();
    var n, count = 0;
    while ((n = walker.nextNode())) {
      var c = getContainer(n);
      if (c && !seen.has(c)) {
        seen.add(c);
        applyEl(c);
      }
      if (++count > SCAN_NODE_CAP) break;
    }

    // فیلدها و ادیتورها (محدود و ارزان)
    try {
      if (root.querySelectorAll) {
        var fields = root.querySelectorAll("input,textarea,[contenteditable]");
        for (var i = 0; i < fields.length && i < FIELD_CAP; i++) applyField(fields[i]);
      }
    } catch (e) {}
  }

  /* ─────────────── Shadow DOM ─────────────── */

  function attachShadow(sr) {
    if (!sr || shadowRoots.has(sr)) return;
    shadowRoots.add(sr);
    styleShadowRoot(sr);
    try {
      observer.observe(sr, { childList: true, subtree: true, characterData: true });
      sr.addEventListener("input", inputHandler, true);
    } catch (e) {}
    scanRoot(sr);
  }

  var lastShadowDiscover = 0;
  function discoverShadows(force) {
    if (!force) {
      var now = Date.now();
      if (now - lastShadowDiscover < SHADOW_DISCOVER_MS) return;
      lastShadowDiscover = now;
    }
    try {
      var els = document.querySelectorAll("*");
      var limit = Math.min(els.length, SHADOW_DISCOVER_CAP);
      for (var i = 0; i < limit; i++) {
        if (els[i].shadowRoot) attachShadow(els[i].shadowRoot);
      }
    } catch (e) {}
  }

  // «پروب» سبک: وقتی المانی (مخصوصاً وب‌کامپوننت) به صفحه اضافه می‌شود،
  // معمولاً خیلی زود shadow root می‌سازد → کشف را با دی‌بانس کوتاه اجرا کن.
  var probeTimer = null;
  function scheduleShadowProbe() {
    if (probeTimer) return;
    probeTimer = setTimeout(function () {
      probeTimer = null;
      discoverShadows(true);
    }, 1500);
  }

  /* ─────────────── تمیزکاری سراسری ─────────────── */

  function stripRoot(root) {
    try {
      // یک پاس واحد روی DOM به‌جای سه پاس (رفع هنگ هنگام تاگل)
      var els = root.querySelectorAll("." + RTL_CLASS + ",." + FONT_CLASS + ",." + RTLFLEX_CLASS + ",." + RTLFLEXEND_CLASS + ",[" + DIR_MARK + "]");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        el.classList.remove(RTL_CLASS);
        el.classList.remove(FONT_CLASS);
        el.classList.remove(RTLFLEX_CLASS);
        el.classList.remove(RTLFLEXEND_CLASS);
        if (el.hasAttribute(DIR_MARK)) restoreDir(el);
      }
    } catch (e) {}
  }

  function scanAll() {
    if (!document.body) return;
    var total;
    try { total = (document.body.textContent || "").length; } catch (e) { total = 0; }
    if (total < MAX_PAGE_TEXT) scanRoot(document.body);

    // هرس شییدوهای مرده و اسکن زنده‌ها (حداکثر ۱۰ ریشه در هر نوبت)
    var live = [];
    shadowRoots.forEach(function (sr) {
      if (!sr.host || !sr.host.isConnected) shadowRoots.delete(sr);
      else live.push(sr);
    });
    for (var i = 0; i < live.length && i < 10; i++) scanRoot(live[i]);

    // هرَس فهرست علامت‌خورده‌ها (سقف‌دار تا ارزان بماند)
    var pruned = 0;
    marked.forEach(function (el) {
      if (++pruned > 5000) return;
      try { if (!el.isConnected) marked.delete(el); } catch (e) {}
    });

    discoverShadows();
  }

  // FIX-A: فقط المان‌هایی که پیش‌تر علامت گرفته‌اند بازارزیابی می‌شوند.
  // سریع، مستقل از بزرگی صفحه، و far هم mergeن نگه می‌دارد دو تاگل را:
  // هر المان با وضعیتِ فعلیِ هر دو پرچم دوباره کلاس می‌گیرد — حذف یکی
  // دیگری را نمی‌پرانَد.
  function reapplyMarked() {
    if (marked.size === 0) return;
    var i = 0;
    marked.forEach(function (el) {
      if (++i > 5000) return; // سقف امنیت: بقیه در تیک بعدی هرَس می‌شوند
      try {
        if (!el.isConnected) { marked.delete(el); return; }
        applyEl(el);
      } catch (e) {}
    });
  }

  function applyAll() {
    if (!document.body) return;
    reapplyMarked();
    scanAll();
  }

  function hasAnyMark(el) {
    try {
      var cl = el.classList;
      return !!(cl && (cl.contains(RTL_CLASS) || cl.contains(FONT_CLASS)
        || cl.contains(RTLFLEX_CLASS) || cl.contains(RTLFLEXEND_CLASS)))
        || (el.hasAttribute && el.hasAttribute(DIR_MARK));
    } catch (e) { return false; }
  }

  /* ─────────────── MutationObserver (بهینه) ─────────────── */

  var queue = [];
  var flying = false;
  var flushTimer = null;
  var dirty = false;

  var inputHandler = function (e) {
    var t = e.target;
    if (!t || t.nodeType !== Node.ELEMENT_NODE) return;
    var tag = t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") { applyField(t); return; }
    var ed = editableAncestor(t);
    if (ed) applyField(ed);
  };

  function processNode(node) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.isConnected === false) return;
      var c = getContainer(node);
      if (c) applyEl(c);
      else {
        var ed = editableAncestor(node);
        if (ed) applyField(ed);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.isConnected === false) return;
      var tag = node.tagName;
      if (!tag || SKIP.has(tag)) return;
      if (tag === "INPUT" || tag === "TEXTAREA" || editableRoot(node)) {
        applyField(node);
        return;
      }
      // FIX-F: ساختار ممکن است عوض شده باشد → کش justify بی‌اعتبار شود
      jcCache.delete(node);
      // اگر خودِ المان بلاکِ متنی است فقط خودش؛ وگرنه علائم کهنه را بشو
      // و زیردرختش را دوباره ارزیابی کن
      if (isTextBlock(node) && isEligibleBlock(node)) {
        applyEl(node);
      } else {
        if (hasAnyMark(node)) clearEl(node);
        scanRoot(node);
      }
    }
  }

  function schedule() {
    if (!queue.length || flying) return;
    flying = true;
    if (typeof requestAnimationFrame !== "undefined") requestAnimationFrame(flush);
    flushTimer = setTimeout(function () { if (flying) flush(); }, 350);
  }

  function flush() {
    if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
    flying = false;
    if (!queue.length) return;

    // حذف گره‌هایی که جدشان هم در صف است (پوشش تکراری)
    var qset = new Set(queue);
    var out = [];
    for (var qi = 0; qi < queue.length; qi++) {
      var node = queue[qi];
      var anc = node.nodeType === Node.TEXT_NODE ? node.parentElement : node.parentElement;
      var hops = 0, covered = false;
      while (anc && hops < 20) {
        if (qset.has(anc)) { covered = true; break; }
        anc = anc.parentElement;
        hops++;
      }
      if (!covered) out.push(node);
    }
    queue = [];

    var done = 0;
    for (var i = 0; i < out.length && done < FLUSH_CAP; i++) {
      try { processNode(out[i]); } catch (e) {}
      done++;
    }
    // FIX-C: باقیمانده را برای فریم بعدی نگه دار — قبلاً بی‌صدا گم می‌شد!
    if (done < out.length) {
      queue = out.slice(done);
      schedule();
    }
  }

  var observer;
  try {
    observer = new MutationObserver(function (mutations) {
      dirty = true;
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === "characterData") {
          queue.push(m.target);
        } else {
          var added = m.addedNodes;
          for (var j = 0; j < added.length; j++) {
            var an = added[j];
            if (an.nodeType === Node.ELEMENT_NODE) {
              queue.push(an);
              // وب‌کامپوننت تازه‌نصب‌شده؟ shadow را سریع کشف کن
              if (an.shadowRoot) attachShadow(an.shadowRoot);
              else if (an.tagName && an.tagName.indexOf("-") !== -1) scheduleShadowProbe();
            } else if (an.nodeType === Node.TEXT_NODE) {
              queue.push(an);
            }
          }
          // حذف/جایگزینی: والد را دوباره ارزیابی کن (فقط اگر بلاک است)
          if (m.removedNodes.length && m.target && m.target.nodeType === Node.ELEMENT_NODE)
            queue.push(m.target);
          // FIX-F: افزودن فرزند به «والدِ مارک‌دار» هم ساختار را عوض می‌کند؛
          // والد به صف برود تا کش justify بی‌اعتبار شود و علائم کهنه پاک شوند
          else if (added.length && m.target && m.target.nodeType === Node.ELEMENT_NODE
                   && hasAnyMark(m.target))
            queue.push(m.target);
        }
      }
      if (queue.length > 2000) queue.length = 2000; // سیل‌ها: اسکن دوره‌ای جبران می‌کند
      schedule();
    });
  } catch (e) { observer = null; }

  /* ─────────────── اسکن دوره‌ای سبک ─────────────── */

  var interval = null;
  function startInterval() {
    if (interval) return;
    interval = setInterval(function () {
      if (document.hidden) return;
      if (dirty) {
        dirty = false;
        scanAll();
      } else {
        discoverShadows(); // داخلی throttled است
      }
    }, SCAN_INTERVAL);
  }

  try {
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (interval) { clearInterval(interval); interval = null; }
      } else {
        dirty = true;
        startInterval();
      }
    });
  } catch (e) {}

  /* ─────────────── تنظیمات ─────────────── */

  function readPrefs(cb) {
    try {
      chrome.storage.sync.get({ rtlEnabled: true, fontEnabled: true }, function (prefs) {
        RTL_ENABLED  = !!prefs.rtlEnabled;
        FONT_ENABLED = !!prefs.fontEnabled;
        cb();
      });
    } catch (e) { cb(); }
  }

  // FIX-A: تاگل باید فوری باشد — بازارزیابی فهرست علامت‌خورده‌ها یک
  // پیمایش کوچک است، پس بدون requestIdleCallback و بدون strip سراسری.
  // دی‌بانس کوتاه تا تاگل‌های پشت‌سرهم یک‌بار اعمال شوند.
  var applyTimer = null;
  function scheduleApplyAll() {
    if (applyTimer) clearTimeout(applyTimer);
    applyTimer = setTimeout(function () {
      applyTimer = null;
      try { applyAll(); } catch (e) {}
    }, 60);
  }

  try {
    chrome.storage.onChanged.addListener(function (changes) {
      if (changes.rtlEnabled  !== undefined) RTL_ENABLED  = !!changes.rtlEnabled.newValue;
      if (changes.fontEnabled !== undefined) FONT_ENABLED = !!changes.fontEnabled.newValue;
      scheduleApplyAll();
    });
  } catch (e) {}

  /* ─────────────── بوت ─────────────── */

  function boot() {
    injectFontFace();
    try { document.addEventListener("input", inputHandler, true); } catch (e) {}
    try {
      if (observer && (document.documentElement || document)) {
        observer.observe(document.documentElement || document, {
          childList: true, subtree: true, characterData: true
        });
      }
    } catch (e) {}

    if (document.body) {
      // اسکن اولیه را کمی به‌تأخیر بینداز تا رندر صفحه قفل نشود
      setTimeout(scanAll, 150);
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        setTimeout(scanAll, 0);
      }, { once: true });
    }
    startInterval();
  }

  readPrefs(boot);

})();
