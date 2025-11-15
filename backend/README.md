# Tren Bileti Satış ve Rezervasyon Sistemi - Backend

Flask tabanlı REST API backend.

## 🚀 Kurulum

### 1. Sanal Ortam Oluştur (Önerilen)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Bağımlılıkları Yükle

```powershell
pip install -r requirements.txt
```

### 3. Ortam Değişkenlerini Ayarla

`.env.example` dosyasını `.env` olarak kopyalayın ve MySQL bilgilerinizi girin:

```powershell
copy .env.example .env
```

`.env` dosyasını düzenleyin:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sizin_mysql_sifreniz
DB_NAME=tren_rezervasyon_db
DB_PORT=3306

# Güvenlik: Üretim ortamında mutlaka değiştirin!
SECRET_KEY=your-secret-key-here-change-in-production
```

### 4. MySQL Veritabanını Oluştur

MySQL'e bağlanın ve schema'yı çalıştırın:

```sql
source ../database/schema.sql
source ../database/seed_data.sql
```

Veya MySQL Workbench kullanarak dosyaları içe aktarın.

### 5. Uygulamayı Başlat

```powershell
python app.py
```

API http://localhost:5000 adresinde çalışacaktır.

## 📚 API Endpoints

### İstasyonlar
- `GET /api/istasyonlar` - Tüm istasyonları listele
- `GET /api/istasyonlar/<id>` - Tek istasyon detayı
- `POST /api/istasyonlar` - Yeni istasyon ekle
- `PUT /api/istasyonlar/<id>` - İstasyon güncelle
- `DELETE /api/istasyonlar/<id>` - İstasyon sil

### Trenler
- `GET /api/trenler` - Tüm trenleri listele
- `POST /api/trenler` - Yeni tren ekle
- `PUT /api/trenler/<id>` - Tren güncelle
- `DELETE /api/trenler/<id>` - Tren sil

### Seferler
- `GET /api/seferler` - Tüm seferleri listele
- `GET /api/seferler/ara?kalkis_sehir=Ankara&varis_sehir=Istanbul&tarih=2025-10-23` - Sefer ara
- `GET /api/seferler/<id>/koltuklar` - Koltuk durumlarını getir
- `POST /api/seferler` - Yeni sefer oluştur
- `DELETE /api/seferler/<id>` - Sefer sil

### Yolcular
- `GET /api/yolcular` - Tüm yolcuları listele
- `POST /api/yolcular` - Yeni yolcu ekle

### Rezervasyonlar
- `GET /api/rezervasyonlar` - Tüm rezervasyonları listele
- `GET /api/rezervasyonlar/<pnr>` - PNR ile rezervasyon sorgula
- `POST /api/rezervasyonlar` - Yeni rezervasyon oluştur
- `POST /api/rezervasyonlar/<id>/iptal` - Rezervasyon iptal et

### Ödemeler
- `POST /api/odemeler` - Ödeme yap (mock)

### Raporlar
- `GET /api/raporlar/sefer-doluluk` - Sefer doluluk oranı
- `GET /api/raporlar/gelir-ozeti?baslangic_tarih=2025-10-01&bitis_tarih=2025-10-31` - Gelir özeti
- `GET /api/raporlar/bilet-istatistik` - Bilet durumu istatistikleri

## 🧪 Test Etme

### cURL ile Test

```powershell
# Sağlık kontrolü
curl http://localhost:5000/health

# İstasyonları listele
curl http://localhost:5000/api/istasyonlar

# Sefer ara
curl "http://localhost:5000/api/seferler/ara?kalkis_sehir=Ankara&varis_sehir=İstanbul&tarih=2025-10-23"
```

### Postman ile Test

Postman collection dosyasını import edebilirsiniz (yakında eklenecek).

## 🗄️ Veritabanı Yapısı

7 ana tablo:
- **Istasyon** - İstasyon bilgileri
- **Tren** - Tren bilgileri
- **Sefer** - Sefer bilgileri
- **Yolcu** - Yolcu bilgileri
- **Rezervasyon** - Rezervasyon kayıtları
- **Bilet** - Bilet detayları
- **Odeme** - Ödeme işlemleri

2 view:
- **vw_sefer_detay** - Detaylı sefer bilgileri
- **vw_rezervasyon_ozet** - Rezervasyon özeti

## 🔒 Güvenlik Notları

- Üretim ortamında `.env` dosyasını paylaşmayın
- `SECRET_KEY` değerini değiştirin
- CORS ayarlarını production'da kısıtlayın
- SQL injection koruması için parametreli sorgular kullanılıyor

## 📝 Lisans

Bu proje eğitim amaçlıdır.
