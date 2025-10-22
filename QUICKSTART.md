# 🚀 Hızlı Başlangıç Kılavuzu

Bu kılavuz projeyi hızlıca çalıştırmak için gereken adımları içerir.

## ⚡ Hızlı Kurulum (5 Dakika)

### 1️⃣ Veritabanı Kurulumu (2 dk)

```powershell
# MySQL'e giriş yapın
mysql -u root -p

# Veritabanını oluşturun (MySQL prompt'unda)
source database/schema.sql
source database/seed_data.sql
quit;
```

### 2️⃣ Backend Başlatma (2 dk)

```powershell
cd backend

# Sanal ortam oluştur ve aktif et
python -m venv venv
.\venv\Scripts\Activate.ps1

# Bağımlılıkları yükle
pip install -r requirements.txt

# .env dosyasını ayarla
copy .env.example .env
notepad .env  # MySQL şifrenizi girin

# Backend'i başlat
python app.py
```

✅ Backend: http://localhost:5000

### 3️⃣ Frontend Başlatma (1 dk - sadece izleme)

**İLK SEFER İÇİN (10-15 dk):**
```powershell
cd frontend
npx create-react-app tren-rezervasyon-ui
cd tren-rezervasyon-ui
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled
npm start
```

**SONRAKI KULLANUMLAR:**
```powershell
cd frontend/tren-rezervasyon-ui
npm start
```

✅ Frontend: http://localhost:3000

## 🧪 Test Etme

### Backend API Test:

```powershell
# Sağlık kontrolü
curl http://localhost:5000/health

# İstasyonları listele
curl http://localhost:5000/api/istasyonlar

# Seferleri listele
curl http://localhost:5000/api/seferler
```

### Tarayıcıda Test:
1. http://localhost:5000 - API ana sayfa
2. http://localhost:3000 - Frontend UI (eğer kurulduysa)

## 📋 Test Bilgileri

Sistemde şu test verileri hazır:

**İstasyonlar:**
- Ankara Garı (Ankara)
- İstanbul Söğütlüçeşme (İstanbul)
- Eskişehir Garı (Eskişehir)
- İzmir Basmane (İzmir)

**Trenler:**
- T01 - 60 koltuk
- T02 - 80 koltuk

**Hazır Seferler:**
- Ankara → İstanbul (yarın, 09:00-13:30)
- İzmir → Ankara (yarın, 08:00-15:00)

**Test için PNR:** ABC123XYZ (ödenmişrezervasyon)

## 🎯 İlk Denemeniz İçin

### Backend API ile:
```powershell
# Sefer ara
curl "http://localhost:5000/api/seferler/ara?kalkis_sehir=Ankara&varis_sehir=İstanbul&tarih=2025-10-23"

# PNR ile rezervasyon sorgula
curl http://localhost:5000/api/rezervasyonlar/ABC123XYZ

# Rapor görüntüle
curl http://localhost:5000/api/raporlar/sefer-doluluk
```

### Frontend UI ile (eğer kurulduysa):
1. Ana sayfada Ankara → İstanbul seçin
2. Yarının tarihini seçin
3. Seferleri görüntüleyin
4. Koltuk seçimi yapın
5. Rezervasyon oluşturun

## ❗ Sorun Çözümleri

### "ModuleNotFoundError: No module named 'flask'"
**Çözüm:** Virtual environment aktif mi kontrol edin
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### "Access denied for user 'root'@'localhost'"
**Çözüm:** `.env` dosyasında MySQL şifrenizi doğru girdiğinizden emin olun

### "Failed to connect to MySQL"
**Çözüm:** MySQL servisinin çalıştığından emin olun
```powershell
# Servisleri kontrol et (Windows)
services.msc  # MySQL80 servisini başlatın
```

### Port 5000 veya 3000 zaten kullanımda
**Çözüm:** Başka bir uygulama portları kullanıyor olabilir
```powershell
# Port kullanan uygulamayı bul
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Process'i sonlandır (dikkatli olun!)
taskkill /PID <PID_NUMARASI> /F
```

## 📞 Yardım

Sorun yaşarsanız:
1. README.md dosyasını okuyun
2. backend/README.md ve frontend/README.md dosyalarına bakın
3. Hata mesajlarını dikkatlice okuyun
4. Yukarıdaki sorun çözümlerine bakın

## ✨ Sonraki Adımlar

Proje çalıştıktan sonra:
1. ✅ API endpoint'lerini test edin
2. ✅ Frontend'i geliştirin (component'ler ekleyin)
3. ✅ Yönetici panelini oluşturun
4. ✅ Raporlama sayfalarını ekleyin
5. ✅ CSS/Styling ile görsel iyileştirmeler yapın

---

**İyi çalışmalar! 🚂**
