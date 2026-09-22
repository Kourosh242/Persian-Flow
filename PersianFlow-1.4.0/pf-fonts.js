/* ============================================================
   Persian Flow v1.2.0 — رجیستری مشترک فونت‌ها (منبع واحد)
   ------------------------------------------------------------
   این فایل هم در content_scripts (قبل از content.js) و هم در
   پاپ‌آپ (قبل از popup.js) لود می‌شود تا تعریف فونت‌ها فقط
   یک‌جا نگه داشته شود و هرگز بین دوتا drift رخ ندهد.
   هر فونت: شناسه، نام فارسی برای UI، خانواده‌ی CSS، فایل‌های
   woff2 (وزن‌ها) و این‌که آیا فایل variable است یا خیر.
   همه‌ی فونت‌ها متن‌باز (SIL Open Font License / public domain)
   و از مخازن رسمی طراحان دریافت شده‌اند؛ لایسنس‌ها در fonts/licenses.
   ============================================================ */
(function (root) {
  "use strict";

  var FONTS = [
    {
      id: "vazirmatn",
      faName: "وزیرمتن",
      family: "Vazirmatn",
      variable: true,
      isDefault: true,
      designer: "صابر راستی‌کردار",
      faces: [{ file: "Vazirmatn-Variable.woff2", weight: "100 900" }],
    },
    {
      id: "estedad",
      faName: "استعداد",
      family: "Estedad",
      variable: true,
      designer: "امین عبدی",
      faces: [{ file: "Estedad-VF.woff2", weight: "100 900" }],
    },
    {
      id: "mikhak",
      faName: "میخک",
      family: "Mikhak",
      variable: true,
      designer: "امین عبدی",
      faces: [{ file: "Mikhak-VF.woff2", weight: "100 900" }],
    },
    {
      id: "sahel",
      faName: "ساحل",
      family: "Sahel",
      variable: true,
      designer: "صابر راستی‌کردار",
      faces: [{ file: "Sahel-VF.woff2", weight: "100 900" }],
    },
    {
      id: "samim",
      faName: "صمیم",
      family: "Samim",
      variable: false,
      designer: "صابر راستی‌کردار",
      faces: [
        { file: "Samim.woff2", weight: "400" },
        { file: "Samim-Bold.woff2", weight: "700" },
      ],
    },
    {
      id: "shabnam",
      faName: "شبنم",
      family: "Shabnam",
      variable: false,
      designer: "صابر راستی‌کردار",
      faces: [
        { file: "Shabnam.woff2", weight: "400" },
        { file: "Shabnam-Bold.woff2", weight: "700" },
      ],
    },
    {
      id: "parastoo",
      faName: "پرستو",
      family: "Parastoo",
      variable: false,
      designer: "صابر راستی‌کردار",
      faces: [
        { file: "Parastoo.woff2", weight: "400" },
        { file: "Parastoo-Bold.woff2", weight: "700" },
      ],
    },
    {
      id: "nahid",
      faName: "ناهید",
      family: "Nahid",
      variable: false,
      designer: "صابر راستی‌کردار",
      faces: [{ file: "Nahid.woff2", weight: "400" }],
    },
    {
      id: "gandom",
      faName: "گندم",
      family: "Gandom",
      variable: false,
      designer: "صابر راستی‌کردار",
      faces: [{ file: "Gandom.woff2", weight: "400" }],
    },
    {
      id: "tanha",
      faName: "تنها",
      family: "Tanha",
      variable: false,
      designer: "صابر راستی‌کردار",
      faces: [{ file: "Tanha.woff2", weight: "400" }],
    },
    {
      id: "behdad",
      faName: "بهداد",
      family: "Behdad",
      variable: false,
      designer: "font-store",
      faces: [{ file: "Behdad-Regular.woff2", weight: "400" }],
    },
    /* ── v1.4.0: چهار فونت تازه (از ۱۱ به ۱۵) — سبک‌های محبوب جامعه که
       بین سنس‌های موجود نبودند: نسخِ عناوین، رترو، نسخ کلاسیک و نستعلیق.
       هر چهار SIL OFL با پوشش کامل فارسی (پ چ ژ گ + اعداد ۰ تا ۹) و لاتین. */
    {
      id: "katibeh",
      faName: "کاتیبه",
      family: "Katibeh",
      variable: false,
      designer: "برنا ایزدپناه",
      faces: [{ file: "Katibeh.woff2", weight: "400" }],
    },
    {
      id: "lalezar",
      faName: "لاله‌زار",
      family: "Lalezar",
      variable: false,
      designer: "برنا ایزدپناه",
      faces: [{ file: "Lalezar.woff2", weight: "400" }],
    },
    {
      id: "amiri",
      faName: "آمیتا",
      family: "Amiri",
      variable: false,
      designer: "خالد حسنی (پروژه‌ی آمیتا)",
      faces: [{ file: "Amiri.woff2", weight: "400" }],
    },
    {
      id: "nastaliq",
      faName: "نستعلیق",
      family: "Noto Nastaliq Urdu",
      variable: true,
      designer: "تیم Noto گوگل",
      faces: [{ file: "NotoNastaliqUrdu.woff2", weight: "400 700" }],
    },
  ];

  // پشته‌ی خانواده‌ی CSS برای هر فونت: خودش، سپس وزیرمتن (پوشش گلیف)،
  // سپس فونت‌های سیستمی و در انتها ایموجی‌ها — ترتیب مهم است.
  function familyStack(font) {
    return "'" + font.family + "', 'Vazirmatn', Tahoma, 'Segoe UI', sans-serif,"
      + " 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji'";
  }

  function byId(id) {
    for (var i = 0; i < FONTS.length; i++) if (FONTS[i].id === id) return FONTS[i];
    return FONTS[0]; // شناسه‌ی ناشناخته → پیش‌فرض، هرگز کرش نکن
  }

  root.PF_FONTS = FONTS;
  root.PF_FONT_FAMILY_STACK = familyStack;
  root.PF_FONT_BY_ID = byId;
  root.PF_FONT_DEFAULT_ID = FONTS[0].id;
})(typeof window !== "undefined" ? window : globalThis);
