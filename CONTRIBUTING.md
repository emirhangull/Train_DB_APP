# 🤝 Katkıda Bulunma Rehberi

Tren Rezervasyon Sistemi projesine katkıda bulunmak istediğiniz için teşekkür ederiz!

## 📋 Başlamadan Önce

1. Projeyi forklayın
2. Yerel bilgisayarınıza klonlayın
3. Yeni bir branch oluşturun
4. Değişikliklerinizi yapın
5. Pull request gönderin

## 🔧 Geliştirme Ortamı Kurulumu

```bash
# 1. Projeyi fork'layın ve klonlayın
git clone https://github.com/<kullanici-adiniz>/Train_DB_APP.git
cd Train_DB_APP

# 2. Veritabanını kurun
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed_data.sql

# 3. Backend ortamını hazırlayın
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# .env dosyasını düzenleyin

# 4. Frontend ortamını hazırlayın
cd ../frontend/tren-rezervasyon-ui
npm install
```

## 📝 Kod Standartları

### Python (Backend)

- **PEP 8** standartlarına uyun
- Fonksiyonlara docstring ekleyin
- SQL injection'a karşı parametreli sorgular kullanın
- Hata yönetimi yapın (try-except)

Örnek:
```python
def get_user(user_id):
    """
    Kullanıcı bilgilerini getir

    Args:
        user_id (int): Kullanıcı ID'si

    Returns:
        dict: Kullanıcı bilgileri
    """
    try:
        query = "SELECT * FROM Kullanici WHERE kullanici_id = %s"
        result = db.execute_query(query, (user_id,), fetch=True)
        return result[0] if result else None
    except Exception as e:
        logger.error(f"Kullanıcı getirme hatası: {e}")
        raise
```

### JavaScript/React (Frontend)

- **ES6+** syntax kullanın
- Component'ler için fonksiyonel bileşenler tercih edin
- PropTypes veya TypeScript ile tip kontrolü yapın
- Anlamlı değişken isimleri kullanın

Örnek:
```javascript
const LoginForm = ({ onSubmit, isLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form içeriği */}
    </form>
  );
};
```

### SQL (Veritabanı)

- Tablo isimleri PascalCase (örn: `Rezervasyon`)
- Kolon isimleri snake_case (örn: `kullanici_id`)
- Foreign key'ler için `ON DELETE` ve `ON UPDATE` belirtin
- Index'leri uygun yerlerde kullanın

## 🌿 Branch Stratejisi

```bash
# Yeni özellik için
git checkout -b feature/ozellik-adi

# Bug fix için
git checkout -b fix/bug-aciklamasi

# Dokümantasyon için
git checkout -b docs/dokuman-konusu
```

## 📤 Pull Request Süreci

1. **Branch oluşturun**
   ```bash
   git checkout -b feature/yeni-ozellik
   ```

2. **Değişikliklerinizi commit'leyin**
   ```bash
   git add .
   git commit -m "feat: Yeni özellik eklendi"
   ```

3. **Push edin**
   ```bash
   git push origin feature/yeni-ozellik
   ```

4. **Pull Request açın**
   - Açıklayıcı bir başlık yazın
   - Değişiklikleri detaylı açıklayın
   - İlgili issue'ları bağlayın

## 📋 Commit Mesaj Formatı

```
tip: Kısa açıklama (max 50 karakter)

Detaylı açıklama (isteğe bağlı)
- Değişiklik 1
- Değişiklik 2

İlgili issue: #123
```

### Commit Tipleri

- `feat`: Yeni özellik
- `fix`: Bug düzeltmesi
- `docs`: Dokümantasyon değişikliği
- `style`: Kod formatı (mantık değişikliği yok)
- `refactor`: Kod yeniden yapılandırma
- `test`: Test ekleme/düzeltme
- `chore`: Genel bakım işleri

Örnekler:
```bash
git commit -m "feat: Bilet iptal özelliği eklendi"
git commit -m "fix: Koltuk seçiminde hata düzeltildi"
git commit -m "docs: README.md güncellendi"
```

## 🧪 Test Etme

Değişikliklerinizi göndermeden önce test edin:

### Backend Testleri
```bash
cd backend
python -m pytest tests/
```

### Frontend Testleri
```bash
cd frontend/tren-rezervasyon-ui
npm test
```

### Manuel Testler
1. Backend çalıştığından emin olun: http://localhost:5000/health
2. Frontend'i test edin: http://localhost:3000
3. Tüm CRUD operasyonlarını deneyin
4. Hata senaryolarını test edin

## 🐛 Bug Bildirme

Bug bulduğunuzda lütfen şunları ekleyin:

1. **Açıklayıcı başlık**
2. **Adım adım nasıl oluşturulur**
3. **Beklenen davranış**
4. **Gerçekleşen davranış**
5. **Ekran görüntüleri** (varsa)
6. **Sistem bilgileri** (OS, tarayıcı, Python/Node versiyonu)

Örnek:
```markdown
## Bug: Giriş sonrası yönlendirme çalışmıyor

**Adımlar:**
1. Admin hesabıyla giriş yap
2. Dashboard yüklenmeli

**Beklenen:** Dashboard sayfasına yönlendirme
**Gerçekleşen:** Giriş sayfasında kalıyor

**Sistem:**
- OS: Windows 11
- Tarayıcı: Chrome 120
- Node.js: v18.0.0
```

## 💡 Özellik Önerisi

Yeni özellik önermek için:

1. **Issue açın** (`enhancement` etiketi)
2. **Detaylı açıklama** yapın
3. **Kullanım senaryosu** ekleyin
4. **Mockup/wireframe** ekleyin (varsa)

## 📚 Dokümantasyon

Kod yazarken dokümantasyon da ekleyin:

- Python fonksiyonlarına docstring
- API endpoint'lere yorum
- README.md'ye yeni özellikler
- Karmaşık mantık için satır içi yorum

## ✅ Checklist (Pull Request Öncesi)

- [ ] Kod çalışıyor mu?
- [ ] Testler geçiyor mu?
- [ ] Dokümantasyon eklendi mi?
- [ ] Commit mesajları uygun mu?
- [ ] `.env` gibi hassas dosyalar commit'lenmedi mi?
- [ ] Gereksiz console.log / print kaldırıldı mı?

## 🙏 Teşekkürler

Katkılarınız için teşekkür ederiz! Her türlü katkı - kod, dokümantasyon, bug raporu, özellik önerisi - değerlidir.

## 📞 İletişim

- **GitHub Issues:** Sorularınız için issue açın
- **Email:** emirhangull@github.com

---

**Son Güncelleme:** 2025-11-28
