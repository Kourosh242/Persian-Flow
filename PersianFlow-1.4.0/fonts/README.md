# فونت‌های بسته‌بندی‌شده در Persian Flow

همه‌ی فونت‌های این پوشه **متن‌باز** و از **مخازن رسمی طراحان** دریافت شده‌اند.
لایسنس کامل هر فونت در پوشه‌ی [`licenses/`](./licenses/) کنار آن است.
هیچ فونت تجاری‌ای در این پوشه نیست؛ فونت‌های FontIran/مایکروسافت عمداً بسته‌بندی نشده‌اند.

**۱۵ خانواده‌ی فونت در ۱۸ فایل woff2 (~۱.۲۵MB)** — اما در زمانِ اجرا **فقط فونتِ فعال لود می‌شود**، پس هزینه‌ی شبکه/حافظه‌ی ۱۴ فونتِ دیگر صفر است.

| فونت | فایل(ها) | طراح / منبع | لایسنس |
|---|---|---|---|
| وزیرمتن (Vazirmatn) — پیش‌فرض | `Vazirmatn-Variable.woff2` | صابر راستی‌کردار — [rastikerdar/vazirmatn](https://github.com/rastikerdar/vazirmatn) | SIL OFL 1.1 |
| استعداد (Estedad) | `Estedad-VF.woff2` | امین عبدی — [aminabedi68/Estedad](https://github.com/aminabedi68/Estedad) | SIL OFL 1.1 |
| میخک (Mikhak) | `Mikhak-VF.woff2` | امین عبدی — [aminabedi68/Mikhak](https://github.com/aminabedi68/Mikhak) | SIL OFL 1.1 |
| ساحل (Sahel) | `Sahel-VF.woff2` | صابر راستی‌کردار — [rastikerdar/sahel-font](https://github.com/rastikerdar/sahel-font) | SIL OFL 1.1 |
| صمیم (Samim) | `Samim.woff2`, `Samim-Bold.woff2` | صابر راستی‌کردار — [rastikerdar/samim-font](https://github.com/rastikerdar/samim-font) | SIL OFL 1.1 |
| شبنم (Shabnam) | `Shabnam.woff2`, `Shabnam-Bold.woff2` | صابر راستی‌کردار — [rastikerdar/shabnam-font](https://github.com/rastikerdar/shabnam-font) | SIL OFL 1.1 |
| پرستو (Parastoo) | `Parastoo.woff2`, `Parastoo-Bold.woff2` | صابر راستی‌کردار — [rastikerdar/parastoo-font](https://github.com/rastikerdar/parastoo-font) | SIL OFL 1.1 |
| ناهید (Nahid) | `Nahid.woff2` | صابر راستی‌کردار — [rastikerdar/nahid-font](https://github.com/rastikerdar/nahid-font) | متن‌باز (public domain + Bitstream/DejaVu) |
| گندم (Gandom) | `Gandom.woff2` | صابر راستی‌کردار — [rastikerdar/gandom-font](https://github.com/rastikerdar/gandom-font) | SIL OFL 1.1 |
| تنها (Tanha) | `Tanha.woff2` | صابر راستی‌کردار — [rastikerdar/tanha-font](https://github.com/rastikerdar/tanha-font) | متن‌باز (public domain + Bitstream/DejaVu) |
| بهداد (Behdad) | `Behdad-Regular.woff2` | font-store — [font-store/BehdadFont](https://github.com/font-store/BehdadFont) | SIL OFL 1.1 |
| کاتیبه (Katibeh) — *جدید v1.4.0* | `Katibeh.woff2` | KB-Studio (برنا ایزدپناه) — [k-b-studio.com](http://www.k-b-studio.com)، Lasse Fister و Eduardo Tunni | SIL OFL 1.1 |
| لاله‌زار (Lalezar) — *جدید v1.4.0* | `Lalezar.woff2` | برنا ایزدپناه — [BornaIz/Lalezar](https://github.com/BornaIz/Lalezar) | SIL OFL 1.1 |
| آمیری (Amiri) — *جدید v1.4.0* | `Amiri.woff2` | خالد حسنی — پروژه‌ی آمیری [aliftype/amiri](https://github.com/aliftype/amiri) | SIL OFL 1.1 |
| نستعلیق (Noto Nastaliq Urdu) — *جدید v1.4.0* | `NotoNastaliqUrdu.woff2` | پروژه‌ی Noto گوگل — [notofonts/nastaliq](https://github.com/notofonts/nastaliq) | SIL OFL 1.1 |

> نکته‌ی حقوقی: فونت‌های تجاریِ محبوب (ایران‌سنس، ایران‌یکان، دانا، یکان‌بخ تجاری،
> بی‌نازنین و…) به‌دلیل محدودیت بازتوزیع **عمداً** در این افزونه قرار نگرفته‌اند.
> **ناهید** جایگزین متن‌بازِ ظاهر محبوب بی‌نازنین است.

## افزودن فونت جدید

برای هر فونت تازه این چهار جا باید هم‌گام بمانند (تست jsdom عدمِ drift را بررسی می‌کند):

1. یک ورودی در رجیستری [`../pf-fonts.js`](../pf-fonts.js) (شناسه، نام فارسی، خانواده‌ی CSS، فایل‌ها و وزن‌ها).
2. کلاس خانواده‌ی `__pf-f-<id>__` در [`../styles.css`](../styles.css) **و** در کلونِ CSS داخل `../content.js` (برای Shadow DOM).
3. فایل(های) woff2 در همین پوشه + لایسنس در [`licenses/`](./licenses/).
4. یک سطر در همین جدول.
