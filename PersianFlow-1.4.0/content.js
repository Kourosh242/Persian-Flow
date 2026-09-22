/* ============================================================
   Persian Flow v1.4.0 — RTL + فونت فارسی (داینامیک) برای محتوا
   ------------------------------------------------------------
   v1.4.0 (فارسی‌سازی اعداد — DIGITS + سفت‌کاری RTL):
   ✦ FIX-P: ردیف‌های flex خردشده‌ی ری‌اکت که چیپ کد (code/kbd/samp)
     هم بین spanها دارند حالا شناسایی و یکدست می‌شوند — قبلاً رد می‌شدند
     و ترتیب کلمات خطوط چیپ‌دار چت (مثل گزارش‌های اسکرین‌شات‌شده‌ی
     کاربر: «کامیت b9afb33 + تگ v1.4.0…») به‌هم می‌ریخت؛ نرده‌ی
     «همه‌چیپ» نوار ابزار را حفظ می‌کند.
   ✦ FIX-Q: استریمِ روی گره‌متنِ فارسی‌سازی‌شده‌ی اعداد: فقط دمِ تازه
     به مبنای بازگردانی می‌چسبد — خاموشی تاگل حتی پس از رشدِ روی
     تبدیل، بایت‌به‌بایت به اصلِ لاتین برمی‌گردد.
   ✦ FIX-R: × و ÷ دیگر حرفِ لاتین حساب نمی‌شوند (bidi-neutral واقعی).
   ✦ FIX-T: گارد ۱۲۰۰کاراکتریِ «کانتینر شلوغ = چیدمان» برای بلوک‌های
     متنیِ رسمی (P/LI/TD/…) برداشته شد تا پاراگراف‌های بلندِ پیامی با
     بچه‌های inline زیاد هم قضاوت شوند (چیدمانِ واقعی محفوظ).
   ✦ FIX-U: ورژنِ شدو روتِ قوانین حالا دقیقاً معادل styles.css است —
     قانون مونواسپیسِ کد (FIX-N) و تراز چپِ کد به rulesCSS اضافه شد
     (<code> داخل شدو قبلاً فونت فارسی می‌گرفت) + boost مشابه :not().
   ✦ FIX-W: امضای کشِ متن تا ۴۰۰۰ کاراکتر کامل هش می‌شود (وابسته به
     نمونه‌برداری نیست) — ویرایشِ میان‌متن هم قضاوت را تازه می‌کند.
   ✦ FIX-X: تاگل‌های پاپ‌آپ حالا با تغییرِ تنظیمات از یک پاپ‌آپ/تبِ
     دیگر همگام می‌شوند (پیش‌تر فقط انتخابِ فونت sync می‌شد).
   ✦ FIX-Y: فرزندانِ داخل ادیتور contenteditable
     دیگر هرگز پردازش نمی‌شوند. قبلاً فقط «ریشه‌ی» ادیتور به applyField
     فرستاده می‌شد ولی فرزندانِ داخلش (پaragرف‌های ری‌اکت/ProseMirror)
     از مسیرِ کانتینرِ عادی قضاوت، علامت (dir/font) و فارسی‌سازی اعداد
     می‌گرفتند — نتیجه: هنگام تایپ، DOM به‌تدریج mutate می‌شد، کرسر
     می‌پرید و ارقامِ تازه «به پشت متن پرتاب» می‌شدند یا ری‌رندرِ
     فریم‌ورک تبدیل‌ها را می‌بلعید. حالا هر گره‌متنی که جدِ قابل‌ویرایش
     دارد از getContainer/applyEl/numConvert کاملاً رد می‌شود و فقط ریشه‌ی
     ادیتور dir=auto + فونت می‌گیرد (تایپ روان RTL با ارقامِ اصلیِ لاتین).
   ✦ FIX-Z: عمقِ محافظِ اعداد (numNodeOk) از ۶ به ۱۶ رسید و ردِ
     تگ/قابل‌ویرایش‌بودن «قبلِ» پذیرشِ stopAt ارزیابی می‌شود — اعدادِ
     تودرتویِ عمیقِ خروجی AI/مارک‌داون حالا تبدیل می‌شوند و محافظِ
     ادیتور هرگز بدون‌اثر نمی‌ماند.
   ✦ FIX-PR: فونتِ فعال بلافاصله پس از بوت و هنگام تعویض فونت با
     document.fonts.load پیش‌لود می‌شود — دیگر «اولِ ورود فونت دیر
     می‌نشیند» رخ نمی‌دهد (رندر با fallback به حداقل می‌رسد).
   ✦ FIX-NL:
     (الف) گاردِ متن‌محورِ «بیشتر از ۳۰۰۰ کاراکتر = چیدمان» حذف شد —
     پیامِ ۵هزارکاراکتریِ AI پیش‌تر علامتش پاک می‌شد (clearEl) و همین
     حس «چت که بلند می‌شود، RTL از کار می‌افتد» را می‌داد. قضاوت حالا
     ساختاری است (تعداد/نوع فرزند)، نه حجمی. (ب) analyze برای هیولاهای
     >۱۵۰هزار کاراکتری نمونه‌برداریِ آماری می‌کند (سه پنجره‌ی ثابت) —
     هنوز قضاوت می‌شوند، منتها ارزان. (ج) اسکنر تیکِ دوره‌ای به‌جای
     «پیمایشِ سراسری با سقف نود» یک مکان‌نمای پیمایش پایدار (cursor)
     با بودجه‌ی زمانی در هر تیک است — هیچ گره‌ای، در هیچ صفحه‌ای با هر
     اندازه‌ای، دیگر «برای همیشه جا نمی‌ماند»؛ فقط تدریجی می‌رسد.
     (د) بازارزیابیِ علامت‌خورده‌ها و تخلیه‌ی فیلدها/پرَس دیگر برش
     سخت ندارند — باقیمانده با بودجه‌ی زمانی کوتاه زنجیره‌ای تخلیه
     می‌شود تا آخر.
   ✦ تاگل سومِ پاپ‌آپ (پیش‌فرض خاموش): اعداد لاتینِ بلوک‌های
     متنیِ فارسی به‌صورت زنده به اعداد فارسی (۰۱۲۳۴۵۶۷۸۹) تبدیل
     می‌شوند — همیشه با فونتِ انتخابیِ کاربر رندر می‌شوند چون
     داخل قابِ کلاس خانواده‌ی فونت‌اند. محافظ‌ها: کد/<pre>/<code>،
     لینک/ایمیل (<a>)، فیلدها و ادیتورها و متن انگلیسی‌محور هرگز
     دست‌کاری نمی‌شوند. تبدیل idempotent است؛ متن اصلی هر گره
     در WeakMap نگه داشته می‌شود تا خاموشیِ تاگل بازگردانی دقیق
     انجام دهد (اعداد فارسیِ ذاتیِ متن حفظ می‌شوند).
   v1.3.0 (گزارش کاربر از چت طولانی کلود):
   ✦ FIX-K (سکونِ RTL روی پیام‌های انتهایی چت‌های طولانی): سه
     نقص مرکب — (الف) سرریز صف موتاسیون با «queue.length = CAP»
     گره‌های تازه (پیام‌های آخر چت!) را بی‌صدا دور می‌ریخت و
     قدیمی‌ها را نگه می‌داشت؛ (ب) اسکن جبرانیِ دوره‌ای با سقف
     ۸٬۰۰۰ گره‌متنی از ابتدای سند می‌شمرد و روی تخته‌های طولانی
     چت AI هرگز به انتهای سند نمی‌رسید؛ (پ) گارد ۶۰۰هزارکاراکتری
     scanAll روی صفحات خیلی بزرگ کل شبکه‌ی اطمینان را بی‌صدا
     خاموش می‌کرد. نتیجه: پاراگراف‌های جدید برای همیشه LTR.
     حالا: سرریز = خالی‌شدن کامل صف + پرچم sweep + اسکن جبرانیِ
     دی‌بانس‌شده‌ی ۲۵۰ms (هیچ گره‌تازه‌ای قربانی نمی‌شود)، سقف
     اسکن به ۵۰٬۰۰۰ گره و سقف کاراکتری به ۲٬۰۰۰٬۰۰۰ ارتقا یافت
     و sweep حتی فراتر از سقف کاراکتری هم پیمایش کران‌دار می‌کند
     (با کش sig ارزان است؛ کار هر پیمایش با سقف گره محدود است).

   v1.2.0 (انتخاب فونت + رفع گزارش‌های کاربر):
   ✦ FIX-G (فونت داینامیک ۱۵تایی): خانواده‌ی فونت دیگر هاردکد
     نیست. رجیستری مشترک pf-fonts.js منبع واحد است؛ کلید ذخیره‌ای
     pfFontFamily (پیش‌فرض vazirmatn) با storage.onChanged بی‌درنگ
     روی صفحه اعمال می‌شود — کلاس خانواده __pf-f-<id>__ روی المان
     عوض می‌شود و @font-face تزریقی (آدرس مطلق chrome-extension://
     که با آزمایش زنده ثابت شد زیر سخت‌ترین CSP هم لود می‌شود) با
     replaceSync روی همان stylesheet زنده بازسازی می‌گردد — بدون
     ریلود، بدون لود ۱۰ فایل دیگر (فقط فونت فعال لود می‌شود).
   ✦ FIX-H (به‌هم‌ریختن ترتیب کلمات در لیست و جدول — گزارش ۳ و ۴):
     علت ریشه‌ای: درون یک پاراگراف/سلول بعضی spanها RTL می‌گرفتند و
     بعضی نه، پس UBA بین جزیره‌های LTR/RTL ترتیب را قیل‌واقعه
     می‌کرد. راه حل: وقتی ریل‌ای یک بلوک متنی (LI/TD/BLOCKQUOTE/...)
     فارسیِ predominant RTL گرفت، کل آن بلوک نیز یکدست علامت‌گذاری
     می‌شود تا base direction کل پاراگراف یکجا rtl باشد (با محافظ
     nav/menu و رد بلاک‌های >۳۰۰۰ کاراکتر و parent-recognition).
   ✦ FIX-J (گم‌شدن پاراگراف هنگام استریم طولانی — گزارش ۱): صف
     موتاسیون با اضافه‌شدن هدف تکراریِ پی‌درپی (استریم مداوم روی
     همان گره متن) پر می‌شد و سقف ۲۰۰۰ گره‌های جدید را بی‌صدا
     حذف می‌کرد؛ صفحات >۳۰۰هزار کاراکتر هم اسکن دوره‌ای نداشتند.
     حالا: حذف dedupe‌ی consecutive برای همان target، در سرریز
     پرچم sweep فعال می‌شود و اسکن دوره‌ای جبران می‌کند، و سقف
     صفحه به ۶۰۰هزار کاراکتر ارتقا یافت (با سقف گره برای پرفورمنس).

   حلقه‌های v1.1.0 (کوتاه): FIX-A بازارزیابی فقط علامت‌خورده‌ها در
   تاگل؛ FIX-B تشخیص هایبرید فارسیِ غالب؛ FIX-C بقای گره‌های صف
   بعد از FLUSH_CAP؛ FIX-D فونت رابط پاپ‌آپ؛ FIX-E حباب‌های flex
   فرگمنت‌شده‌ی ری‌اکت؛ FIX-F بی‌اعتبارسازی کش justify و شستن علائم
   کهنه هنگام تغییر ساختار/عبور از سقف.

   بهینه‌سازی‌ها (سیستم‌های ضعیف): تحلیل تک‌پاس بدون regex، کشِ
   امضای متن، حذف اجداد تکراری صف، اسکن دوره‌ای فقط وقتی صفحه
   کثیف است، تب پنهان هیچ کاری نمی‌کند، تاگل فوری و بدون هنگ.
   ============================================================ */
(function () {
  "use strict";

  /* ─────────────── فونت‌ها: رجیستری مشترک (pf-fonts.js) ─────────────── */

  var ROOT = typeof globalThis !== "undefined" ? globalThis : window;
  var FONTS = (ROOT.PF_FONTS && ROOT.PF_FONTS.length) ? ROOT.PF_FONTS : [{
    id: "vazirmatn", faName: "وزیرمتن", family: "Vazirmatn",
    variable: true, isDefault: true,
    faces: [{ file: "Vazirmatn-Variable.woff2", weight: "100 900" }]
  }];
  var fontById = ROOT.PF_FONT_BY_ID || function (id) {
    for (var i = 0; i < FONTS.length; i++) if (FONTS[i].id === id) return FONTS[i];
    return FONTS[0];
  };
  var familyStack = ROOT.PF_FONT_FAMILY_STACK || function (f) {
    return "'" + f.family + "', 'Vazirmatn', Tahoma, 'Segoe UI', sans-serif,"
      + " 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji'";
  };
  var FONT_STORAGE_KEY = "pfFontFamily";
  var FONT_DEFAULT_ID = (FONTS[0] && FONTS[0].id) || "vazirmatn";
  var DIGITS_KEY     = "pfDigits";          // v1.4.0: فارسی‌سازی اعداد (پیش‌فرض خاموش)

  /* ─────────────── ثابت‌ها ─────────────── */

  var RTL_CLASS      = "__pf-rtl__";
  var FONT_CLASS     = "__pf-font__";
  var RTLFLEX_CLASS  = "__pf-rtlflex__";
  var RTLFLEXEND_CLASS = "__pf-rtlflexend__";
  // FIX-RD: خطِ فارسیِ «آغازِ لاتین» (مثل: README (…): سلام …)
  var RTLDIR_CLASS   = "__pf-rtldir__";
  var DIR_MARK       = "data-pf-dir";
  var FAM_ATTR       = "data-pf-fam";      // v1.2.0: کدام خانواده‌ی فونت فعال است
  var FAM_PREFIX     = "__pf-f-";

  // FIX-NL: سقفِ حجمیِ «بیشتر از X کاراکتر = چیدمان» و سقفِ
  // «بیشتر از Y نود در هر پیمایش» حذف شدند — قضاوت ساختاری است
  // (فرزندان/تگ‌ها)، نه حجمی؛ پیام با هر طولی پردازش می‌شود و پیمایش
  // به‌جای برش سخت، با مکان‌نمای پایدار + بودجه‌ی زمانی تدریجی تمام می‌شود.
  var ANALYZE_SAMPLE_MAX = 150000; // تا این اندازه تحلیل کامل؛ فراتر: پنجره‌ها
  var FIELD_CAP          = 1500;   // سقف فیلدها در هر نوبت (با بودجه‌ی زمانی)
  var FLUSH_CAP          = 150;    // سقف پردازش در هر فریمِ موتاسیون
  var QUEUE_CAP          = 2000;   // سقف صف حافظه؛ پشت سرش sweep جایگزین است
  var SCAN_INTERVAL      = 4000;   // میلی‌ثانیه
  var SHADOW_DISCOVER_MS = 8000;   // حداقل فاصله‌ی کشف idle
  var SHADOW_DISCOVER_CAP = 2500;  // المان
  var TICK_BUDGET_NODES  = 6000;   // گره‌ی متنِ پیمایش‌شده در هر تیک
  var TICK_BUDGET_MS     = 14;     // سقف زمانی هر تیک پیمایش (میلی‌ثانیه)
  var REAPPLY_BUDGET_MS  = 40;     // سقف زمانی بازارزیابی فوریِ علامت‌خورده‌ها

  var NO = { fa: false, dominant: false };

  /* ============================================================
     v1.4.0 (بازتولیدِ زنده روی گیت‌هاب — گزارشِ آینه‌شدن کل صفحه):
       FIX-CT: wrapper «تک‌فرزنده‌ی بلوکی» (زنجیره‌ی pass-through مثل
               div.application-main گیت‌هاب) چیدمان است نه متن — قبلاً
               علامت می‌گرفت و rtldir ارثی‌اش کل صفحه را آینه می‌کرد.
       FIX-SM: خوددرمانی علامت‌های کهنه در هر تیک — بلوکی که بدون
               موتاسیونِ DOM (عوض‌شدنِ کلاسِ CSS) دیگر متنی نیست، پاک می‌شود.
       FIX-ND: عمقِ تبدیل اعداد ۱۶→۲۴ (ریدمی‌های عمیق تودرتویدار).
       hasAnyMark حالا rtldir را هم می‌شمارد.
     v1.4.0 (ممیزیِ مجددِ خط‌به‌خطِ نهایی — همه‌ی فایل‌ها):
       FIX-CD: زیر بلوک‌های rtldir v1.4.0، چیپ/بلوک کد جهت rtl را
               به ارث می‌بُرد (قبلاً plaintext خودش LTR می‌کرد) — جهت
               کد با قانونِ مخصوص به ltr + isolate پین شد.
       FIX-FD: input/textarea/select داخل متنِ فارسیِ علامت‌خورده
               جهت را از پیرامون می‌گرفت — حالا unicode-bidi:
               plaintext را دارند (جهت از محتوای خود فیلد، مثل dir=auto).
       FIX-ED: محافظ ادیتور از عمق ۱۰ به ۲۴ (تودرتویِ عمیق ProseMirror
               فرار می‌کرد)؛ getContainer هم‌تراز شد.
       FIX-SR: selector ِ stripRoot حالا rtldir و data-pf-num را هم
               می‌شوید (رعایتِ بهداشتِ کد برای هر مصرفِ آینده).
     v1.4.0 (گزارشِ زنده‌ی کاربر پس از v1.4.0):
       FIX-RD: خطِ فارسیِ «آغازِ لاتین» (مثل README (…): سلام …) — با
               unicode-bidi: plaintext جهت از اولین نویسه‌ی قوی می‌آمد
               و چنین خطی LTR رندر می‌شد (اسکرین‌شات کاربر). حالا روی
               کانتینرهای غیر flex/grid/table کلاس __pf-rtldir__ با
               direction: rtl قطعی می‌نشیند؛ هر خطِ فارسی همیشه rtl است.
       FIX-KB: فارسی‌سازی اعداد «هنگام تایپ» — رقمی که کاربر می‌زند
               (ادیتور/اینپوت/تکست‌اریا) از خودِ خط‌لوله‌ی ویرایش فارسی
               درج می‌شود (بدون دست‌کاری DOM → سازگاری با فریم‌ورک‌ها).
               فیلدهای حساس (رمز/عدد/تلفن/…) و ادیتورهای کد مستثنا‌اند.
     v1.4.0 (ممیزی خط‌به‌خط + تعاملی — «شاهکار بدون باگ»):
     FIX-DC: کشِ display با TTL + بی‌اعتبارسازی — فریم‌ورک‌ها کانتینرها
       را hide/show می‌کنند و قبلاً display کهنه‌ی کش‌شده تا ابد
       حاکم می‌ماند.
     FIX-SC: «پاراگرافِ لباس‌پنهان» — div بلوکی با >۴ فرزندِ
       «همه‑inline» و متن بلند، قبلاً چیدمان رد می‌شد؛ حالا اگر
       همه‌ی بچه‌ها inline/br باشند پاراگراف حساب می‌شود.
     FIX-FC: فیلدها هم کشِ امضا دارند — تایپ در سندِ بزرگِ
       contenteditable دیگر هر ضربه‌ی کلید آنالیز کاملِ O(n)
       نمی‌کند (امضای یکسان → نتیجه‌ی یکسان).
     FIX-AA: applyAll با boost کامل — تاگلِ بلافاصله، حتی روی
       صفحه‌ای که مدتی خاموش بود، همان لحظه تمام سند را پوشش
       می‌دهد.
     FIX-LK: هرَسِ marked دیگر تکه‌تکه نیست (دمِ Set هرگز نمی‌رسید)
       — سیکل کامل در هر نوبت؛ نشت حافظه‌ی چت‌های بزرگ صفر.
     FIX-AR: شنونده‌ی storage فقط به ناحیه‌ی sync گوش می‌دهد —
       نوشته‌های ناحیه‌ی local (کشِ ریلیز) دیگر هیچ کاری را تحریک
       نمی‌کنند.
     ============================================================ */

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

  // FIX-H: بلوک‌های متنی که «یکدست» علامت می‌خورند تا ترتیب واژه‌ها
  // درونشان (به‌ویژه با spanهای خردشده‌ی ری‌اکت) هرگز قیل شود.
  var UNIFORM_TAGS = new Set([
    "P","LI","TD","TH","H1","H2","H3","H4","H5","H6",
    "BLOCKQUOTE","DT","DD","FIGCAPTION","CAPTION","SUMMARY"
  ]);

  // سلکتورهای بلوکیِ متنی وقتی display نامشخص است
  var BLOCK_TAG_RE = /^(P|LI|TD|TH|DT|DD|H\d|BLOCKQUOTE|FIGCAPTION|CAPTION|LABEL|LEGEND|SUMMARY|BUTTON|DIV|ADDRESS|OUTPUT)$/;

  var FLEX_KINDS = new Set([
    "flex","inline-flex","grid","inline-grid",
    "table","table-row","table-row-group","table-header-group","table-footer-group","table-column","table-column-group"
  ]);

  var OK_INPUT_TYPES = new Set(["text","search","url","tel","email","password"]);

  /* ─────────────── وضعیت ─────────────── */

  var RTL_ENABLED   = true;
  var FONT_ENABLED  = true;
  var CURRENT_FONT_ID = FONT_DEFAULT_ID;   // v1.2.0
  var DIGITS_ENABLED  = false;             // v1.4.0 (پیش‌فرض خاموش)

  var DISPLAY_CACHE_TTL = 6000;      // FIX-DC: میلی‌ثانیه اعتبار هر ورودی
  var displayCache = new WeakMap(); // el → { d, at } — display به‌علت hide/show فریم‌ورک‌ها عوض می‌شود
  var sigCache     = new WeakMap(); // el → {sig, fa, dominant}
  var savedDirs    = new WeakMap(); // el → مقدار dir اصلی سایت
  var shadowRoots  = new Set();
  var styledShadows = new WeakSet();
  var marked       = new Set();  // FIX-A: هر المانی که کلاس/dir گرفته — برای بازارزیابی فوری تاگل‌ها

  /* ─────────────── استایل و فونت تزریقی ───────────────
     دلیل مهمِ تزریق فونت با JS:
     آدرس نسبیِ فونت داخل styles.css تزریق‌شده از مانیفست، نسبت به
     URL خود صفحه resolve می‌شود (نه اکستنشن!) و فونت ۴۰۴ می‌شود —
     دقیقاً همان باگی که باعث می‌شد وزیرمتن اعمال نشود و با آزمایش
     زنده روی کروم ۱۴۸ اثبات شد. پس @font-face را با آدرس مطلق
     chrome-extension:// فقط برای «فونت فعال» تزریق می‌کنیم؛
     کلاس‌ها همچنان از مانیفست می‌آیند (سریع و مصون از CSP).
     v1.2.0: هندل‌های stylesheet ثبت می‌شوند تا هنگام عوض شدن
     فونت، همان sheet با replaceSync به‌روز شود — فوری و بدون ریلود. */

  function famClass(id) { return FAM_PREFIX + id + "__"; }

  function activeFont() { return fontById(CURRENT_FONT_ID); }

  function fontBase() {
    try { return chrome.runtime.getURL("fonts/"); } catch (e) { return ""; }
  }

  function fontFaceCSS(base) {
    var f = activeFont();
    var css = "";
    for (var i = 0; i < f.faces.length; i++) {
      css += "@font-face{font-family:'" + f.family + "';font-style:normal;"
        + "font-weight:" + f.faces[i].weight + ";font-display:swap;"
        + "src:url('" + base + f.faces[i].file + "') format('woff2');}";
    }
    return css;
  }

  // همان قوانین styles.css برای محیط‌هایی که مانیفست نمی‌رسد (shadow root)
  // خانواده‌ها از رجیستری ساخته می‌شوند تا برای همیشه همگام بمانند.
  // FIX-U (v1.4.0): قانون مونواسپیسِ کد (FIX-N) و تراز کد اینجا هم لازم بود —
  // در شدو روت استایل مانیفست نفوذ نمی‌کند و قبلاً <code>های داخلِ شدو
  // به فونت فارسی می‌رفتند. boost مشابه styles.css هم اعمال شد تا
  // قوانین !important خودِ سایت داخل شدو غلبه نکنند.
  function rulesCSS() {
    var Z = ":not(#__pfz__):not(#__pfz__)";
    var MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
    // G: لیست نسل‌های ساختاری — معادلِ styles.css و RTLDIR_HOSTILE_SEL
    var G = "ul, ol, dl, table, tbody, thead, tfoot, tr, section, article, aside, nav, header, footer, main, form, fieldset, dialog, figure, figcaption, iframe, video, audio, canvas, svg, picture, button, input, textarea, select, pre, blockquote, li, td, th, div, p, h1, h2, h3, h4, h5, h6, hr, address, dd, dt";
    var CARVE = ":where(:not(:has(" + G + ")), [contenteditable])";
    // معادلِ دقیقِ styles.css (FIX: CLONE-DIVERGENT — نسخه‌ی شدو قدیمی بود و
    // direction:rtl روی فلکس داشت ⇒ آینهِ کاملِ لی‌آوت داخل شدوها؛ و هیچ
    // کارو/معافیتی نداشت). هر تغییر در styles.css باید اینجا هم بازتاب شود.
    var s = "." + RTL_CLASS + Z + CARVE + "{unicode-bidi:plaintext!important;text-align:right!important}"
      + "." + RTLDIR_CLASS + ":not(#__pfz__):not(#__pfz__):not(li):not(dt):not(dd):not(td):not(th):not(:has(" + G + ")){direction:rtl!important;unicode-bidi:isolate!important}"
      + "." + RTL_CLASS + Z + " :is(pre,code,kbd,samp,tt,.cm-content,.monaco-editor),"
      + "." + RTLDIR_CLASS + Z + " :is(pre,code,kbd,samp,tt,.cm-content,.monaco-editor){"
      + "direction:ltr!important;unicode-bidi:isolate!important;text-align:left!important}"
      + "." + RTL_CLASS + Z + " :is(input,textarea,select),"
      + "." + RTLDIR_CLASS + Z + " :is(input,textarea,select),"
      + "." + RTLFLEX_CLASS + Z + " :is(input,textarea,select),"
      + "." + RTLFLEXEND_CLASS + Z + " :is(input,textarea,select){unicode-bidi:plaintext!important}"
      + "." + RTLFLEX_CLASS + Z + CARVE + "{text-align:right!important}"
      + "." + RTLFLEXEND_CLASS + Z + CARVE + "{text-align:right!important}"
      + "." + FONT_CLASS + Z + CARVE + "," + "." + FONT_CLASS + ":not(#__pfz__)" + CARVE + " *{"
      + "font-family:'Vazirmatn',Tahoma,'Segoe UI',sans-serif,"
      + "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji'!important;}";
    for (var i = 0; i < FONTS.length; i++) {
      var fc = "." + famClass(FONTS[i].id);
      s += fc + Z + CARVE + "," + fc + ":not(#__pfz__)" + CARVE + " *{"
        + "font-family:" + familyStack(FONTS[i]) + "!important;}";
    }
    // پایانی (مثل styles.css): مونواسپیس باید بعد از کلاس‌های خانواده بیاید تا غلبه کند
    s += "." + FONT_CLASS + Z + " :is(pre, code, kbd, samp, tt, .cm-content, .monaco-editor),"
      + "." + FONT_CLASS + Z + " :is(pre, code, kbd, samp, tt, .cm-content, .monaco-editor) *{"
      + "font-family:" + MONO + "!important;}";
    return s;
  }

  // تزریق stylesheet به document یا shadowRoot؛ adoptedStyleSheets مصون از style-src صفحه است.
  // هندل برمی‌گرداند تا بعداً CSS تزریق‌شده بتواند بی‌درنگ عوض شود (تعویض فونت).
  function addSheet(target, cssText, isDoc) {
    try {
      if (typeof CSSStyleSheet !== "undefined") {
        var sheet = new CSSStyleSheet();
        sheet.replaceSync(cssText);
        if (isDoc && "adoptedStyleSheets" in document) {
          document.adoptedStyleSheets = document.adoptedStyleSheets.concat([sheet]);
          return { kind: "ss", obj: sheet, target: target, isDoc: true };
        }
        if (!isDoc && "adoptedStyleSheets" in target) {
          target.adoptedStyleSheets = target.adoptedStyleSheets.concat([sheet]);
          return { kind: "ss", obj: sheet, target: target, isDoc: false };
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
      return { kind: "node", obj: style, target: target, isDoc: isDoc };
    } catch (e) { return null; }
  }

  function retargetSheet(handle, cssText) {
    try {
      if (!handle || !handle.obj) return;
      if (handle.kind === "ss" && handle.obj.replaceSync) handle.obj.replaceSync(cssText);
      else if (handle.kind === "node") handle.obj.textContent = cssText;
    } catch (e) {}
  }

  // هندل‌های فونتِ سند اصلی (معمولاً یکی؛ ساخته‌ی اضافی هم بی‌ضررند)
  var fontSheetHandles = [];
  // FIX-PR: فونتِ فعال را فوری دانلود کن تا اولین رندرِ
  // متن علامت‌خورده با همان فونت باشد — قبلاً وقفه‌ی چندثانیه‌ایِ
  // fetchِ وفی‌۲ فونت جایگزین (fallback) نشان می‌داد.
  function preloadActiveFont() {
    try {
      if (!document.fonts || !document.fonts.load) return;
      var F = fontById(CURRENT_FONT_ID);
      document.fonts.load('16px "' + F.family + '"');
    } catch (e) {}
  }

  function injectFontFace() {
    try {
      var h = addSheet(document, fontFaceCSS(fontBase()), true);
      if (h) fontSheetHandles.push(h);
    } catch (e) {}
    preloadActiveFont();
  }

  function styleShadowRoot(sr) {
    if (styledShadows.has(sr)) return;
    styledShadows.add(sr);
    var h = addSheet(sr, fontFaceCSS(fontBase()) + rulesCSS(), false);
    if (h) fontSheetHandles.push(h);
  }

  // v1.2.0: عوض شدن فونت → بازنویسی همان sheetهای زنده (بدون ریلود)
  // هندل‌های مرده (shadow/گره‌ی جداشده) هرس می‌شوند.
  function refreshFontSheets() {
    var base = fontBase();
    var alive = [];
    for (var i = 0; i < fontSheetHandles.length; i++) {
      var h = fontSheetHandles[i];
      var ok = true;
      try {
        if (h.isDoc) ok = true;
        else ok = !!(h.target && (h.target === document || h.target.isConnected !== false || (h.target.host && h.target.host.isConnected)));
      } catch (e) { ok = true; }
      if (!ok) continue;
      retargetSheet(h, h.isDoc ? fontFaceCSS(base) : fontFaceCSS(base) + rulesCSS());
      alive.push(h);
    }
    fontSheetHandles = alive;
    preloadActiveFont(); // FIX-PR
  }

  /* ─────────────── تحلیل display (با کش) ─────────────── */

  function displayOf(el) {
    var ent = displayCache.get(el);
    var now = Date.now();
    if (ent !== undefined && (now - ent.at) < DISPLAY_CACHE_TTL) return ent.d;
    var d = "";
    try {
      var win = el.ownerDocument.defaultView;
      if (el.isConnected !== false && win && win.getComputedStyle) {
        var cs = win.getComputedStyle(el);
        d = cs ? cs.display || "" : "";
      }
    } catch (e) { d = ""; }
    displayCache.set(el, { d: d, at: now });
    return d;
  }

  // آیا این المان «بلوکِ متنی» قابل علامت‌گذاری است؟
  // FIX-RD: displayهایی که direction رویشان لی‌آوت را
  // برمی‌گرداند (محور فلکس/گرید یا ترتیب ستون‌های جدول) — برای این‌ها
  // همان plaintext امن قبلی حفظ می‌شود.
  var DIR_OK_DISPLAY_RE = /^(block|inline-block|flow-root)$/;
  // گاردِ دومِ ضدآینه (engine-side): rtldir اگر نوادگانی با تگِ ساختاری/
  // بلوکی (لیست/جدول/div/… ) داشته باشد هرگز روی المان نمی‌نشیند — جهتِ
  // rtl قابل‌ارث‌بری است و در پنجره‌ی کهنگیِ علامت (هیدراتِ فریم‌ورک) کل
  // زیرشاخه را آینه می‌کرد. آیتمِ فهرست و سلول‌های جدول هم خودِ المان
  // مسدودند (گلوله‌مارک/ترتیب داخلی ورق نمی‌خورد).
  var RTLDIR_HOSTILE_SEL = "ul, ol, dl, table, tbody, thead, tfoot, tr, section, article, aside, nav, header, footer, main, form, fieldset, dialog, figure, figcaption, iframe, video, audio, canvas, svg, picture, button, input, textarea, select, pre, blockquote, li, td, th, div, p, h1, h2, h3, h4, h5, h6, hr, address, dd, dt";
  function displayAllowsDir(disp) {
    if (!disp) return false;
    // اصلِ «فقط متون راست‌چین»: direction فقط روی واحدهای متنیِ ساده مجاز
    // است. هر چیز دیگر (flex/grid/table/list-item/…) هیچ‌وقت جهت نمی‌گیرد
    // تا ردیف‌ها، سلول‌های جدول، گلوله‌مارکِ آیتم‌لیست‌ها و گزینه‌های UI
    // هرگز جابه‌جا یا آینه نشوند. (ممکن است چندکلمه‌ای باشد — کلمه‌ی نخست)
    return DIR_OK_DISPLAY_RE.test(String(disp).trim().split(/\s+/)[0]);
  }
  function tg2(el) { try { return el.tagName || ""; } catch (e) { return ""; } }
  function hasStructuralDesc(el) {
    try { return !!el.querySelector(RTLDIR_HOSTILE_SEL); } catch (e) { return false; }
  }

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
  // - کانتینری که همه‌ی بچه‌هایش لینک (<a>) است = منو → رد
  // FIX-P (v1.4.0): چیپ‌های inline کد (کد/کیبورد/نمونه) هم به‌عنوان
  //   فرگمنتِ متنی پذیرفته شدند — رندر ری‌اکتیِ AIها دور چیپ‌های کد،
  //   متن را تکه‌تکه می‌کند و قبلاً چنین خطی یکدست نمی‌شد و ترتیب
  //   کلماتش می‌ریخت به‌هم (گزارش کاربر با اسکرین‌شات: خطوطی مثل
  //   «کامیت b9afb33 + تگ v1.4.0 زده شد…»). نرده‌ی جدید: ردیفی که
  //   «همه‌ی» فرزندانش چیپ کد است = نوار ابزار/شبیه‌منو → رد.
  function isFlexFragText(el) {
    var ch = el.children;
    var n = ch ? ch.length : 0;
    if (n < 2 || n > 60) return false;
    var d = displayOf(el);
    if (d.indexOf("flex") === -1 && d.indexOf("grid") === -1) return false;
    var links = 0, chips = 0;
    for (var i = 0; i < n; i++) {
      var tg = ch[i].tagName;
      if (!tg) return false;
      if (tg === "A") { links++; continue; }
      if (tg === "CODE" || tg === "KBD" || tg === "SAMP") { chips++; continue; }
      if (!INLINE.has(tg) && tg !== "BR") return false;
    }
    if (links === n) return false;   // همه لینک = منو
    if (chips === n) return false;   // همه چیپ کد = نوار ابزار/دکمه‌ها
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

  // تعداد حروف/ارقامِ معنادارِ یک متن (برای تشخیص «محتوا» از «تزئین»)
  var LETCOUNT_RE = /[\p{L}\p{N}]/u;
  function letterCount(t, cap) {
    if (!t) return 0;
    var n = 0, s = String(t), lim = cap || 9000;
    for (var i = 0; i < s.length; i++) { if (LETCOUNT_RE.test(s[i])) { n++; if (n >= lim) return n; } }
    return n;
  }

  // بلاک‌های بزرگِ چیدمانی را رد کن تا «کل سایت» راست‌چین نشود
  function isEligibleBlock(el) {
    var tag = el.tagName;
    var kids = el.childElementCount;
    if (!kids) return true;
    if (isFlexFragText(el)) return true; // فرگمنت‌های متنی: سقف متن در applyEl چک می‌شود
    // FIX-CT — رفعِ «آینه‌شدنِ کل صفحه» (بازتولیدِ زنده روی گیت‌هاب):
    // زنجیره‌ی wrapperها (repository-content → turbo-frame → PageLayout) که
    // متن را فقط عبور می‌دهند، «بلوکِ متنی» نیستند؛ قبلاً علامت می‌گرفتند و
    // direction: rtl ارثی‌شان کل سایت را آینه می‌کرد. قواعد:
    // ۱) ساختارهای نمایشی (لیست/جدول/سکشن/فرم) همیشه چیدمان‌اند — واحدهایِ
    //    درون‌شان جداگانه قضاوت می‌شوند (قضاوتِ تک‌تکِ آیتم‌های لیستِ ترکیبی
    //    حفظ می‌شود).
    if (/^(UL|OL|DL|TABLE|TBODY|THEAD|TFOOT|TR|SECTION|ARTICLE|ASIDE|NAV|HEADER|FOOTER|MAIN|FORM)$/.test(tag)) return false;
    // ۲) هر فرزندِ غیریک‌خطی با متنِ واقعی (≥۸ حرف) ⇒ من ظرفم، متن را در
    //    همان فرزند قضاوت کن. تگ معیار نیست (<turbo-frame> و تگ‌های سفارشیِ
    //    فریم‌ورکها در هیچ لیست تگی نیستند)؛ فرزندِ تزئینیِ کم‌متن
    //    (آیکن/پین/متای خالی) مانع‌نمی‌شود.
    var chEls = el.children;
    var sigKids = 0;
    for (var bi = 0; bi < chEls.length; bi++) {
      var chTag = chEls[bi].tagName;
      if (!chTag || INLINE.has(chTag) || SKIP.has(chTag) || STOP.has(chTag)) continue;
      var lt = letterCount(chEls[bi].textContent, 8);
      if (lt >= 8) return false;              // یک فرزندِ محتواییِ بزرگ = من ظرفم
      // چند فرزندِ کوتاهِ محتوایی = فهرست/منو، نه «یک متن» — وگرنه منوی
      // کوتاه‌آیتمِ بلاکی یکجا rld می‌شد و آیتمِ انگلیسیِ وسطش (بدون خودِ
      // علامت) جهتِ ارثی می‌گرفت و جابه‌جا می‌شد (شکار: سایدبار‌های
      // div-classic بدون flex و بدون ul).
      if (lt >= 1 && ++sigKids >= 2) return false;
    }
    if (kids > 14) return false;
    if (kids > 4) {
      // FIX-T (v1.4.0): بلوک‌های متنیِ رسمی (P/LI/TD/…) حتی با متنِ
      // بلند هم «چیدمان» نیستند و قضاوت می‌شوند.
      if (!UNIFORM_TAGS.has(el.tagName)) {
        // FIX-SC: «پاراگرافِ لباس‌پنهان» — div بلوکی که همه‌ی
        // فرزندانش inline/br هستند در واقع یک پاراگرافِ متنی است نه
        // چیدمان (الگوی AI: پاراگرافِ بلندِ خردشده به چند span).
        // چیدمانِ واقعی همیشه دست‌کم یک فرزندِ غیر-inline دارد.
        var allInline = true;
        try {
          var chA = el.children;
          for (var ci = 0; ci < chA.length; ci++) {
            var ctag = chA[ci].tagName;
            if (!ctag || (!INLINE.has(ctag) && ctag !== "BR")) { allInline = false; break; }
          }
        } catch (e) { allInline = true; }
        if (!allInline) {
          try {
            var t = el.textContent;
            if (t && t.length > 1200) return false;
          } catch (e) {}
        }
      }
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
    // FIX-ED: عمق محافظ از ۱۰ به ۲۴ رسید — نقل‌قول/لیستِ
    // تودرتوی عمیق داخل ادیتور (ProseMirror/Slate) می‌تواند فراتر از ۱۰
    // سطح برود؛ قبلاً چنین متنی از تورِ محافظ فرار می‌کرد و «داخل
    // ادیتور» علامت/فونت/تبدیل می‌گرفت (بازگشتِ سناریوی FIX-Y).
    while (el && depth < 24) {
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
    // FIX-Y: هیچ متنِ داخل ادیتور (contenteditable) کانتینر نمی‌گیرد —
    // مدیریت سطح فیلد/ادیتور فقط از مسیر applyField ریشه انجام می‌شود
    // تا حین تایپ هیچ mutate/علامتی درون ادیتور رخ ندهد.
    { var __ed = editableAncestor(textNode); if (__ed) return null; }
    var el = textNode.parentElement;
    var inlineFallback = null;
    var depth = 0;
    while (el && depth < 24) { // FIX-ED: هم‌تراز با محافظ ادیتور
      var tag = el.tagName;
      if (!tag) return inlineFallback;
      try { if (el.isContentEditable) return null; } catch (e) {} // FIX-Y
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
    // FIX-NL: برای هیولاهای >۱۵۰هزار کاراکتری کل رشته پیموده
    // نمی‌شود؛ سه پنجره‌ی ثابت (سر/میانه/دم — هر یک تا ۶هزار نویسه)
    // قضاوت می‌کنند. روی متنِ فوق‌بلند یکنواخت این نمونه از نظر آماری
    // با تحلیل کامل برابر است و هزینه‌ی هر تیک را خط‌مشی می‌بندد.
    if (n > ANALYZE_SAMPLE_MAX) {
      var W = 6000;
      var mid = (n - W) >> 1;
      return analyzeWindows(t, [
        [0, W],
        [mid, mid + W],
        [n - W, n],
      ]);
    }
    return analyzeWindows(t, [[0, n]]);
  }

  function analyzeWindows(t, wins) {
    var fa = 0, la = 0, first = 0; // first: 0=هیچ 1=فارسی 2=لاتین
    for (var wi = 0; wi < wins.length; wi++) {
    var a0 = wins[wi][0], b0 = wins[wi][1];
    for (var i = a0; i < b0; i++) {
      var c = t.charCodeAt(i);
      // ایموجی‌ها و کاراکترهای surrogate: خنثی، رد شو
      if (c >= 0xD800 && c <= 0xDBFF) { i++; continue; }
      if (c >= 0x0600 && c <= 0x06FF || c >= 0x0750 && c <= 0x077F ||
          c >= 0x08A0 && c <= 0x08FF || c >= 0xFB50 && c <= 0xFDFF ||
          c >= 0xFE70 && c <= 0xFEFF) {
        fa++; if (!first) first = 1;
      } else if ((c >= 0x41 && c <= 0x5A) || (c >= 0x61 && c <= 0x7A) ||
                 (c >= 0xC0 && c <= 0x24F && c !== 0xD7 && c !== 0xF7)) {
        // FIX-R (v1.4.0): × و ÷ در بازه‌ی Latin-Extended نیستند —
        // علائم ریاضی (bidi-neutral) قبلاً اشتباهی لاتین شمرده می‌شدند
        la++; if (!first) first = 2;
      }
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

  // امضای ارزان متن برای کش؛ متن‌های کوتاه‌تر از ۴۰۰۰ کاراکتر «کامل»،
  // بلندترها: آغاز+پایان کامل (جایی که استریم/ویرایش رایج اتفاق می‌افتد)
  // + نمونه‌برداریِ میانه. FIX-W (v1.4.0): قبلاً از ۶۰۰ به بالا فقط
  // نمونه می‌آمد و یک ویرایشِ میانیِ با امضای تکراری می‌توانست قضاوت
  // کهنه را زنده نگه دارد؛ حالا هر پیام معمولی（chat بای‌هزاران کاراکتر)
  // کامل هش می‌شود (هزینه‌اش با یک‌بار charCodeAt چندصدم میلی‌ثانیه است).
  function textSig(t) {
    var n = t.length;
    if (n <= 4000) return t.length + ":" + h32(t, 0, n);
    // بلند: طول + ۶۴ اوّل + ۶۴ آخر + ۳۲ نمونه‌ی میانه
    var head = h32(t, 0, 64);
    var tail = h32(t, n - 64, n);
    var step = (n / 32) | 0;
    var mid = 0;
    for (var i = 64; i < n - 64; i += step) mid = ((mid * 33) ^ t.charCodeAt(i)) >>> 0;
    return n + ":" + head + ":" + tail + ":" + mid;
  }
  function h32(t, a, b) {
    var h = 0;
    for (var i = a; i < b; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0;
    return h;
  }

  /* ─────────────── فارسی‌سازی اعداد (v1.4.0 — DIGITS) ───────────────
     فقط روی بلوک‌های متنیِ فارسی (همان‌هایی که فونت/علامت می‌گیرند) —
     هرگز داخل کد، لینک/ایمیل، فیلد یا ادیتور نه. تبدیل idempotent
     است؛ متنِ اصلیِ هر گره‌متنی در WeakMap نگه داشته می‌شود تا
     خاموش‌کردنِ تاگل، بازگردانی «دقیق» انجام دهد — حتی اعداد فارسیِ
     ذاتیِ متن سر جایشان می‌مانند. رندر اعداد فارسی همان‌طور که کاربر
     خواست با فونتِ انتخابی او می‌شود چون گره‌ها داخل قابِ کلاسِ
     خانواده‌ی فونت‌اند. */

  var FA_DIGITS  = "۰۱۲۳۴۵۶۷۸۹";
  var NUM_ATTR   = "data-pf-num";
  var numOrigMap = new WeakMap(); // گره‌متنی → متن اصلیِ پیش از تبدیل
  var NUM_REJECT_TAGS = new Set([
    "SCRIPT","STYLE","NOSCRIPT","TEMPLATE","CODE","PRE","KBD","SAMP","TT",
    "A","SVG","CANVAS","IFRAME","OBJECT","EMBED","SELECT","TEXTAREA","INPUT","HEAD"
  ]);

  function faDigs(s) {
    return String(s).replace(/[0-9]/g, function (d) { return FA_DIGITS[+d]; });
  }

  // آیا این گره‌متنی برای تبدیل اعداد امن است؟ (نه کد/لینک/ادیتور)
  function numNodeOk(tn, stopAt) {
    // FIX-Z: اجدای chain پیموده می‌شوند (خروجیِ تودرتویِ
    // مارک‌داونِ AI فراتر از ۶ سطح است) و قوانینِ رد (کد/لینک/ادیتور)
    // «قبل از» پذیرشِ stopAt اعمال می‌شوند — قبلاً برخوردِ زودرسِ
    // `el===stopAt` محافظِ قابل‌ویرایش‌بودن را دور می‌زد.
    // FIX-ND: عمق از ۱۶ به ۲۴ رسید — ریدمی‌ها/چت‌های تودرتویِ
    // بسیار عمیق (گیت‌هاب، فریم‌ورکها) رقم‌های عمیق‌تر از ۱۶ را
    // می‌رساندند بیرون و تبدیل نمی‌شدند.
    var el = tn.parentElement, d = 0;
    while (el && d < 24) {
      var tg = el.tagName;
      if (!tg) return false;
      if (NUM_REJECT_TAGS.has(tg)) return false;
      try { if (el.isContentEditable) return false; } catch (e) {}
      if (el === stopAt) return true;
      el = el.parentElement; d++;
    }
    return el === stopAt || stopAt == null;
  }

  function numConvert(el) {
    if (!el || !el.tagName) return;
    // FIX-Y: هرگز داخل ادیتور تبدیل نکن (نرده‌ی نهاییِ دفاعی)
    try { if (el.isContentEditable || editableAncestor(el)) return; } catch (e) {}
    var walker;
    try {
      walker = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    } catch (e) { return; }
    var n, any = false;
    while ((n = walker.nextNode())) {
      var v = n.nodeValue;
      if (!v || !/[0-9]/.test(v)) continue;
      if (!numNodeOk(n, el)) continue;
      var orig = numOrigMap.get(n);
      if (orig === undefined) orig = v;
      else if (v !== faDigs(orig)) {
        // FIX-Q (v1.4.0): استریمِ روی گرهِ تبدیل‌شده — اگر بخشِ قبلیِ
        // تبدیل‌شده هنوز پیشوندِ گره است، فقط دمِ تازه‌ی خام به مبنا
        // می‌چسبد تا بازگردانی همچنان بایت‌به‌بایت دقیق بماند؛
        // قبلاً کلِ گره (با ارقام فارسیِ تبدیل‌شده‌ی درونش) مبنا می‌شد
        // و restore دیگر به متنِ اصلیِ لاتین برنمی‌گشت.
        if (v.length > orig.length && v.substring(0, orig.length) === faDigs(orig)) {
          orig = orig + v.substring(orig.length); // دمِ نو به مبنا می‌چسبد
        } else {
          orig = v; // جایگزینی کامل (رندرِ مجدد SPA) — مبنا = متن تازه
        }
      }
      numOrigMap.set(n, orig);
      var nv = faDigs(v);
      if (nv !== v) { try { n.nodeValue = nv; } catch (e) {} any = true; }
    }
    if (any) { try { el.setAttribute(NUM_ATTR, ""); } catch (e) {} }
  }

  function numRestore(el) {
    if (!el || !el.tagName) return;
    var walker;
    try {
      walker = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    } catch (e) { return; }
    var n;
    while ((n = walker.nextNode())) {
      var orig = numOrigMap.get(n);
      if (orig !== undefined) {
        try { n.nodeValue = orig; } catch (e) {}
        numOrigMap.delete(n);
      }
    }
    try { el.removeAttribute(NUM_ATTR); } catch (e) {}
  }

  /* ─────────────── فارسی‌سازی اعداد هنگام تایپ ───────────────
     درخواستِ کاربر: «وقتی تایپ می‌کنم فونت اعمال می‌شود ولی رقم‌ها
     فارسی نمی‌شوند». محتوای داخل ادیتور را هرگز از بیرون نمی‌نویسیم
     (FIX-Y)، اما خودِ درج را می‌توانیم از خط‌لوله‌ی واقعیِ ویرایش
     تغییر دهیم: beforeinput ← درجِ بومی. چون رویدادهای واقعیِ
     beforeinput/input از مسیرِ خودِ مرورگر تولید می‌شوند، مدلِ
     داخلیِ فریم‌ورک (React/ProseMirror/Slate/Lexical) سالم می‌ماند. */

  var kbInserting = false; // نگهبان بازگشتی: درجِ خودمان هم beforeinput می‌سازد

  // نوع‌های input که رقمشان هرگز محلی نمی‌شود (رمز/عدد/تلفن/ایمیل/…)
  var KB_BAD_INPUT_TYPES = { password: 1, number: 1, tel: 1, email: 1, url: 1, date: 1, time: 1,
                             "datetime-local": 1, month: 1, week: 1, range: 1, color: 1 };

  function kbTargetOk(t) {
    if (!t || !t.tagName) return false;
    // ادیتورهای کد = اینمینیتی کد (رقمِ لاتین در کد حیاتی است)
    try {
      if (t.closest && t.closest("pre,code,kbd,samp,.monaco-editor,.cm-editor,.CodeMirror,.ace_editor")) return false;
    } catch (e) {}
    var tag = t.tagName;
    if (tag === "INPUT") {
      var ty = "text";
      try { ty = String(t.type || "text").toLowerCase(); } catch (e) {}
      try { if (t.readOnly || t.disabled) return false; } catch (e) { return false; }
      return !KB_BAD_INPUT_TYPES[ty];
    }
    if (tag === "TEXTAREA") {
      try { return !(t.readOnly || t.disabled); } catch (e) { return false; }
    }
    try { return t.isContentEditable === true; } catch (e) { return false; }
  }

  function kbInsertIntoField(win, t, faText) {
    // «مقدارِ بومی + رویداد input» — همان روشِ ابزارهای ویرایشگر برای
    // سازگاری با فیلدهای کنترل‌شده (React/Vue): setterِ بومیِ پروتوتایپ
    // تا ردیابِ مقدارِ فریم‌ورک دور زده نشود؛ سپس رویداد input حباب‌دار.
    var start, end;
    try { start = t.selectionStart; end = t.selectionEnd; } catch (e) { return; }
    if (typeof start !== "number" || typeof end !== "number") return;
    try {
      var proto = (t.tagName === "TEXTAREA")
        ? win.HTMLTextAreaElement.prototype : win.HTMLInputElement.prototype;
      var desc = proto && Object.getOwnPropertyDescriptor(proto, "value");
      var setter = desc && desc.set;
      var nv = t.value.slice(0, start) + faText + t.value.slice(end);
      if (setter) setter.call(t, nv); else t.value = nv;
      try { t.selectionStart = t.selectionEnd = start + faText.length; } catch (e) {}
      t.dispatchEvent(new win.Event("input", { bubbles: true, cancelable: false }));
    } catch (e) {}
  }

  function beforeInputHandler(e) {
    if (!DIGITS_ENABLED || kbInserting) return;
    try {
      if (!e || e.cancelable === false) return;
      var it = e.inputType || "";
      if (it !== "insertText" && it !== "insertReplacementText") return;
      var data = e.data;
      if (!data || !/[0-9]/.test(data)) return;
      var path = (typeof e.composedPath === "function") ? e.composedPath() : null;
      var t = (path && path.length) ? path[0] : e.target;
      if (!kbTargetOk(t)) return;
      var faText = faDigs(data);
      if (faText === data) return;
      e.preventDefault();
      kbInserting = true;
      try {
        var tag = t.tagName;
        var doc = t.ownerDocument || document;
        var win = doc.defaultView || window;
        if (tag === "INPUT" || tag === "TEXTAREA") {
          kbInsertIntoField(win, t, faText);
        } else {
          // contenteditable — درج از خط‌لوله‌ی ویرایشِ مرورگر؛ در
          // غیاب execCommand، درجِ دستی در محلِ انتخاب (fallback).
          var ok = false;
          try { ok = !!(doc.execCommand && doc.execCommand("insertText", false, faText)); } catch (e2) { ok = false; }
          if (!ok) {
            try {
              var sel = win.getSelection && win.getSelection();
              if (sel && sel.rangeCount) {
                var r = sel.getRangeAt(0);
                r.deleteContents();
                var tn = doc.createTextNode(faText);
                r.insertNode(tn);
                r.setStartAfter(tn); r.setEndAfter(tn);
                sel.removeAllRanges(); sel.addRange(r);
              }
            } catch (e3) {}
          }
        }
      } finally { kbInserting = false; }
    } catch (e) {}
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
      // قفلِ نهایی (گلوگاه واحد): هر مسیرِ علامت‌گذاری — اسکن، موتاسیون،
      // بازقضاوت، یکدست‌سازی — از همین‌جا رد می‌شود؛ پس این‌جا برای بلوکِ
      // غیریکدستِ نامناسب (کانتینر/چیدمان) رسمِ علامت را می‌بندیم تا هیچ
      // شکافِ زمانی‌ای (مونت/هیدراتِ فریم‌ورک) نتواند wrapper علامت بگیرد.
      // این قفل ارزان است: فقط روی ساختارِ فرزندان قضاوت می‌کند و برای
      // بلوک‌های متن‌ِ واقعی همیشه عبور می‌دهد.
      if (fa || dominant) {
        var tg = el.tagName;
        if (tg && !UNIFORM_TAGS.has(tg) && !SKIP.has(tg) && !STOP.has(tg)
            && tg !== "INPUT" && tg !== "TEXTAREA" && !INLINE.has(tg)
            && !isFlexFragText(el) && !isEligibleBlock(el)) {
          clearEl(el);
          return;
        }
      }
      var wantRtl = !!(RTL_ENABLED && fa && dominant);
      var kind = wantRtl ? flexFragKindCached(el) : 0;
      // کانتینر flex با فرگمنت‌های inline: plaintext کافی نیست — ظرفِ فلکس
      // هر span را جدا پاراگراف می‌بیند. با direction روی ظرف، ترتیب بصری
      // فرگمنت‌ها معکوس می‌شود. برای *-endها هم لنگر راست جبران می‌گردد.
      el.classList.toggle(RTL_CLASS,        wantRtl && kind === 0);
      el.classList.toggle(RTLFLEX_CLASS,    wantRtl && kind === 1);
      el.classList.toggle(RTLFLEXEND_CLASS, wantRtl && kind === 2);
      // FIX-RD: plaintext جهتِ پاراگراف را از «اولین نویسه‌ی
      // قوی» می‌گیرد — پس خطِ فارسیِ با آغازِ لاتین (README (…): سلام…)
      // LTR رندر می‌شد (گزارشِ کاربر با اسکرین‌شات). روی کانتینرهایی
      // که direction برایشان بی‌خطر است (غیر flex/grid/table)، جهتِ
      // ریشه را قطعی rtl می‌کنیم؛ موقعیتِ flex/grid/table قبلاً با
      // همان plaintext/کلاس‌های flex سروکار دارد و دست نمی‌خورد.
      var wantDir = false;
      if (wantRtl && kind === 0) {
        var disp = displayOf(el);
        if (displayAllowsDir(disp) && !/^(LI|DT|DD|TD|TH)$/.test(tg2(el))) {
          wantDir = !hasStructuralDesc(el);
        }
      }
      el.classList.toggle(RTLDIR_CLASS, wantDir);
      el.classList.toggle(FONT_CLASS, !!(FONT_ENABLED && fa));

      // v1.2.0 (FIX-G): کلاس خانواده‌ی فونت، همگام با انتخاب فعلی کاربر
      var famAttr = el.getAttribute(FAM_ATTR) || "";
      var wantFamId = FONT_ENABLED && fa ? fontById(CURRENT_FONT_ID).id : "";
      if (famAttr !== wantFamId) {
        if (famAttr) el.classList.remove(famClass(famAttr));
        if (wantFamId) el.classList.add(famClass(wantFamId));
        if (wantFamId) el.setAttribute(FAM_ATTR, wantFamId);
        else el.removeAttribute(FAM_ATTR);
      }

      // FIX-A: اگر هنوز نشانه‌ای روی المان هست ثبتش کن، وگرنه از فهرست خارجش کن
      if (el.classList.contains(RTL_CLASS) || el.classList.contains(FONT_CLASS) || el.classList.contains(RTLDIR_CLASS)
          || el.classList.contains(RTLFLEX_CLASS) || el.classList.contains(RTLFLEXEND_CLASS)) marked.add(el);
      else if (!el.hasAttribute || (!el.hasAttribute(DIR_MARK) && !el.hasAttribute(FAM_ATTR))) marked.delete(el);
    } catch (e) {}
  }

  // پاکسازی کامل علائم از یک المان (کلاس‌ها + dir + کش‌ها + فهرست)
  function clearEl(el) {
    sigCache.delete(el);
    jcCache.delete(el);
    displayCache.delete(el);
    var fam = "";
    try { fam = el.getAttribute && (el.getAttribute(FAM_ATTR) || ""); } catch (e) {}
    try {
      el.classList.remove(RTL_CLASS);
      el.classList.remove(FONT_CLASS);
      el.classList.remove(RTLFLEX_CLASS);
      el.classList.remove(RTLFLEXEND_CLASS);
      el.classList.remove(RTLDIR_CLASS);
      if (fam) el.classList.remove(famClass(fam));
      el.removeAttribute && el.removeAttribute(FAM_ATTR);
    } catch (e) {}
    try { if (el.hasAttribute && el.hasAttribute(NUM_ATTR)) numRestore(el); } catch (e) {}
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
    // FIX-Y: المانِ داخل ادیتور contenteditable هرگز پردازش نمی‌شود —
    // حتی اگر walker/observer به فرزندِ داخلیِ آن برسد (همان سناریوی
    // پرتابِ اعداد هنگام تایپ در چت‌باکس‌های AI).
    try { if (el.isContentEditable || editableAncestor(el)) return; } catch (e) {}
    var t;
    try { t = el.textContent || ""; } catch (e) { return; }
    if (!t) {
      sigCache.delete(el);
      applyClasses(el, false, false);
      if (el.hasAttribute && el.hasAttribute(NUM_ATTR)) numRestore(el);
      refreshMarkedAncestors(el); // FIX-L: تخلیه‌ی متن هم باید اجداد را بازارزیابی کند
      return;
    }
    // FIX-NL: گاردِ «بیشتر از ۳۰۰۰ کاراکتر = چیدمان» حذف شد — پیامِ بلند
    // دیگر علامتش پاک نمی‌شود (قضاوت ساختاری است نه حجمی).
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

    // v1.4.0 (DIGITS): اعدادِ بلوکِ فارسی → فارسی؛ خاموشی تاگل → بازگردانی دقیق
    if (DIGITS_ENABLED && r.fa) numConvert(el);
    else if (el.hasAttribute && el.hasAttribute(NUM_ATTR)) numRestore(el);

    // FIX-H: بلوک یکدست — اگر ریل‌ای درون LI/TD/P/... RTL گرفت و کل بلوک
    // فارسیِ predominant است، خود بلوک هم علامت بخورد تا base direction
    // کل پاراگراف یکجا rtl باشد و ترتیب کلمات هرگز قیل نشود (گزارش ۳ و ۴).
    if (RTL_ENABLED && r.fa && r.dominant) uniformMark(el);
    else refreshMarkedAncestors(el); // FIX-L: فلیپ به غیرغالب → شستن علائم کهنه‌ی اجداد
  }

  // FIX-L (v1.3.0): کهنگی علائم اجداد — وقتی محتوای ریل‌ای به انگلیسی/
  // غیرغالب برگشت، ظرف‌های پیش‌علامت‌خورده‌ی بالادست (بلوک یکدستِ
  // FIX-H یا wrapperای که هنگام مونت علامت گرفته بود) هم باید بازارزیابی
  // و در صورت لزوم پاک شوند؛ قبلاً برای همیشه علامت‌دار می‌ماندند —
  // مثل LIای که فارسی بود و بعداً انگلیسی شد ولی راست‌چین/فونت‌دار ماند.
  function refreshMarkedAncestors(el) {
    var anc = el.parentElement, hops = 0, done = 0;
    while (anc && hops < 6 && done < 3) {
      hops++;
      var tg = anc.tagName;
      if (!tg) break;
      if (SKIP.has(tg) || STOP.has(tg)) break;
      try { if (editableRoot(anc)) break; } catch (e) {}
      if (marked.has(anc)) { applyEl(anc); done++; }
      anc = anc.parentElement;
    }
  }

  // FIX-H: الصای «بلوک یکدست» — از ریل‌ای به سمت بالا، اولین بلوک متنی
  // قابل یکسانسازی را پیدا و (اگر فارسی predominant بود) علامت‌گذاری کن.
  // محافظ‌ها: nav/menu/منوها، ادیتور، سقف متن کانتینر، و تگ‌های چیدمانی.
  function uniformMark(el) {
    var anc = el;
    var hops = 0;
    while (anc && hops < 4) {
      anc = anc.parentElement;
      if (!anc || !anc.tagName) break;
      var tg = anc.tagName;
      if (SKIP.has(tg)) break;
      if (editableRoot(anc)) break;
      if (UNIFORM_TAGS.has(tg)) {
        // محافظ نوبار/منو: بلوک درون ناوبری هرگز یکدست علامت نمی‌گیرد
        try {
          if (anc.closest && anc.closest("nav,[role=navigation],[role=menubar],[role=menu]")) break;
        } catch (e) {}
        applyBlockEl(anc);
        break;
      }
      if (STOP.has(tg)) break; // دیوار چیدمان: بالاتر نرو
      hops++;
    }
  }

  // FIX-H: علامت‌گذاری بلوک یکدست — مانند applyEl ولی تگ‌های STOP
  // محض (LI درون UL، TD درون TR) هم مجازند چون همان دیوار بالاتر است.
  function applyBlockEl(el) {
    if (!el || !el.tagName) return;
    var tag = el.tagName;
    if (SKIP.has(tag)) return;
    if (tag === "INPUT" || tag === "TEXTAREA" || editableRoot(el)) return;
    var t;
    try { t = el.textContent || ""; } catch (e) { return; }
    if (!t) return;
    var sig = textSig(t);
    var cached = sigCache.get(el);
    var r;
    if (cached && cached.sig === sig) r = cached;
    else {
      r = analyze(t);
      sigCache.set(el, { sig: sig, fa: r.fa, dominant: r.dominant });
    }
    if (r.fa && r.dominant) applyClasses(el, true, true);
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
    // FIX-FC: کشِ امضا — هر ضربه‌ی کلید روی سندِ بزرگِ
    // contenteditable دیگر آنالیز کاملِ O(n) نمی‌خواهد؛ امضای
    // یکسان = نتیجه‌ی یکسان. شکلِ ورودی همان applyEl است تا دو
    // مسیر همیشه یک قضاوت بدهند.
    var sig = t ? textSig(t) : "";
    var cached = sigCache.get(el);
    var r;
    if (cached && cached.sig === sig) r = cached;
    else {
      r = t ? analyze(t) : NO;
      sigCache.set(el, { sig: sig, fa: r.fa, dominant: r.dominant });
    }

    try { el.classList.toggle(FONT_CLASS, !!(FONT_ENABLED && r.fa)); } catch (e) {}

    // v1.2.0: فیلدها هم کلاس خانواده‌ی فونت می‌گیرند (هماهنگ با انتخاب کاربر)
    try {
      var famAttr = el.getAttribute(FAM_ATTR) || "";
      var wantFamId = FONT_ENABLED && r.fa ? fontById(CURRENT_FONT_ID).id : "";
      if (famAttr !== wantFamId) {
        if (famAttr) el.classList.remove(famClass(famAttr));
        if (wantFamId) el.classList.add(famClass(wantFamId));
        if (wantFamId) el.setAttribute(FAM_ATTR, wantFamId);
        else el.removeAttribute(FAM_ATTR);
      }
    } catch (e) {}

    // dir=auto بومی (FIX-FD v1.4.0 — engine-side): قبلاً dir=auto فقط
    // به فیلدِ فارسی‌دار می‌رسید؛ پس یک فیلدِ انگلیسی داخل متنِ فارسیِ
    // علامت‌خورده جهتِ rtl را از پیرامون به ارث می‌بُرد و راست‌به‌چپِ
    // اجباری رندر می‌شد (plaintext در CSS هم نمی‌تواند مقدارِ فیلد را
    // بخواند — فقط dir=auto بومی از «value» قضاوت می‌کند). حالا dir=auto
    // بدون قیدِ فارسی‌بودن به فیلدهای مجاز داده می‌شود: رفتارِ بومی — مقدار
    // فارسی ⇒ rtl، مقدارِ لاتین ⇒ ltr (و روی صفحاتِ انگلیسی‌محض هیچ تغییرِ
    // بصری رخ نمی‌دهد). خاموشی تاگل، مقدارِ اصلیِ سایت را بازمی‌گرداند.
    if (RTL_ENABLED) {
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
    // FIX-Y: متن داخل ادیتور اسکن نمی‌شود (ادیتور فقط از مسیر فیلدها)
    try { if (p.isContentEditable) return NodeFilter.FILTER_REJECT; } catch (e) {}
    if (editableAncestor(node)) return NodeFilter.FILTER_REJECT;
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
    var n;
    // FIX-NL: بریدن در میانه‌ی پیمایش ممنوع — زیردرختِ ارسالی تازه (ریشه‌ی
    // موتاسیون) همیشه کامل پیموده می‌شود. محدوده‌اش همان زیردرخت است.
    while ((n = walker.nextNode())) {
      var c = getContainer(n);
      if (c && !seen.has(c)) {
        seen.add(c);
        applyEl(c);
      }
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
      var els = root.querySelectorAll("." + RTL_CLASS + ",." + FONT_CLASS + ",." + RTLFLEX_CLASS + ",." + RTLFLEXEND_CLASS + ",." + RTLDIR_CLASS + ",[" + DIR_MARK + "],[" + FAM_ATTR + "],[" + NUM_ATTR + "]"); // FIX-SR
      for (var i = 0; i < els.length; i++) clearEl(els[i]);
    } catch (e) {}
  }

  // FIX-NL: مکان‌نمای پیمایش پایدار — به‌جای «پیمایش سراسری با سقف نود»
  // که روی صفحات بزرگ همیشه همان بخشِ آغاز را می‌دید و دم هرگز پردازش
  // نمی‌شد، یک TreeWalker زنده نگه داشته می‌شود و هر تیک با بودجه‌ی
  // زمانی/نودی کمی جلو می‌رود؛ وقتی به پایان سند رسید از اول آغاز
  // می‌کند. یعنی با صفر سقفِ تعداد/حجم، «رسیدگیِ هر گره» تضمینی است —
  // فقط گاهی چند تیک طول می‌کشد.
  var cursorWalker = null;
  function ensureCursor() {
    if (!document.body) { cursorWalker = null; return null; }
    if (cursorWalker && cursorWalker.root === document.body) return cursorWalker;
    try {
      cursorWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: acceptNode });
    } catch (e) { cursorWalker = null; }
    return cursorWalker;
  }
  // گامِ پیمایش: تا budget نود یا بودجه‌ی زمانی جلو می‌رود.
  // خروجی true یعنی به پایان سند رسیدیم (چرخه‌ی بعدی از سر می‌گیرد).
  function cursorStep(budget) {
    var w = ensureCursor();
    if (!w) return true;
    var t0 = Date.now();
    var done = false;
    while (budget-- > 0) {
      var nx;
      try { nx = w.nextNode(); } catch (e) { nx = null; }
      if (!nx) { done = true; break; }
      var c = getContainer(nx);
      if (c) applyEl(c);
      if ((Date.now() - t0) > TICK_BUDGET_MS) break;
    }
    if (done) cursorWalker = null;
    return done;
  }

  function fieldsPass() {
    try {
      if (!document.body) return;
      var fields = document.body.querySelectorAll("input,textarea,[contenteditable]");
      var t0 = Date.now();
      for (var i = 0; i < fields.length && i < FIELD_CAP; i++) {
        applyField(fields[i]);
        if ((Date.now() - t0) > 8) break; // بقیه‌ی فیلدها در تیک بعدی
      }
    } catch (e) {}
  }

  function scanAll(boost) {
    if (!document.body) return;

    fieldsPass();

    // پیمایش اصلی:
    //  • boost (بوت/تاگل/سرریز — رخدادهای نادر): پاسِ کاملِ همگام تا تهِ
    //    سند — یعنی پس از هر سرریزِ صف، ریختن هیچ پیامی «برای همیشه»
    //    ممکن نیست؛ همگام است چون همان پاس، لنگرِ صحتِ نهایی است و
    //    تیک‌های بعدی فقط پوششِ افزایشی می‌دهند.
    //  • تیکِ معمولی: یک گامِ بودجه‌دارِ cursor (رسیدگی افزایشیِ ادامه‌دار).
    if (boost) {
      var guard = 0;
      while (!cursorStep(24000)) {
        if (++guard > 400) { // نرده‌ی امنیتِ خالص در برابر سندِ هیولای غیرمعمول
          scheduleSweepScan();
          break;
        }
      }
    } else {
      cursorStep(TICK_BUDGET_NODES);
    }

    // هرس شییدوهای مرده و اسکن زنده‌ها (حداکثر ۱۰ ریشه در هر نوبت)
    var live = [];
    shadowRoots.forEach(function (sr) {
      if (!sr.host || !sr.host.isConnected) shadowRoots.delete(sr);
      else live.push(sr);
    });
    for (var i = 0; i < live.length && i < 10; i++) scanRoot(live[i]);

    // هرَس فهرست علامت‌خورده‌ها — سیکل کامل (FIX-LK v1.4.0):
    // برشِ بودجه‌ای قبلی همیشه از سرِ Set حرکت می‌کرد و دمِ آن در صفحات
    // بسیار بزرگ هرگز هرَس نمی‌شد (نشت حافظه‌ی آهسته). isConnected
    // خواندنیِ ارزانی است؛ پیمایشِ کاملِ حتی ۲۰هزار ورودی فقط چند
    // میلی‌ثانیه هزینه دارد — پس تخلیه همیشه کامل انجام می‌شود.
    marked.forEach(function (el) {
      try {
        if (!el.isConnected) { marked.delete(el); return; }
        pruneStaleMark(el); // FIX-SM
      } catch (e) {}
    });

    discoverShadows();
  }

  // FIX-SM: خوددرمانی علامت‌های کهنه — بلوکی که دیگر ساختارِ
  // «بلوکِ متنی» ندارد (مثلاً با عوض‌شدن کلاس/استایلِ سایت display اش flex
  // شده — بدون هیچ موتاسیونِ DOM که ما ببینیم) علامتش پاک شود؛ وگرنه
  // rtldir کهنه روی یک ظرفِ فلکسِ تازه، محور لی‌آوت را می‌شکند (بازتولیدِ
  // زنده: wrapperهای تک‌فرزنده‌ی گیت‌هاب کل صفحه را آینه کرده بودند).
  // فقط دارندگانِ کلاسِ بلوکیِ غیریکدست — بلوک‌های uniform (P/LI/…)،
  // flexfragها و INLINEهای fallback مسیرِ قضاوتِ خود را دارند و دست‌نمی‌خورند.
  function pruneStaleMark(el) {
    var tg = el.tagName;
    if (!tg || UNIFORM_TAGS.has(tg) || SKIP.has(tg) || STOP.has(tg)) return;
    if (tg === "INPUT" || tg === "TEXTAREA") return;
    if (INLINE.has(tg)) return;
    var cl = el.classList;
    if (cl.contains(RTLFLEX_CLASS) || cl.contains(RTLFLEXEND_CLASS)) return;
    if (!(cl.contains(RTL_CLASS) || cl.contains(RTLDIR_CLASS))) return;
    if (!isTextBlock(el) || !isEligibleBlock(el)) { clearEl(el); return; }
    // گاردِ نسلِ ساختاری (mirror of CSS :has): rtldir کهنه روی المانی که
    // حالا فرزندِ ساختاری/بلوکی دارد باز چکانده شود — حتی اگر علامت از
    // پنجره‌ی هیدرات مانده باشد. (طبق اصلِ «جهت فقط برای برگِ متن»)
    if (cl.contains(RTLDIR_CLASS) && (hasStructuralDesc(el) || /^(LI|DT|DD|TD|TH)$/.test(tg))) {
      el.classList.remove(RTLDIR_CLASS);
      marked.add(el);
    }
  }

  // هرسِ پنجره‌دار روی تیکِ idle: نقطه‌ی ادامه‌ی چرخه نگه داشته می‌شود تا هر
  // تیک حداکثر PRUNE_TICK ورودی بازقضاوت شود (بدون کپیِ کامل و بدون خط در
  // هزینه‌ی هر سیکل روی صفحات بزرگ‌تر).
  var PRUNE_TICK = 220;
  var pruneOffset = 0;
  function pruneMarkedTickWindow() {
    var arr = Array.from(marked);
    var n = arr.length;
    if (!n) { pruneOffset = 0; return; }
    if (pruneOffset >= n) pruneOffset = 0;
    var end = pruneOffset + PRUNE_TICK; if (end > n) end = n;
    for (var i = pruneOffset; i < end; i++) {
      try {
        var el = arr[i];
        if (!el.isConnected) { marked.delete(el); continue; }
        pruneStaleMark(el);
      } catch (e) {}
    }
    pruneOffset = (end >= n) ? 0 : end;
  }

  // FIX-A: فقط المان‌هایی که پیش‌تر علامت گرفته‌اند بازارزیابی می‌شوند.
  // سریع، مستقل از بزرگی صفحه، و دو تاگل را هم‌پوش نگه می‌دارد:
  // هر المان با وضعیتِ فعلیِ هر دو پرچم دوباره کلاس می‌گیرد — حذف یکی
  // دیگری را نمی‌پرانَد.
  // FIX-NL: بودجه‌ی زمانی + باقیمانده — روی چت‌های بزرگ، بازارزیابیِ
  // علامت‌خورده‌ها دیگر در ۴۰ میلی‌ثانیه برش نمی‌خورد؛ مانده با
  // زنجیره‌ی تایمریِ سبک (نبودجه‌ی هر نوبت) تا آخر تخلیه می‌شود.
  var pendingReapply = new Set();
  var pendingTimer = null;
  function drainPendingReapply() {
    pendingTimer = null;
    if (!pendingReapply.size) return;
    var t0 = Date.now();
    var batch = Array.from(pendingReapply);
    for (var i = 0; i < batch.length; i++) {
      var el = batch[i];
      pendingReapply.delete(el);
      try {
        if (!el.isConnected) { marked.delete(el); continue; }
        applyEl(el);
      } catch (e) {}
      if ((Date.now() - t0) > REAPPLY_BUDGET_MS) break;
    }
    if (pendingReapply.size && !pendingTimer)
      pendingTimer = setTimeout(drainPendingReapply, 30);
  }
  function reapplyMarked() {
    if (!marked.size) return;
    var t0 = Date.now();
    var arr = Array.from ? Array.from(marked) : [];
    for (var i = 0; i < arr.length; i++) {
      var el = arr[i];
      try {
        if (!el.isConnected) { marked.delete(el); continue; }
        applyEl(el);
      } catch (e) {}
      if ((Date.now() - t0) > REAPPLY_BUDGET_MS) {
        // باقیمانده به‌تدریج تخلیه شود — هیچ عنصری جا نمی‌ماند
        for (var j = i + 1; j < arr.length; j++) pendingReapply.add(arr[j]);
        if (!pendingTimer) pendingTimer = setTimeout(drainPendingReapply, 30);
        return;
      }
    }
  }

  function applyAll() {
    if (!document.body) return;
    reapplyMarked();
    scanAll(true); // FIX-AA: تاگل فوری — یک پاسِ کامل
  }

  function hasAnyMark(el) {
    try {
      var cl = el.classList;
      return !!(cl && (cl.contains(RTL_CLASS) || cl.contains(FONT_CLASS) || cl.contains(RTLDIR_CLASS)
        || cl.contains(RTLFLEX_CLASS) || cl.contains(RTLFLEXEND_CLASS))) // FIX-SM
        || (el.hasAttribute && (el.hasAttribute(DIR_MARK) || el.hasAttribute(FAM_ATTR) || el.hasAttribute(NUM_ATTR)));
    } catch (e) { return false; }
  }

  /* ─────────────── MutationObserver (بهینه) ─────────────── */

  var queue = [];
  var queueTail = null;   // FIX-J: گره تکراریِ استریم را دوباره صف نکن
  var sweep = false;      // FIX-J: سرریز صف → اسکن جبرانی در تیک دوره‌ای
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
      // FIX-F/DC: ساختار یا ترتیب نمایش ممکن است عوض شده باشد →
      // کش justify و کش display بی‌اعتبار شود
      jcCache.delete(node);
      displayCache.delete(node);
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
      var anc = node.parentElement;
      var hops = 0, covered = false;
      while (anc && hops < 20) {
        if (qset.has(anc)) { covered = true; break; }
        anc = anc.parentElement;
        hops++;
      }
      if (!covered) out.push(node);
    }
    queue = [];
    queueTail = null;

    var done = 0;
    for (var i = 0; i < out.length && done < FLUSH_CAP; i++) {
      try { processNode(out[i]); } catch (e) {}
      done++;
    }
    // FIX-C: باقیمانده را برای فریم بعدی نگه دار — قبلاً بی‌صدا گم می‌شد!
    if (done < out.length) {
      queue = out.slice(done);
      if (queue.length) queueTail = queue[queue.length - 1];
      schedule();
    }
  }

  var observer;

  // FIX-K: اسکن جبرانیِ سرریز صف — دی‌بانس‌شده تا در طوفان موتاسیون
  // (مونت یک‌جای چت طولانی) فقط یک‌بارِ زودهنگام اجرا شود؛ با مکان‌نمای
  // v1.4.0 (بدون سقف نود) این اسکنِ boost قطعاً به انتهای سند می‌رسد.
  var sweepTimer = null;
  function scheduleSweepScan() {
    if (sweepTimer) return;
    sweepTimer = setTimeout(function () {
      sweepTimer = null;
      sweep = false;
      try { scanAll(true); } catch (e) {}
    }, 250);
  }

  try {
    observer = new MutationObserver(function (mutations) {
      dirty = true;
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === "characterData") {
          // FIX-J: استریم مداوم همان گره متن را دوباره و دوباره صف می‌کرد؛
          // پی‌درپی تکراری‌ها یک‌بار کافی‌اند، صف برای گره‌های جدید خالی می‌ماند
          if (m.target !== queueTail) queue.push(m.target), queueTail = m.target;
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
      // FIX-K (v1.3.0): سرریز صف — قبلاً صف با «queue.length = QUEUE_CAP»
      // قطع می‌شد؛ یعنی آخرین گره‌های تازه (پیام‌های انتهایی چت‌های طولانی!)
      // بی‌صدا دور ریخته می‌شدند و به‌علت سقف کوچک اسکن جبرانی، جبران هم
      // نمی‌شدند. حالا صف کامل خالی می‌شود (هیچ نیم‌کاره‌ای نمی‌ماند)،
      // sweep روشن می‌شود و اسکن جبرانیِ دی‌بانس‌شده زودهنگام اجرا می‌گردد.
      if (queue.length > QUEUE_CAP) {
        queue.length = 0;
        queueTail = null;
        sweep = true;
        scheduleSweepScan();
      }
      schedule();
    });
  } catch (e) { observer = null; }

  /* ─────────────── اسکن دوره‌ای سبک ─────────────── */

  var interval = null;
  function startInterval() {
    if (interval) return;
    interval = setInterval(function () {
      if (document.hidden) return;
      drainPendingReapply(); // مانده‌ی بازارزیابی (هر سیکل اگر هست)
      if (dirty || sweep) {   // FIX-J: sweep حتی بدون dirty جدید
        dirty = false;
        if (sweep) { sweep = false; scanAll(true); }  // سرریز صف: boost
        else scanAll(false);
      } else {
        cursorStep(TICK_BUDGET_NODES); // پیمایش آرامِ ادامه‌دار صفحه
        pruneMarkedTickWindow(); // FIX-SM: بازقضاوتِ پنجره‌دار علامت‌ها
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

  function sanitizeFontId(id) {
    try { return fontById(String(id)).id; } catch (e) { return FONT_DEFAULT_ID; }
  }

  function readPrefs(cb) {
    try {
      var def = { rtlEnabled: true, fontEnabled: true, pfDigits: false };
      def[FONT_STORAGE_KEY] = FONT_DEFAULT_ID;
      chrome.storage.sync.get(def, function (prefs) {
        RTL_ENABLED  = !!prefs.rtlEnabled;
        FONT_ENABLED = !!prefs.fontEnabled;
        DIGITS_ENABLED = !!prefs.pfDigits;
        CURRENT_FONT_ID = sanitizeFontId(prefs[FONT_STORAGE_KEY]);
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
    chrome.storage.onChanged.addListener(function (changes, areaName) {
      // FIX-AR: فقط ناحیه‌ی sync — نوشته‌ی ناحیه‌ی local
      // (مثل کشِ «آخرین ریلیز») هرگز نباید کارِ صفحه را تحریک کند.
      if (areaName && areaName !== "sync") return;
      if (changes.rtlEnabled  !== undefined) RTL_ENABLED  = !!changes.rtlEnabled.newValue;
      if (changes.fontEnabled !== undefined) FONT_ENABLED = !!changes.fontEnabled.newValue;
      // v1.4.0: تاگل اعداد — اعمال/بازگردانی زنده از مسیر applyEl
      if (changes[DIGITS_KEY] !== undefined) DIGITS_ENABLED = !!changes[DIGITS_KEY].newValue;
      // FIX-G: فونت → stylesheetهای زنده بازنویسی می‌شوند و
      // کلاس خانواده‌ی المان‌های علامت‌خورده دوباره سنجیده می‌شود
      if (changes[FONT_STORAGE_KEY] !== undefined) {
        CURRENT_FONT_ID = sanitizeFontId(changes[FONT_STORAGE_KEY].newValue);
        refreshFontSheets();
      }
      scheduleApplyAll();
    });
  } catch (e) {}

  /* ─────────────── بوت ─────────────── */

  function boot() {
    injectFontFace();
    try { document.addEventListener("input", inputHandler, true); } catch (e) {}
    try { document.addEventListener("beforeinput", beforeInputHandler, true); } catch (e) {} // FIX-KB
    try {
      if (observer && (document.documentElement || document)) {
        observer.observe(document.documentElement || document, {
          childList: true, subtree: true, characterData: true
        });
      }
    } catch (e) {}

    if (document.body) {
      // اسکن اولیه را کمی به‌تأخیر بینداز تا رندر صفحه قفل نشود
      setTimeout(function () { scanAll(true); }, 150);
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        setTimeout(function () { scanAll(true); }, 0);
      }, { once: true });
    }
    startInterval();
  }

  readPrefs(boot);

})();
