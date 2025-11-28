# 🔧 Sorun Giderme Rehberi

Bu dokümanda, Tren Rezervasyon Sistemini kurarken ve çalıştırırken karşılaşabileceğiniz yaygın sorunlar ve çözümleri bulabilirsiniz.

---

## 📋 İçindekiler

1. [Veritabanı Sorunları](#veritabanı-sorunları)
2. [Backend (Python/Flask) Sorunları](#backend-pythonflask-sorunları)
3. [Frontend (React) Sorunları](#frontend-react-sorunları)
4. [Kimlik Doğrulama Sorunları](#kimlik-doğrulama-sorunları)
5. [CORS Hataları](#cors-hataları)
6. [Port ve Bağlantı Sorunları](#port-ve-bağlantı-sorunları)

---

## 🗄️ Veritabanı Sorunları

### ❌ Hata: "Access denied for user 'root'@'localhost'"

**Sorun:** MySQL şifresi yanlış veya kullanıcı yetkileri eksik.

**Çözüm 1:** `.env` dosyasındaki şifreyi kontrol edin
```bash
# backend/.env dosyasını açın
DB_PASSWORD=DOGRU_MYSQL_SIFRENIZ
```

**Çözüm 2:** MySQL'de şifrenizi sıfırlayın
```sql
# MySQL komut satırında (root olarak)
ALTER USER 'root'@'localhost' IDENTIFIED BY 'yeni_sifre';
FLUSH PRIVILEGES;
```

**Çözüm 3:** Yeni bir MySQL kullanıcısı oluşturun
```sql
CREATE USER 'tren_user'@'localhost' IDENTIFIED BY 'guvenli_sifre';
GRANT ALL PRIVILEGES ON tren_rezervasyon_db.* TO 'tren_user'@'localhost';
FLUSH PRIVILEGES;
```

Sonra `.env` dosyasını güncelleyin:
```env
DB_USER=tren_user
DB_PASSWORD=guvenli_sifre
```

---

### ❌ Hata: "Unknown database 'tren_rezervasyon_db'"

**Sorun:** Veritabanı oluşturulmamış.

**Çözüm:** Veritabanını oluşturun
```bash
# MySQL'e giriş yapın
mysql -u root -p

# Dosyaları çalıştırın
source /path/to/Train_DB_APP/database/schema.sql
source /path/to/Train_DB_APP/database/seed_data.sql
```

**Doğrulama:**
```sql
SHOW DATABASES;
USE tren_rezervasyon_db;
SHOW TABLES;
```

8 tablo görmelisiniz: Kullanici, Istasyon, Tren, Sefer, Yolcu, Rezervasyon, Bilet, Odeme

---

### ❌ Hata: "Can't connect to MySQL server on 'localhost'"

**Sorun:** MySQL sunucusu çalışmıyor.

**Çözüm Windows:**
```bash
# MySQL servisini başlat
net start MySQL80
```

**Çözüm MacOS:**
```bash
# MySQL'i başlat (Homebrew ile kuruluysa)
brew services start mysql

# Veya sistem tercihleri üzerinden MySQL'i başlatın
```

**Çözüm Linux:**
```bash
sudo systemctl start mysql
# veya
sudo service mysql start
```

**Durumu kontrol edin:**
```bash
# Windows
sc query MySQL80

# MacOS/Linux
mysql -u root -p -e "SELECT 1;"
```

---

### ❌ Hata: "Table 'tren_rezervasyon_db.Kullanici' doesn't exist"

**Sorun:** Tablolar oluşturulmamış veya yanlış veritabanını kullanıyorsunuz.

**Çözüm:**
```sql
USE tren_rezervasyon_db;
SHOW TABLES;
```

Eğer tablolar yoksa:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed_data.sql
```

---

## 🐍 Backend (Python/Flask) Sorunları

### ❌ Hata: "ModuleNotFoundError: No module named 'flask'"

**Sorun:** Python bağımlılıkları yüklenmemiş.

**Çözüm:**
```bash
cd backend

# Sanal ortamı aktif edin
# Windows:
venv\Scripts\activate
# MacOS/Linux:
source venv/bin/activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt
```

**Doğrulama:**
```bash
pip list | grep Flask
# Flask, Flask-CORS görmelisiniz
```

---

### ❌ Hata: "Address already in use" veya "Port 5000 is already in use"

**Sorun:** 5000 portu başka bir uygulama tarafından kullanılıyor.

**Çözüm 1:** Portu değiştirin (`.env` dosyasında)
```env
PORT=5001
```

**Çözüm 2:** Kullanılan portu bulup kapatın

**Windows:**
```bash
# 5000 portunu kullanan işlemi bul
netstat -ano | findstr :5000

# İşlemi sonlandır (PID numarasıyla)
taskkill /PID <PID_NUMARASI> /F
```

**MacOS/Linux:**
```bash
# 5000 portunu kullanan işlemi bul
lsof -i :5000

# İşlemi sonlandır
kill -9 <PID>
```

---

### ❌ Hata: "No module named 'dotenv'"

**Sorun:** `python-dotenv` paketi yüklenmemiş.

**Çözüm:**
```bash
pip install python-dotenv
```

---

### ❌ Backend başlatıldıktan sonra hemen kapanıyor

**Sorun:** Genellikle veritabanı bağlantı hatası.

**Çözüm:** Terminalde hata mesajını okuyun:
```bash
cd backend
python app.py
# Hata mesajını not edin ve ilgili bölüme bakın
```

**Yaygın nedenler:**
- `.env` dosyası yok → `.env.example`'dan kopyalayın
- MySQL şifresi yanlış → `.env` dosyasını düzeltin
- MySQL sunucusu kapalı → MySQL'i başlatın

---

## ⚛️ Frontend (React) Sorunları

### ❌ Hata: "npm: command not found"

**Sorun:** Node.js yüklü değil.

**Çözüm:** Node.js'i yükleyin
- [Node.js İndir](https://nodejs.org/)
- LTS (Long Term Support) versiyonunu seçin
- Kurulum sonrası terminali yeniden başlatın

**Doğrulama:**
```bash
node --version
npm --version
```

---

### ❌ Hata: "Cannot find module 'axios'" veya "Module not found: Can't resolve 'react-router-dom'"

**Sorun:** Node.js bağımlılıkları yüklenmemiş.

**Çözüm:**
```bash
cd frontend/tren-rezervasyon-ui

# Tüm bağımlılıkları yükle
npm install

# Eksik paketleri manuel yükle
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material date-fns
```

---

### ❌ Hata: "Port 3000 is already in use"

**Sorun:** 3000 portu kullanımda.

**Çözüm 1:** Otomatik olarak farklı port kullan
```bash
# npm start çalıştırınca "Use port 3001?" sorusuna 'Y' deyin
```

**Çözüm 2:** Manuel olarak port belirle
```bash
# Windows
set PORT=3001 && npm start

# MacOS/Linux
PORT=3001 npm start
```

---

### ❌ Hata: "Failed to compile" veya Syntax Error

**Sorun:** Kod hatası veya uyumsuz paket versiyonu.

**Çözüm:**
```bash
# Node modules'ü temizle
rm -rf node_modules package-lock.json

# Yeniden yükle
npm install

# Cache'i temizle
npm cache clean --force
```

---

## 🔐 Kimlik Doğrulama Sorunları

### ❌ "Kullanıcı adı veya şifre hatalı" Hatası

**Sorun:** Kullanıcı veritabanında yok veya şifre yanlış.

**Çözüm 1:** Test kullanıcılarını kullanın
```
Kullanıcı Adı: admin
Şifre: 123456
```

**Çözüm 2:** Kullanıcıların veritabanında olduğunu kontrol edin
```sql
USE tren_rezervasyon_db;
SELECT kullanici_adi, eposta, rol, aktif FROM Kullanici;
```

3 kullanıcı görmelisiniz: admin, ahmet123, ayse456

**Çözüm 3:** `seed_data.sql`'i yeniden çalıştırın
```bash
mysql -u root -p tren_rezervasyon_db < database/seed_data.sql
```

---

### ❌ "Oturum bulunamadı" veya Session Hatası

**Sorun:** Session ayarları veya CORS sorunu.

**Çözüm 1:** Tarayıcı çerezlerini temizleyin
- Chrome: Settings → Privacy → Clear browsing data → Cookies

**Çözüm 2:** Backend'in CORS ayarlarını kontrol edin
`backend/app.py` dosyasında:
```python
CORS(app, supports_credentials=True, origins=['http://localhost:3000'])
```

**Çözüm 3:** Tarayıcıda incognito/gizli mod deneyin

---

### ❌ Giriş yapıldıktan sonra aniden çıkış yapılıyor

**Sorun:** Session süresi dolmuş veya backend yeniden başlatılmış.

**Çözüm:**
- Backend'in çalışır durumda olduğunu kontrol edin
- Tekrar giriş yapın
- `SECRET_KEY` değiştiyse tüm oturumlar geçersiz olur

---

## 🌐 CORS Hataları

### ❌ "CORS policy: No 'Access-Control-Allow-Origin' header"

**Sorun:** Frontend, backend'e erişemiyor.

**Çözüm 1:** Backend'in çalıştığını doğrulayın
```bash
# Tarayıcıda test edin
http://localhost:5000/health
```

**Çözüm 2:** CORS ayarlarını kontrol edin
`backend/app.py` dosyasında:
```python
CORS(app, supports_credentials=True, origins=[
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
])
```

**Çözüm 3:** Frontend'in doğru API URL'sini kullandığını kontrol edin
Frontend kod tabanında `axios` çağrılarını kontrol edin:
```javascript
// Doğru:
axios.get('http://localhost:5000/api/...')

// Yanlış:
axios.get('http://localhost:3000/api/...')
```

---

## 🔌 Port ve Bağlantı Sorunları

### ❌ "ERR_CONNECTION_REFUSED" veya "net::ERR_CONNECTION_REFUSED"

**Sorun:** Backend çalışmıyor veya yanlış port kullanılıyor.

**Çözüm:**
1. Backend'in çalıştığını doğrulayın:
   ```bash
   cd backend
   python app.py
   ```

2. Backend'in çalıştığı portu kontrol edin:
   ```bash
   # Backend çıktısında:
   # HOST: 0.0.0.0
   # PORT: 5000
   ```

3. Tarayıcıda test edin: http://localhost:5000/health

4. Frontend'in doğru URL'yi kullandığını kontrol edin

---

### ❌ "Network Error" veya "Failed to fetch"

**Sorun:** Backend'e erişilemiyor veya firewall engelliyor.

**Çözüm:**

1. **Backend durumunu kontrol edin:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Firewall kontrolü (Windows):**
   - Windows Defender Firewall → Python'a izin verin

3. **Farklı tarayıcı deneyin:**
   - Chrome, Firefox, Edge

4. **VPN/Proxy kapalı olsun**

---

## 💡 Genel İpuçları

### 1. **Temiz Başlangıç (Fresh Start)**

Eğer hiçbir şey çalışmıyorsa:

```bash
# 1. Veritabanını sil ve yeniden oluştur
mysql -u root -p
DROP DATABASE IF EXISTS tren_rezervasyon_db;
exit;

mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed_data.sql

# 2. Backend'i temizle ve yeniden kur
cd backend
rm -rf venv __pycache__ logs
python -m venv venv
source venv/bin/activate  # veya Windows'ta: venv\Scripts\activate
pip install -r requirements.txt

# 3. Frontend'i temizle ve yeniden kur
cd frontend/tren-rezervasyon-ui
rm -rf node_modules package-lock.json
npm install
```

---

### 2. **Log Dosyalarını Kontrol Edin**

**Backend logs:**
```bash
cat backend/logs/backend.log
```

**Browser console:**
- F12 (Developer Tools) → Console tab

---

### 3. **Versiyonları Kontrol Edin**

```bash
# Python versiyon (3.8+)
python --version

# Node.js versiyon (16+)
node --version

# MySQL versiyon (8.x)
mysql --version
```

---

### 4. **Veritabanı Bağlantısını Test Edin**

```bash
cd backend
python -c "
from database import db
try:
    conn = db.get_connection()
    print('✅ Veritabanı bağlantısı başarılı!')
    conn.close()
except Exception as e:
    print(f'❌ Bağlantı hatası: {e}')
"
```

---

## 📞 Hala Sorun mu Yaşıyorsunuz?

1. **Hatayı tam olarak kopyalayın** (error message)
2. **Hangi adımda olduğunuzu belirtin** (kurulum, giriş, vb.)
3. **Sistem bilgilerinizi paylaşın** (Windows/Mac/Linux, Python/Node versiyonları)
4. **Log dosyalarını kontrol edin** (`backend/logs/backend.log`)

---

**Son Güncelleme:** 2025-11-28
**Proje:** Tren Rezervasyon Sistemi v1.0
