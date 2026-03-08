# Crypto Tracker Extension 🚀

![Crypto Tracker](icons/icon128.png)

Tarayıcınız üzerinden gerçek zamanlı kripto para fiyatlarını, piyasa değerlerini, 24 saatlik hacimleri ve mini grafikleri takip etmenizi sağlayan şık ve modern bir Chrome eklentisidir. Işık hızında ve kesintisiz (rate limitsiz) veri çekmek için **Binance Public API** altyapısını kullanır.

(English explanation is below)

---

## 🌟 Özellikler

*   **Gerçek Zamanlı Veri:** Kripto fiyatlarını doğrudan Binance alım-satım tahtasından anlık olarak çeker.
*   **Çift Para Birimi Desteği:** **USD** ve **TRY** (Türk Lirası) arasında tek tıkla geçiş yapın. Doğru Türk Lirası fiyatlaması için Binance'ın anlık `USDTTRY` paritesini baz alarak hesaplama yapar.
*   **Detaylı Analiz:** Takip ettiğiniz herhangi bir coine tıklayarak 24 saatlik En Yüksek/En Düşük fiyatları, Piyasa Değerini (Market Cap), 24 saatlik hacmi ve o güne ait trend çizgi grafiğini görüntüleyin.
*   **Sınırsız Kullanım (No Rate Limits):** Binance API'si ve güçlü 1 dakikalık `localStorage` çerez sistemi sayesinde, CoinGecko veya CoinCap gibi ücretsiz API'lerde sıkça yaşanan "429 Too Many Requests (Çok fazla istek)" çökme hatalarını asla yaşamazsınız.
*   **Özelleştirilebilir Liste:** En popüler kripto paraları listenize kolayca ekleyin veya çıkarın. Yaptığınız değişiklikler `chrome.storage.sync` ile Google hesabınıza kaydedilir.
*   **Modüler Mimari:** Tamamen TypeScript ile kodlanmış olup; Arayüz (UI), Durum (State) ve API katmanları birbirlerinden izole edilerek temiz (clean code) bir proje mimarisi oluşturulmuştur.

## 🛠️ Kurulum
1. Projeyi bilgisayarınıza indirin.
2. Chromium tabanlı (Chrome, Brave, Opera) tarayıcınızı açın.
3. Adres çubuğuna `chrome://extensions/` yazın.
4. Sağ üstteki **Geliştirici modunu** (Developer mode) aktif edin.
5. **Paketlenmemiş öğe yükle** (Load unpacked) butonuna tıklayın ve indirmiş olduğunuz klasörü seçin.
6. Eklenti simgesi sağ üst köşede belirecektir!

---

## 🌟 Features

A sleek, modern Chrome extension for tracking real-time cryptocurrency prices, market caps, 24-hour volumes, and charts directly from your browser. Powered by the **Binance Public API** for lightning-fast, rate-limit-free data fetching.

*   **Real-time Data:** Fetches live cryptocurrency prices directly from the Binance trading engine.
*   **Dual Currency Support:** Seamlessly switch between **USD** and **TRY** (Turkish Lira). Uses Binance's live `USDTTRY` trading pair to provide accurate conversion rates in real-time.
*   **Detailed Analytics:** Click on any tracked coin to view its 24-hour High/Low, Market Cap, 24-hour Volume, and a minimal 24h SVG sparkline chart.
*   **Zero Rate Limits:** By utilizing the Binance Public API and a robust 1-minute `localStorage` cache, the dreaded "429 Too Many Requests" errors found in other free APIs (like CoinGecko) are completely eliminated.
*   **Customizable List:** Add or remove top cryptocurrencies easily.
*   **Persistent Storage:** Your selected coins and currency preferences are saved across browser sessions using `chrome.storage.sync`.
*   **Modular Architecture:** Written in strict TypeScript with a decoupled UI-State-API architecture for easy maintenance and scalability.

## 🛠️ Installation 
1. Download or clone this repository.
2. Run `npm install` and then `npm run build` (or `npx tsc`) to compile the TypeScript files (if you are building from source).
3. Open your Chromium-based browser (Google Chrome, Brave, Edge).
4. Navigate to the extensions page (`chrome://extensions/`).
5. Enable **Developer Mode** in the top right corner.
6. Click **Load unpacked** and select the root directory of this project.
7. The extension icon will appear in your toolbar!

---

## ⚙️ Built With / Teknolojiler
*   HTML5 / CSS3 (Vanilla)
*   TypeScript
*   Chrome Extensions API (Manifest V3)
*   **Binance API** (For Tickers and Klines)

---
*Created with by Ulaş*
