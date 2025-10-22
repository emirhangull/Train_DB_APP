# Tren Bileti Satış ve Rezervasyon Sistemi - Frontend

React tabanlı kullanıcı arayüzü.

## 🚀 Kurulum

### 1. Node.js ve npm Kurulumu

Eğer yüklü değilse, [Node.js](https://nodejs.org/) indirip kurun (npm ile birlikte gelir).

### 2. React Uygulamasını Oluştur

```powershell
cd frontend
npx create-react-app tren-rezervasyon-ui
cd tren-rezervasyon-ui
```

### 3. Gerekli Paketleri Yükle

```powershell
npm install axios react-router-dom
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install date-fns
```

### 4. Backend API'yi Başlat

Frontend çalışmadan önce backend'in çalışıyor olması gerekir:

```powershell
cd ../../backend
python app.py
```

### 5. Frontend'i Başlat

```powershell
cd ../frontend/tren-rezervasyon-ui
npm start
```

Uygulama http://localhost:3000 adresinde açılacaktır.

## 📦 Kullanılan Teknolojiler

- **React 18** - UI Framework
- **React Router** - Sayfa yönlendirme
- **Material-UI (MUI)** - UI Component kütüphanesi
- **Axios** - HTTP istekleri
- **date-fns** - Tarih işlemleri

## 🎨 Özellikler

### Kullanıcı Arayüzü
- ✅ Ana sayfa / Sefer arama
- ✅ Sefer sonuçları listeleme
- ✅ Koltuk seçimi
- ✅ Yolcu bilgileri formu
- ✅ Rezervasyon özeti
- ✅ Ödeme ekranı (mock)
- ✅ PNR ile bilet sorgulama

### Yönetici Paneli
- ✅ İstasyon yönetimi (CRUD)
- ✅ Tren yönetimi (CRUD)
- ✅ Sefer yönetimi (CRUD)
- ✅ Rezervasyon izleme
- ✅ Raporlar

## 📁 Proje Yapısı

```
src/
├── components/         # Tekrar kullanılabilir componentler
│   ├── Navbar.js
│   ├── Footer.js
│   └── ...
├── pages/             # Sayfa componentleri
│   ├── HomePage.js
│   ├── SearchResults.js
│   ├── SeatSelection.js
│   ├── BookingForm.js
│   ├── PaymentPage.js
│   ├── MyTickets.js
│   └── admin/
│       ├── Dashboard.js
│       ├── StationManagement.js
│       ├── TrainManagement.js
│       └── Reports.js
├── services/          # API servis dosyaları
│   └── api.js
├── utils/             # Yardımcı fonksiyonlar
│   └── helpers.js
├── App.js             # Ana uygulama
└── index.js           # Giriş noktası
```

## 🔗 API Entegrasyonu

Backend API: `http://localhost:5000`

Tüm API çağrıları `src/services/api.js` dosyasında merkezi olarak yönetilir.

## 🎯 Kullanım

### Bilet Alma Akışı
1. Ana sayfada kalkış/varış şehri ve tarih seçin
2. Uygun seferleri görüntüleyin
3. Sefer seçin ve boş koltukları görün
4. Koltuk seçin
5. Yolcu bilgilerini girin
6. Rezervasyon özetini kontrol edin
7. Ödeme yapın (mock)
8. PNR kodunu alın

### Bilet Sorgulama
1. "Biletlerim" sayfasına gidin
2. PNR kodunu girin
3. Bilet detaylarını görüntüleyin

### Yönetici İşlemleri
1. Admin paneline gidin
2. İstasyon/Tren/Sefer ekleyin, düzenleyin veya silin
3. Raporları görüntüleyin

## 🛠️ Geliştirme

```powershell
# Development mode
npm start

# Production build
npm run build

# Test
npm test
```

## 📝 Notlar

- Backend'in http://localhost:5000 adresinde çalışıyor olması gerekir
- CORS zaten backend'de etkinleştirilmiştir
- Mock ödeme sistemi kullanılmaktadır (gerçek ödeme entegrasyonu yok)

## 🐛 Sorun Giderme

**Problem:** "Failed to fetch" hatası
- **Çözüm:** Backend'in çalıştığından emin olun

**Problem:** CORS hatası
- **Çözüm:** Backend'de Flask-CORS yüklü olmalı

**Problem:** Port çakışması
- **Çözüm:** `package.json`'da port değiştirin veya çakışan uygulamayı kapatın
