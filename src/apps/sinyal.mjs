// Sinyal: everything the website says about the app. Legal texts are HTML
// fragments in content/sinyal/<doc>.<locale>.html.

export default {
  slug: 'sinyal',
  name: 'Sinyal',
  icon: '/apps/sinyal/icon-256.webp',
  // The app's own colours, used for its tile and its page header.
  theme: { bg: '#15121A', raised: '#1F1A23', text: '#F4EEE8', muted: '#ADA29B', accent: '#DCAED0' },
  // Store URLs go here once the listings are live. Until then the page says "coming soon".
  stores: {
    appStore: null, // in App Review since 2026-11-15
    googlePlay: 'https://play.google.com/store/apps/details?id=com.fernislabs.sinyal',
  },
  legalUpdated: '2026-10-25',
  docs: ['privacy', 'terms', 'delete-account'],

  copy: {
    tr: {
      tagline: 'Fotoğrafınızın altyazısı.',
      summary: 'Bir fotoğraf ya da kısa bir videodaki görünür beden dili işaretlerini yapay zekâ yardımıyla yorumlar ve bunu güler yüzlü bir dille anlatır.',
      description: 'Sinyal, fotoğraf ve kısa videolardaki görünür beden dili işaretlerini yapay zekâ ile yorumlayan mobil uygulamadır.',
      features: [
        ['Bedeninizin altyazısı', 'Omuzlarınız, elleriniz ve bakışınız kendi repliğini söyler. Her kartın arkasında görünen işaret ve olası anlamı yazar.'],
        ['Bedenlerinizin sohbeti', 'İki kişinin fotoğrafları ya da 10 saniyelik bir video: buluştuğunuz ve ayrıştığınız yerler, bir uyum yorumu.'],
        ['Sözlük ve Sinyal Avı', 'Kısa derslerle beden dilini öğrenin, gerçek fotoğraflarda işaret avlayıp sezon sıralamasında yarışın.'],
        ['AI koç', 'Pro’da raporunuz hakkında soru sorabileceğiniz bir koç.'],
      ],
      plans: [
        ['Ücretsiz', 'Günde 3 analiz, her raporun ilk replikleri ve bir ücretsiz tam rapor.'],
        ['Pro', 'Tüm replikler ve nedenleri, gerçek tercüme, AI koç, daha yüksek günlük sınır ve geçmiş raporları yeniden açma. Haftalık ya da yıllık, otomatik yenilenen abonelik.'],
      ],
      privacy: [
        'Fotoğraf ve videolarınızı saklamayız; yalnızca analiz için kullanılırlar.',
        'Her analizden önce onayınız istenir.',
        'Reklam yok, izleme yok, verileriniz satılmaz.',
        'Hesabınızı uygulamadan ya da bu sitedeki adımlarla silebilirsiniz.',
      ],
      notice: 'Sinyal yalnızca görünür işaretlere dayalı yorumlar sunar. Yalan, duygu veya niyet hakkında kesin tespit yapmaz; tıbbi ya da psikolojik tavsiye yerine geçmez. 18 yaş ve üzeri içindir.',
      docTitles: { privacy: 'Gizlilik Politikası', terms: 'Kullanım Koşulları', 'delete-account': 'Hesap Silme' },
      faq: [
        ['Fotoğraflarım saklanıyor mu?', 'Hayır. Seçtiğiniz fotoğraf ya da video şifreli bağlantıyla sunucumuza, oradan analiz için Google Gemini’ye gönderilir ve tarafımızca saklanmaz. Rapor yalnızca metindir ve telefonunuzda kalır; isterseniz hesabınıza yedekleyebilirsiniz.'],
        ['Analiz neden başlamıyor?', 'Ücretsiz planda günde 3 analiz hakkınız vardır ve sayaç her gün UTC gece yarısı yenilenir. E-postayla kayıt olduysanız önce e-posta adresinizi doğrulamanız gerekir. Bağlantınız koptuysa aynı analizi yeniden deneyin; tekrar sayılmaz.'],
        ['Pro aboneliğimi nasıl iptal ederim?', 'Abonelikler mağaza hesabınızdan yönetilir. iPhone’da: Ayarlar → adınız → Abonelikler → Sinyal. Android’de: Google Play → profil → Ödemeler ve abonelikler → Abonelikler → Sinyal. İptal, mevcut dönemin sonunda geçerli olur; dönem bitmeden en az 24 saat önce iptal ederseniz yenilenmez.'],
        ['Telefon değiştirdim, Pro görünmüyor.', 'Aynı hesapla giriş yapın, ardından Ayarlar → Plan ve kullanım → Satın alımları geri yükle’ye dokunun. Pro, satın alırken kullandığınız mağaza hesabıyla aynı hesapta olmalıdır.'],
        ['İade alabilir miyim?', 'Ödemeleri Apple ve Google aldığı için iade talepleri de onlara yapılır: iPhone’da reportaproblem.apple.com, Android’de Google Play’in sipariş geçmişi.'],
        ['Sonuç yanlış ya da uygunsuz geldi.', 'Her rapor ekranının altındaki “Uygunsuz veya hatalı sonucu bildir” bağlantısını kullanın. Bize yalnızca analiz kimliği ve model sürümü gelir; fotoğraf ya da rapor metni gönderilmez.'],
        ['Hesabımı nasıl silerim?', 'Uygulamada Ayarlar → Hesap → Hesabı sil. Uygulamaya erişemiyorsanız Hesap Silme sayfasındaki e-posta yolunu kullanın.'],
      ],
    },
    en: {
      tagline: 'Your photo’s subtitles.',
      summary: 'Sinyal uses AI to interpret visible body-language cues in a photo or a short video, and tells it with a smile.',
      description: 'Sinyal is a mobile app that uses AI to interpret visible body-language cues in photos and short videos.',
      features: [
        ['Your body’s subtitles', 'Your shoulders, hands and gaze each say a line. Turn a card over to see the visible cue and what it may mean.'],
        ['Your bodies’ chat', 'Photos of two people, or a 10-second video: where you meet, where you differ, and a compatibility reading.'],
        ['Dictionary and Sinyal Avı', 'Learn body language in short lessons, then hunt for cues in real photos and climb the season ranking.'],
        ['AI coach', 'With Pro, ask a coach questions about your report.'],
      ],
      plans: [
        ['Free', '3 analyses a day, the first lines of every report and one free full report.'],
        ['Pro', 'Every line and its why, the real translation, the AI coach, a higher daily limit and reopening past reports. Weekly or yearly auto-renewing subscription.'],
      ],
      privacy: [
        'We do not store your photos or videos; they are used only for the analysis.',
        'The app asks for your consent before every analysis.',
        'No ads, no tracking, your data is not sold.',
        'Delete your account in the app or with the steps on this site.',
      ],
      notice: 'Sinyal only offers interpretations of visible cues. It does not detect lies, emotions or intent with certainty, and it is not medical or psychological advice. For ages 18 and over.',
      docTitles: { privacy: 'Privacy Policy', terms: 'Terms of Use', 'delete-account': 'Delete Your Account' },
      faq: [
        ['Are my photos stored?', 'No. The photo or video you choose is sent over an encrypted connection to our server and on to Google Gemini for the analysis, and we do not keep it. The report is text only and stays on your phone; you can back it up to your account if you want.'],
        ['Why won’t my analysis start?', 'The free plan includes 3 analyses a day, and the count resets at midnight UTC. If you signed up with email, verify your address first. If your connection dropped, try the same analysis again; it is not counted twice.'],
        ['How do I cancel Pro?', 'Subscriptions are managed in your store account. On iPhone: Settings → your name → Subscriptions → Sinyal. On Android: Google Play → profile → Payments & subscriptions → Subscriptions → Sinyal. Cancelling takes effect at the end of the current period; cancel at least 24 hours before it ends to stop the renewal.'],
        ['I changed phones and Pro is missing.', 'Sign in with the same account, then tap Settings → Plan and usage → Restore purchases. Pro must be on the same store account you bought it with.'],
        ['Can I get a refund?', 'Apple and Google take the payments, so refunds are requested from them: reportaproblem.apple.com on iPhone, or your Google Play order history on Android.'],
        ['A result was wrong or inappropriate.', 'Use “Report an inappropriate or wrong result” at the bottom of every report. We only receive the analysis ID and model version; no photo or report text is sent.'],
        ['How do I delete my account?', 'In the app: Settings → Account → Delete account. If you can’t open the app, use the email route on the Delete Your Account page.'],
      ],
    },
  },
};
