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

## ⚡ Hızlı Başlangıç (5 Dakikada Çalıştırın!)

```bash
# 1. Projeyi indirin
git clone https://github.com/emirhangull/Train_DB_APP.git
cd Train_DB_APP

# 2. Veritabanını kurun (MySQL'de)
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed_data.sql

# 3. Backend'i başlatın
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# .env dosyasını açıp DB_PASSWORD değiştirin!
python app.py

# 4. Frontend'i başlatın (yeni terminal)
cd frontend/tren-rezervasyon-ui
npm install
npm start

# 5. Giriş yapın: admin / 123456
```

---

## 🚀 Kurulum (Adım Adım Rehber)

Bu rehber, projeyi GitHub'dan indirip sıfırdan kurmanız için hazırlanmıştır.

### Ön Gereksinimler

Bilgisayarınızda şunların yüklü olması gerekiyor:

- **MySQL 8.x** - [İndir](https://dev.mysql.com/downloads/mysql/)
- **Python 3.8+** - [İndir](https://www.python.org/downloads/)
- **Node.js 16+** - [İndir](https://nodejs.org/)
- **Git** - [İndir](https://git-scm.com/)

### 📥 Adım 1: Projeyi İndirin

```bash
git clone https://github.com/emirhangull/Train_DB_APP.git
cd Train_DB_APP
```

---

### 🗄️ Adım 2: MySQL Veritabanını Kurun

#### 2.1 MySQL Sunucusunu Başlatın
MySQL sunucunuzun çalıştığından emin olun.

#### 2.2 MySQL'e Giriş Yapın
```bash
mysql -u root -p
```
Sizden şifre isteyecek - MySQL root şifrenizi girin.

#### 2.3 Veritabanı ve Tabloları Oluşturun

MySQL komut satırında aşağıdaki komutları çalıştırın:

**Windows:**
```sql
source C:/path/to/Train_DB_APP/database/schema.sql
source C:/path/to/Train_DB_APP/database/seed_data.sql
```

**MacOS/Linux:**
```sql
source /path/to/Train_DB_APP/database/schema.sql
source /path/to/Train_DB_APP/database/seed_data.sql
```

> **Not:** `path/to/Train_DB_APP` kısmını projenin gerçek yolu ile değiştirin.

#### 2.4 Doğrulama
Tabloların başarıyla oluşturulduğunu kontrol edin:
```sql
USE tren_rezervasyon_db;
SHOW TABLES;
```

8 tablo görmelisiniz:
- Kullanici
- Istasyon
- Tren
- Sefer
- Yolcu
- Rezervasyon
- Bilet
- Odeme

MySQL'den çıkış yapmak için:
```sql
exit;
```

---

### 🐍 Adım 3: Backend (Flask API) Kurulumu

#### 3.1 Backend Klasörüne Gidin
```bash
cd backend
```

#### 3.2 Python Sanal Ortamı Oluşturun (Önerilen)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**MacOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Sanal ortam aktif olduğunda komut satırında `(venv)` görmelisiniz.

#### 3.3 Python Bağımlılıklarını Yükleyin
```bash
pip install -r requirements.txt
```

#### 3.4 Çevre Değişkenlerini Ayarlayın (.env Dosyası)

**ÖNEMLİ:** `.env` dosyasını **kendi bilgisayarınıza göre** düzenlemeniz gerekiyor.

`.env.example` dosyasını `.env` olarak kopyalayın:

**Windows:**
```bash
copy .env.example .env
```

**MacOS/Linux:**
```bash
cp .env.example .env
```

Şimdi `.env` dosyasını bir metin editörü ile açın ve şu değerleri **kendi MySQL bilgilerinize göre** değiştirin:

```env
# MySQL Veritabanı Ayarları
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=BURAYA_KENDI_MYSQL_ŞİFRENİZİ_YAZIN
DB_NAME=tren_rezervasyon_db
DB_PORT=3306

# Flask Ayarları
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production

# Sunucu Ayarları
HOST=0.0.0.0
PORT=5000
```

> **Kritik:** `DB_PASSWORD` kısmını kendi MySQL root şifrenizle değiştirin!

#### 3.5 Backend Sunucusunu Başlatın
```bash
python app.py
```

Backend başarıyla çalışıyorsa şu çıktıyı görmelisiniz:
```
==================================================================
TREN REZERVASYON SİSTEMİ API
==================================================================
HOST        : 0.0.0.0
PORT        : 5000
...
```

Backend artık çalışıyor: **http://localhost:5000**

Tarayıcınızda test edin: http://localhost:5000/health

---

### ⚛️ Adım 4: Frontend (React UI) Kurulumu

**Yeni bir terminal penceresi açın** (Backend çalışmaya devam etsin)

#### 4.1 Frontend Klasörüne Gidin
```bash
cd frontend/tren-rezervasyon-ui
```

> **Not:** Eğer `tren-rezervasyon-ui` klasörü yoksa, önce oluşturmanız gerekiyor (ilk kurulumda):
> ```bash
> cd frontend
> npx create-react-app tren-rezervasyon-ui
> cd tren-rezervasyon-ui
> ```

#### 4.2 Node.js Bağımlılıklarını Yükleyin
```bash
npm install
```

Eğer hata alırsanız, gerekli paketleri manuel olarak yükleyin:
```bash
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material date-fns
```

#### 4.3 Frontend Sunucusunu Başlatın
```bash
npm start
```

React development server otomatik olarak tarayıcıda açılacaktır: **http://localhost:3000**

---

### ✅ Adım 5: Giriş Yapın ve Test Edin

Frontend açıldıktan sonra sisteme giriş yapabilirsiniz.

#### Test Kullanıcı Hesapları

Veritabanında hazır 3 test kullanıcısı var:

| Kullanıcı Adı | Şifre   | Rol         | E-posta             |
|---------------|---------|-------------|---------------------|
| `admin`       | `123456`| Admin       | admin@tren.com      |
| `ahmet123`    | `123456`| Kullanıcı   | ahmet@email.com     |
| `ayse456`     | `123456`| Kullanıcı   | ayse@email.com      |

**İlk Giriş:**
1. Frontend sayfasında "Giriş Yap" tıklayın
2. Kullanıcı Adı: `admin`
3. Şifre: `123456`
4. Giriş yapın

---

### 🔧 Sorun Giderme

#### ❌ Backend Başlamıyor - "Access denied for user"
**Sorun:** MySQL bağlantı hatası
**Çözüm:** `.env` dosyasındaki `DB_PASSWORD` değerini kontrol edin. Kendi MySQL şifrenizi yazdığınızdan emin olun.

#### ❌ "Unknown database 'tren_rezervasyon_db'"
**Sorun:** Veritabanı oluşturulmamış
**Çözüm:** Adım 2'yi tekrar yapın. `schema.sql` ve `seed_data.sql` dosyalarını MySQL'de çalıştırın.

#### ❌ Frontend başlamıyor - Port 3000 kullanımda
**Sorun:** 3000 portu zaten kullanılıyor
**Çözüm:** Farklı bir port kullanın veya çalışan uygulamayı kapatın.

#### ❌ "Kullanıcı adı veya şifre hatalı"
**Sorun:** Kullanıcı veritabanında yok
**Çözüm:** `seed_data.sql` dosyasını tekrar çalıştırın.

#### ❌ CORS Hatası
**Sorun:** Frontend backend'e bağlanamıyor
**Çözüm:** Backend'in `http://localhost:5000` adresinde çalıştığından emin olun.

---

### 🎯 Kurulum Tamamlandı!

Artık sistemi kullanmaya başlayabilirsiniz:

- **Backend API:** http://localhost:5000
- **Frontend UI:** http://localhost:3000
- **Health Check:** http://localhost:5000/health

### Sırada Ne Var?

1. **Sefer Arama:** Ana sayfada kalkış/varış şehri ve tarih seçin
2. **Bilet Alma:** Uygun seferi seçin, koltuk seçin, rezervasyon yapın
3. **Yönetici Paneli:** Admin hesabıyla giriş yaparak istasyon, tren, sefer yönetimi yapın
4. **Raporlar:** Gelir özeti ve doluluk oranı raporlarını görüntüleyin

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

## 📖 Ek Dokümantasyon

- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Sorun giderme rehberi ve yaygın hatalar
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Projeye katkıda bulunma rehberi
- **[backend/README.md](backend/README.md)** - Backend API dokümantasyonu

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
