import Link from "next/link"
import { headers } from "next/headers"
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config"

const notFoundTexts: Record<string, { title: string; message: string; button: string }> = {
  en: { title: "Page Not Found", message: "The page you're looking for doesn't exist or has been moved.", button: "Go to Homepage" },
  zh: { title: "页面未找到", message: "您要查找的页面不存在或已被移动。", button: "返回首页" },
  hi: { title: "पृष्ठ नहीं मिला", message: "आप जिस पृष्ठ की तलाश कर रहे हैं वह मौजूद नहीं है।", button: "होमपेज पर जाएं" },
  es: { title: "Página no encontrada", message: "La página que buscas no existe o ha sido movida.", button: "Ir al inicio" },
  ar: { title: "الصفحة غير موجودة", message: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.", button: "الذهاب للصفحة الرئيسية" },
  fr: { title: "Page non trouvée", message: "La page que vous recherchez n'existe pas ou a été déplacée.", button: "Retour à l'accueil" },
  de: { title: "Seite nicht gefunden", message: "Die gesuchte Seite existiert nicht oder wurde verschoben.", button: "Zur Startseite" },
  ja: { title: "ページが見つかりません", message: "お探しのページは存在しないか、移動されました。", button: "ホームへ戻る" },
  ko: { title: "페이지를 찾을 수 없음", message: "찾고 계신 페이지가 존재하지 않거나 이동되었습니다.", button: "홈으로 이동" },
  pt: { title: "Página não encontrada", message: "A página que você procura não existe ou foi movida.", button: "Ir para o início" },
  ru: { title: "Страница не найдена", message: "Страница, которую вы ищете, не существует или была перемещена.", button: "На главную" },
  it: { title: "Pagina non trovata", message: "La pagina che stai cercando non esiste o è stata spostata.", button: "Vai alla home" },
  tr: { title: "Sayfa bulunamadı", message: "Aradığınız sayfa mevcut değil veya taşınmış.", button: "Ana sayfaya git" },
  vi: { title: "Không tìm thấy trang", message: "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.", button: "Về trang chủ" },
  th: { title: "ไม่พบหน้า", message: "ไม่พบหน้าที่คุณกำลังค้นหาหรือถูกย้ายไปแล้ว", button: "ไปหน้าแรก" },
  id: { title: "Halaman tidak ditemukan", message: "Halaman yang Anda cari tidak ada atau telah dipindahkan.", button: "Ke beranda" },
  pl: { title: "Strona nie znaleziona", message: "Strona, której szukasz, nie istnieje lub została przeniesiona.", button: "Przejdź do strony głównej" },
  uk: { title: "Сторінку не знайдено", message: "Сторінка, яку ви шукаєте, не існує або була переміщена.", button: "На головну" },
}

function getLocaleFromHeaders(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale

  const browserLocale = acceptLanguage.split(",")[0].split("-")[0].toLowerCase()

  if (locales.includes(browserLocale as Locale)) {
    return browserLocale as Locale
  }

  return defaultLocale
}

export default async function NotFound() {
  const headersList = await headers()
  const acceptLanguage = headersList.get("accept-language")
  const locale = getLocaleFromHeaders(acceptLanguage)
  const texts = notFoundTexts[locale] || notFoundTexts.en

  return (
    <div className="bg-dark text-zinc-300 min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-medium text-white mb-2">{texts.title}</h2>
        <p className="text-zinc-500 mb-8 max-w-md">
          {texts.message}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dark rounded-full font-medium hover:bg-zinc-200 transition-colors"
        >
          {texts.button}
        </Link>
      </div>
    </div>
  )
}
