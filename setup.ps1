# Tren Rezervasyon Sistemi - Otomatik Kurulum Scripti
# PowerShell ile çalıştırın: .\setup.ps1

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 78) -ForegroundColor Cyan
Write-Host "  TREN REZERVASYON SİSTEMİ - OTOMATIK KURULUM" -ForegroundColor Yellow
Write-Host ("=" * 79) -ForegroundColor Cyan
Write-Host ""

# Gerekli yazılımların kontrolü
Write-Host "1. Gerekli yazılımlar kontrol ediliyor..." -ForegroundColor Green
Write-Host ""

# Python kontrolü
Write-Host "  Checking Python..." -NoNewline
try {
    $pythonVersion = python --version 2>&1
    Write-Host " ✓ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host " ✗ Python bulunamadı!" -ForegroundColor Red
    Write-Host "    Python 3.8+ yükleyin: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# Node.js kontrolü
Write-Host "  Checking Node.js..." -NoNewline
try {
    $nodeVersion = node --version 2>&1
    Write-Host " ✓ $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host " ✗ Node.js bulunamadı!" -ForegroundColor Red
    Write-Host "    Node.js 16+ yükleyin: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# MySQL kontrolü
Write-Host "  Checking MySQL..." -NoNewline
try {
    $mysqlVersion = mysql --version 2>&1
    Write-Host " ✓ Installed" -ForegroundColor Green
} catch {
    Write-Host " ✗ MySQL bulunamadı!" -ForegroundColor Red
    Write-Host "    MySQL 8+ yükleyin: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
    Write-Host "    Veya manuel kurulum yapın" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ("=" * 79) -ForegroundColor Cyan

# Backend kurulumu
Write-Host ""
Write-Host "2. Backend kurulumu başlıyor..." -ForegroundColor Green
Write-Host ""

Set-Location backend

# Virtual environment oluştur
Write-Host "  Virtual environment oluşturuluyor..." -NoNewline
python -m venv venv
Write-Host " ✓" -ForegroundColor Green

# Virtual environment'ı aktif et
Write-Host "  Virtual environment aktif ediliyor..." -NoNewline
& .\venv\Scripts\Activate.ps1
Write-Host " ✓" -ForegroundColor Green

# Bağımlılıkları yükle
Write-Host "  Python bağımlılıkları yükleniyor..." -NoNewline
pip install -q -r requirements.txt
Write-Host " ✓" -ForegroundColor Green

# .env dosyası oluştur
if (-not (Test-Path .env)) {
    Write-Host "  .env dosyası oluşturuluyor..." -NoNewline
    Copy-Item .env.example .env
    Write-Host " ✓" -ForegroundColor Green
    Write-Host ""
    Write-Host "  ⚠️  ÖNEMLI: .env dosyasını düzenleyin ve MySQL bilgilerinizi girin!" -ForegroundColor Yellow
} else {
    Write-Host "  .env dosyası zaten mevcut" -ForegroundColor Cyan
}

Set-Location ..

Write-Host ""
Write-Host ("=" * 79) -ForegroundColor Cyan

# Veritabanı kurulumu
Write-Host ""
Write-Host "3. Veritabanı kurulumu" -ForegroundColor Green
Write-Host ""
Write-Host "  MySQL'e bağlanmak için bilgiler gerekli:" -ForegroundColor Yellow
Write-Host "  Komut: mysql -u root -p < database/schema.sql" -ForegroundColor White
Write-Host "  Komut: mysql -u root -p < database/seed_data.sql" -ForegroundColor White
Write-Host ""
$setupDB = Read-Host "  Şimdi veritabanını kurmak ister misiniz? (y/n)"

if ($setupDB -eq "y" -or $setupDB -eq "Y") {
    $mysqlUser = Read-Host "  MySQL kullanıcı adı (varsayılan: root)"
    if ([string]::IsNullOrWhiteSpace($mysqlUser)) { $mysqlUser = "root" }
    
    Write-Host "  Schema oluşturuluyor..." -NoNewline
    Get-Content database/schema.sql | mysql -u $mysqlUser -p
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ Hata oluştu" -ForegroundColor Red
    }
    
    Write-Host "  Test verileri ekleniyor..." -NoNewline
    Get-Content database/seed_data.sql | mysql -u $mysqlUser -p
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ Hata oluştu" -ForegroundColor Red
    }
} else {
    Write-Host "  Veritabanı kurulumu atlandı. Manuel olarak kurun:" -ForegroundColor Yellow
    Write-Host "    cd database" -ForegroundColor White
    Write-Host "    mysql -u root -p < schema.sql" -ForegroundColor White
    Write-Host "    mysql -u root -p < seed_data.sql" -ForegroundColor White
}

Write-Host ""
Write-Host ("=" * 79) -ForegroundColor Cyan

# Frontend kurulumu
Write-Host ""
Write-Host "4. Frontend kurulumu" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend için React uygulaması oluşturulmalı:" -ForegroundColor Yellow
Write-Host "  Komutlar:" -ForegroundColor White
Write-Host "    cd frontend" -ForegroundColor White
Write-Host "    npx create-react-app tren-rezervasyon-ui" -ForegroundColor White
Write-Host "    cd tren-rezervasyon-ui" -ForegroundColor White
Write-Host "    npm install axios react-router-dom @mui/material @emotion/react @emotion/styled" -ForegroundColor White
Write-Host ""
$setupFrontend = Read-Host "  Şimdi frontend'i kurmak ister misiniz? (UZUN SÜRER - y/n)"

if ($setupFrontend -eq "y" -or $setupFrontend -eq "Y") {
    Set-Location frontend
    
    Write-Host "  React uygulaması oluşturuluyor (bu biraz zaman alabilir)..." -ForegroundColor Yellow
    npx create-react-app tren-rezervasyon-ui
    
    Set-Location tren-rezervasyon-ui
    
    Write-Host "  Bağımlılıklar yükleniyor..." -ForegroundColor Yellow
    npm install axios react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material date-fns
    
    Set-Location ../..
    Write-Host " ✓ Frontend kurulumu tamamlandı" -ForegroundColor Green
} else {
    Write-Host "  Frontend kurulumu atlandı. Manuel olarak kurun (yukarıdaki komutları kullanın)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ("=" * 79) -ForegroundColor Cyan

# Özet
Write-Host ""
Write-Host "✅ KURULUM TAMAMLANDI!" -ForegroundColor Green
Write-Host ""
Write-Host ("=" * 79) -ForegroundColor Cyan
Write-Host ""
Write-Host "SONRAKI ADIMLAR:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Backend'i başlatın:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
Write-Host "   python app.py" -ForegroundColor Cyan
Write-Host "   → http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "2. Frontend'i başlatın (başka bir terminal'de):" -ForegroundColor White
Write-Host "   cd frontend/tren-rezervasyon-ui" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host "   → http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "3. Uygulamayı test edin!" -ForegroundColor White
Write-Host ""
Write-Host ("=" * 79) -ForegroundColor Cyan
Write-Host ""
Write-Host "Detaylı bilgi için README.md dosyasını okuyun!" -ForegroundColor Yellow
Write-Host ""
Write-Host "İyi çalışmalar! 🚂" -ForegroundColor Green
Write-Host ""
