# 🚂 Tren Bileti Satış ve Rezervasyon Sistemi

Bilgisayar Mühendisliği Veritabanı Dersi Projesi

## 👥 Proje Ekibi

- **Emirhan Gül** - 221101073
- **Onur Erçen** - 231101035
- **Nisa Eylül Çintiriz** - 221101063

## 📋 Proje Hakkında

Bu proje, demiryolu işletmelerinde kullanılabilecek temel bir tren bileti satış ve rezervasyon sistemini gerçekleştirmektedir. Kullanıcılar sefer arayabilir, koltuk seçebilir ve bilet satın alabilir. Sistem aynı zamanda yönetici paneli ile istasyon, tren ve sefer yönetimi sağlar.

## 🏗️ Mimari

```
İstemci (React Frontend)
         ↓
Web Server (Flask Backend - REST API)
         ↓
Veritabanı (MySQL)
```

## 🛠️ Teknoloji Stack

- **Veritabanı:** MySQL 8.x
- **Backend:** Python 3.x + Flask
- **Frontend:** React 18 + Material-UI
- **API:** RESTful API

## 📊 Veritabanı Yapısı

### 7 Ana Tablo:
1. **İstasyon** - İstasyon bilgileri (id, ad, şehir)
2. **Tren** - Tren bilgileri (id, kod, koltuk_sayısı)
3. **Sefer** - Sefer bilgileri (id, tren, istasyonlar, zamanlar, durum)
4. **Yolcu** - Yolcu bilgileri (id, ad_soyad, eposta, telefon)
5. **Rezervasyon** - Rezervasyon kayıtları (id, pnr, tutar, durum)
6. **Bilet** - Bilet detayları (id, rezervasyon, sefer, yolcu, koltuk, fiyat)
7. **Ödeme** - Ödeme işlemleri (id, rezervasyon, yöntem, tutar, durum)

### Özel Özellikler:
- ✅ Foreign Key ilişkileri ve CASCADE/RESTRICT davranışları
- ✅ UNIQUE constraints (eposta, pnr, sefer+koltuk)
- ✅ CHECK constraints (fiyat > 0, kalkış < varış)
- ✅ Trigger'lar (koltuk kapasitesi kontrolü, otomatik tutar hesaplama)
- ✅ View'lar (sefer detayı, rezervasyon özeti)
- ✅ Index'ler (performans optimizasyonu)

## 🚀 Kurulum

### Ön Gereksinimler

- [MySQL 8.x](https://dev.mysql.com/downloads/mysql/)
- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js 16+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### 1. Projeyi İndirin

```powershell
git clone https://github.com/emirhangull/Train_DB_APP.git
cd Train_DB_APP
```

### 2. MySQL Veritabanını Kurun

```powershell
# MySQL'e giriş yapın
mysql -u root -p

# Veritabanını oluşturun
source database/schema.sql
source database/seed_data.sql
```

### 3. Backend Kurulumu

```powershell
cd backend

# Sanal ortam oluştur (önerilen)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Bağımlılıkları yükle
pip install -r requirements.txt

# .env dosyasını ayarla
copy .env.example .env
# .env dosyasını düzenleyin ve MySQL bilgilerinizi girin

# Backend'i başlat
python app.py
```

Backend http://localhost:5000 adresinde çalışacaktır.

### 4. Frontend Kurulumu

```powershell
cd frontend

# React uygulaması oluştur (ilk kez)
npx create-react-app tren-rezervasyon-ui
cd tren-rezervasyon-ui

# Bağımlılıkları yükle
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material date-fns

# Frontend'i başlat
npm start
```

Frontend http://localhost:3000 adresinde açılacaktır.

## 📱 Özellikler

### 👤 Kullanıcı Özellikleri

- ✅ Sefer arama (kalkış, varış, tarih)
- ✅ Uygun seferleri listeleme
- ✅ Boş koltuk görüntüleme ve seçimi
- ✅ Yolcu bilgisi girişi
- ✅ Rezervasyon oluşturma
- ✅ Ödeme işlemi (mock)
- ✅ PNR ile bilet sorgulama
- ✅ Bilet detaylarını görüntüleme

### 👨‍💼 Yönetici Özellikleri

- ✅ İstasyon yönetimi (CRUD)
- ✅ Tren yönetimi (CRUD)
- ✅ Sefer yönetimi (CRUD)
- ✅ Rezervasyon ve bilet izleme
- ✅ Sefer doluluk oranı raporu
- ✅ Gelir özeti raporu
- ✅ Bilet istatistikleri

### 📊 Raporlama

- ✅ Sefer doluluk oranı (satılan/toplam koltuk)
- ✅ Gelir özeti (tarih aralığına göre)
- ✅ En çok gelir getiren hat
- ✅ Bilet durumu istatistikleri (rezerve, kesildi, iade)

## 📁 Proje Yapısı

```
Train_DB_APP/
├── database/              # Veritabanı dosyaları
│   ├── schema.sql         # Tablo ve constraint tanımları
│   └── seed_data.sql      # Test verileri
├── backend/               # Flask REST API
│   ├── app.py             # Ana Flask uygulaması
│   ├── database.py        # DB bağlantı modülü
│   ├── requirements.txt   # Python bağımlılıkları
│   ├── .env.example       # Ortam değişkenleri örneği
│   └── README.md          # Backend dokümantasyonu
├── frontend/              # React UI
│   ├── tren-rezervasyon-ui/  # React uygulaması
│   └── README.md          # Frontend dokümantasyonu
├── AraRAPOR1.txt          # Ara rapor
└── README.md              # Bu dosya
```

## 🧪 Test Verileri

Sistem aşağıdaki test verileriyle birlikte gelir:

- **4 İstasyon:** Ankara, İstanbul, Eskişehir, İzmir
- **2 Tren:** T01 (60 koltuk), T02 (80 koltuk)
- **3 Sefer:** Yarın için 2, bugün için 1 sefer
- **3 Yolcu**
- **2 Rezervasyon:** 1 ödenmiş, 1 oluşturulmuş
- **Birkaç Bilet:** Farklı durumlar (kesildi, rezerve, iade)

## 🔌 API Endpoints

### İstasyonlar
- `GET /api/istasyonlar` - Tüm istasyonları listele
- `POST /api/istasyonlar` - Yeni istasyon ekle
- `PUT /api/istasyonlar/<id>` - İstasyon güncelle
- `DELETE /api/istasyonlar/<id>` - İstasyon sil

### Seferler
- `GET /api/seferler` - Tüm seferleri listele
- `GET /api/seferler/ara` - Sefer ara (query params)
- `GET /api/seferler/<id>/koltuklar` - Koltuk durumları
- `POST /api/seferler` - Yeni sefer oluştur

### Rezervasyonlar
- `GET /api/rezervasyonlar` - Tüm rezervasyonları listele
- `GET /api/rezervasyonlar/<pnr>` - PNR ile sorgula
- `POST /api/rezervasyonlar` - Yeni rezervasyon
- `POST /api/rezervasyonlar/<id>/iptal` - İptal et

### Raporlar
- `GET /api/raporlar/sefer-doluluk` - Doluluk oranı
- `GET /api/raporlar/gelir-ozeti` - Gelir raporu
- `GET /api/raporlar/bilet-istatistik` - İstatistikler

Tüm endpoint'ler için detaylı dokümantasyon: [backend/README.md](backend/README.md)

## 🎯 Kullanım Senaryosu

### Bilet Alma:
1. Kullanıcı ana sayfada kalkış/varış şehri ve tarihi seçer
2. Sistemde uygun seferler listelenir
3. Kullanıcı bir sefer seçer ve boş koltukları görür
4. Koltuk seçimi yapar
5. Yolcu bilgilerini girer
6. Rezervasyon oluşturulur ve PNR kodu verilir
7. Ödeme yapılır (mock)
8. Bilet kesilir

### Bilet Sorgulama:
1. Kullanıcı PNR kodunu girer
2. Bilet detayları gösterilir
3. İptal işlemi yapılabilir

### Yönetici İşlemleri:
1. Admin panelinden istasyon/tren/sefer ekler
2. Mevcut verileri düzenler
3. Raporları görüntüler

## 🔒 Güvenlik

- Parametreli SQL sorguları (SQL injection koruması)
- CORS yapılandırması
- Environment variables (.env) ile hassas bilgi yönetimi
- Input validation
- Error handling

## 📚 Proje Gereksinimleri (Tamamlanan)

- ✅ EER (Entity-Relationship) modeli
- ✅ 7 tablo ile normalize edilmiş veritabanı
- ✅ Primary Key, Foreign Key, UNIQUE constraints
- ✅ CHECK constraints ve mantıksal kurallar
- ✅ Trigger'lar (otomatik kontroller)
- ✅ View'lar (raporlama için)
- ✅ Index'ler (performans)
- ✅ CRUD operasyonları
- ✅ Kullanıcı arayüzü (sefer arama, bilet alma)
- ✅ Yönetici paneli
- ✅ Raporlama sistemi
- ✅ Dummy test verileri
- ✅ 3-tier mimari (İstemci-WebServer-DB)

## 🐛 Bilinen Kısıtlamalar

- Ara durak/aktarmalı seferler desteklenmiyor (basitleştirilmiş)
- Dinamik fiyatlandırma yok (sabit fiyat)
- Kampanya/indirim sistemi yok
- Gerçek ödeme entegrasyonu yok (mock)
- Kullanıcı authentication/authorization minimal

## 📞 İletişim

Sorularınız için:
- Emirhan Gül - emirhangull@github.com

## 📝 Lisans

Bu proje eğitim amaçlıdır ve Bilgisayar Mühendisliği Veritabanı Dersi için geliştirilmiştir.

## 🙏 Teşekkürler

Proje ekibimize ve dersimize olan katkılarından dolayı hocamıza teşekkür ederiz.

---

**Son Güncelleme:** Ekim 2025  
**Versiyon:** 1.0
