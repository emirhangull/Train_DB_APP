"""
Flask REST API Ana Dosyası
Tren Rezervasyon Sistemi
"""
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from datetime import datetime, timedelta
import random
import string
import logging, os
from logging.handlers import RotatingFileHandler
from database import db

app = Flask(__name__)

# Güvenlik: SECRET_KEY (session, cookie imzalama vb. için)
# Üretim ortamında mutlaka değiştirin!
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Session ayarları
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # Development için False, production'da True olmalı
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

# CORS ayarları - Session için credentials gerekli
CORS(app, supports_credentials=True, origins=['http://localhost:3002', 'http://localhost:3000', 'http://localhost:3001'])

# ------------------------------------------------------------
# LOGGING AYARI
# ------------------------------------------------------------
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=LOG_LEVEL,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("tren-rezervasyon")

# File logging (rotating)
LOG_DIR = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(LOG_DIR, exist_ok=True)
file_handler = RotatingFileHandler(
    os.path.join(LOG_DIR, 'backend.log'),
    maxBytes=512000,  # 500 KB
    backupCount=3,
    encoding='utf-8'
)
file_handler.setFormatter(logging.Formatter("[%(asctime)s] [%(levelname)s] %(message)s"))
logger.addHandler(file_handler)
logger.info("Dosya loglama etkin: %s", file_handler.baseFilename)

# Veritabanı bağlantısı artık her endpoint içinde açılıp kapatılır
logger.info("Veritabanı modulu yüklendi.")

# ============================================
# YARDIMCI FONKSİYONLAR
# ============================================

def generate_pnr():
    """6 haneli benzersiz PNR kodu üret"""
    max_attempts = 10
    for _ in range(max_attempts):
        pnr = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        # PNR'nin benzersiz olduğunu kontrol et
        check = db.execute_query(
            "SELECT 1 FROM Rezervasyon WHERE pnr = %s LIMIT 1",
            (pnr,),
            fetch=True
        )
        if not check:
            return pnr
    # Eğer 10 denemede benzersiz PNR bulunamazsa, daha uzun bir kod üret
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

def format_datetime(dt):
    """Datetime objesini string'e çevir"""
    if isinstance(dt, datetime):
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    return dt

# ============================================
# GENEL API ENDPOİNTLERİ
# ============================================

@app.route('/')
def index():
    """API ana sayfa"""
    return jsonify({
        'message': 'Tren Rezervasyon Sistemi API',
        'version': '1.0',
        'endpoints': {
            'istasyonlar': '/api/istasyonlar',
            'trenler': '/api/trenler',
            'seferler': '/api/seferler',
            'sefer_ara': '/api/seferler/ara',
            'rezervasyonlar': '/api/rezervasyonlar',
            'raporlar': '/api/raporlar'
        }
    })

@app.route('/health')
def health():
    """API sağlık kontrolü"""
    db_ok = True
    db_error = None
    try:
        db.execute_query("SELECT 1", fetch=True)
    except Exception as e:
        db_ok = False
        db_error = str(e)
    return jsonify({
        'status': 'healthy' if db_ok else 'degraded',
        'db': 'ok' if db_ok else 'error',
        'error': db_error,
        'timestamp': datetime.now().isoformat()
    })

# ============================================
# İSTASYON API
# ============================================

@app.route('/api/istasyonlar', methods=['GET'])
def get_istasyonlar():
    """Tüm istasyonları listele"""
    try:
        query = "SELECT * FROM Istasyon ORDER BY sehir, ad"
        istasyonlar = db.execute_query(query, fetch=True)
        return jsonify({
            'success': True,
            'data': istasyonlar,
            'count': len(istasyonlar)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/istasyonlar/<int:istasyon_id>', methods=['GET'])
def get_istasyon(istasyon_id):
    """Tek bir istasyonun detaylarını getir"""
    try:
        query = "SELECT * FROM Istasyon WHERE istasyon_id = %s"
        istasyon = db.execute_query(query, (istasyon_id,), fetch=True)
        if istasyon:
            return jsonify({'success': True, 'data': istasyon[0]})
        return jsonify({'success': False, 'error': 'İstasyon bulunamadı'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/istasyonlar', methods=['POST'])
def create_istasyon():
    """Yeni istasyon ekle"""
    try:
        data = request.get_json()
        query = "INSERT INTO Istasyon (ad, sehir) VALUES (%s, %s)"
        db.execute_query(query, (data['ad'], data['sehir']))
        istasyon_id = db.get_last_insert_id()
        return jsonify({
            'success': True,
            'message': 'İstasyon başarıyla eklendi',
            'istasyon_id': istasyon_id
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/istasyonlar/<int:istasyon_id>', methods=['PUT'])
def update_istasyon(istasyon_id):
    """İstasyon bilgilerini güncelle"""
    try:
        data = request.get_json()
        query = "UPDATE Istasyon SET ad = %s, sehir = %s WHERE istasyon_id = %s"
        rows = db.execute_query(query, (data['ad'], data['sehir'], istasyon_id))
        if rows > 0:
            return jsonify({'success': True, 'message': 'İstasyon güncellendi'})
        return jsonify({'success': False, 'error': 'İstasyon bulunamadı'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/istasyonlar/<int:istasyon_id>', methods=['DELETE'])
def delete_istasyon(istasyon_id):
    """İstasyon sil"""
    try:
        query = "DELETE FROM Istasyon WHERE istasyon_id = %s"
        rows = db.execute_query(query, (istasyon_id,))
        if rows > 0:
            return jsonify({'success': True, 'message': 'İstasyon silindi'})
        return jsonify({'success': False, 'error': 'İstasyon bulunamadı'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# TREN API
# ============================================

@app.route('/api/trenler', methods=['GET'])
def get_trenler():
    """Tüm trenleri listele"""
    try:
        query = "SELECT * FROM Tren ORDER BY kod"
        trenler = db.execute_query(query, fetch=True)
        return jsonify({
            'success': True,
            'data': trenler,
            'count': len(trenler)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/trenler', methods=['POST'])
def create_tren():
    """Yeni tren ekle"""
    try:
        if 'user_id' not in session:
            return jsonify({'success': False, 'error': 'Oturum bulunamadı'}), 401

        if session.get('rol') != 'admin':
            return jsonify({'success': False, 'error': 'Bu işlem için yetkiniz yok'}), 403

        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Geçersiz istek verisi'}), 400

        kod = (data.get('kod') or '').strip()
        koltuk_sayisi = data.get('koltuk_sayisi')

        if not kod:
            return jsonify({'success': False, 'error': 'Tren kodu zorunludur'}), 400

        try:
            koltuk_sayisi = int(koltuk_sayisi)
        except (ValueError, TypeError):
            return jsonify({'success': False, 'error': 'Koltuk sayısı sayısal olmalıdır'}), 400

        if koltuk_sayisi <= 0:
            return jsonify({'success': False, 'error': 'Koltuk sayısı pozitif olmalıdır'}), 400

        query = "INSERT INTO Tren (kod, koltuk_sayisi) VALUES (%s, %s)"
        db.execute_query(query, (kod, koltuk_sayisi))
        tren_id = db.get_last_insert_id()
        return jsonify({
            'success': True,
            'message': 'Tren başarıyla eklendi',
            'tren_id': tren_id
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/trenler/<int:tren_id>', methods=['PUT'])
def update_tren(tren_id):
    """Tren bilgilerini güncelle"""
    try:
        data = request.get_json()
        query = "UPDATE Tren SET kod = %s, koltuk_sayisi = %s WHERE tren_id = %s"
        rows = db.execute_query(query, (data['kod'], data['koltuk_sayisi'], tren_id))
        if rows > 0:
            return jsonify({'success': True, 'message': 'Tren güncellendi'})
        return jsonify({'success': False, 'error': 'Tren bulunamadı'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/trenler/<int:tren_id>', methods=['DELETE'])
def delete_tren(tren_id):
    """Tren sil"""
    try:
        query = "DELETE FROM Tren WHERE tren_id = %s"
        rows = db.execute_query(query, (tren_id,))
        if rows > 0:
            return jsonify({'success': True, 'message': 'Tren silindi'})
        return jsonify({'success': False, 'error': 'Tren bulunamadı'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# SEFER API
# ============================================

@app.route('/api/seferler', methods=['GET'])
def get_seferler():
    """Tüm seferleri listele (detaylı view ile)"""
    try:
        query = "SELECT * FROM vw_sefer_detay ORDER BY kalkis_zamani"
        seferler = db.execute_query(query, fetch=True)
        
        # Datetime objelerini string'e çevir
        for sefer in seferler:
            sefer['kalkis_zamani'] = format_datetime(sefer['kalkis_zamani'])
            sefer['varis_zamani'] = format_datetime(sefer['varis_zamani'])
        
        return jsonify({
            'success': True,
            'data': seferler,
            'count': len(seferler)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/seferler/ara', methods=['GET'])
def ara_sefer():
    """Sefer ara (kalkış, varış, tarih)"""
    try:
        kalkis_sehir = request.args.get('kalkis_sehir')
        varis_sehir = request.args.get('varis_sehir')
        tarih = request.args.get('tarih')  # YYYY-MM-DD formatında
        
        query = """
            SELECT * FROM vw_sefer_detay 
            WHERE kalkis_sehir = %s 
            AND varis_sehir = %s 
            AND DATE(kalkis_zamani) = %s
            AND durum = 'satisa_acik'
            ORDER BY kalkis_zamani
        """
        
        seferler = db.execute_query(query, (kalkis_sehir, varis_sehir, tarih), fetch=True)
        
        # Datetime objelerini string'e çevir
        for sefer in seferler:
            sefer['kalkis_zamani'] = format_datetime(sefer['kalkis_zamani'])
            sefer['varis_zamani'] = format_datetime(sefer['varis_zamani'])
        
        return jsonify({
            'success': True,
            'data': seferler,
            'count': len(seferler)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/seferler/<int:sefer_id>/koltuklar', methods=['GET'])
def get_sefer_koltuklar(sefer_id):
    """Seferdeki dolu ve boş koltukları getir"""
    try:
        # Trenin toplam koltuk sayısını al
        query1 = """
            SELECT t.koltuk_sayisi 
            FROM Sefer s 
            JOIN Tren t ON s.tren_id = t.tren_id 
            WHERE s.sefer_id = %s
        """
        result = db.execute_query(query1, (sefer_id,), fetch=True)
        
        if not result:
            return jsonify({'success': False, 'error': 'Sefer bulunamadı'}), 404
        
        toplam_koltuk = result[0]['koltuk_sayisi']
        
        # Dolu koltukları al
        query2 = """
            SELECT koltuk_no, durum 
            FROM Bilet 
            WHERE sefer_id = %s AND durum != 'iade'
        """
        dolu_koltuklar = db.execute_query(query2, (sefer_id,), fetch=True)
        dolu_koltuk_nolar = [k['koltuk_no'] for k in dolu_koltuklar]
        
        # Tüm koltukların durumunu oluştur
        koltuklar = []
        for i in range(1, toplam_koltuk + 1):
            koltuklar.append({
                'koltuk_no': i,
                'durum': 'dolu' if i in dolu_koltuk_nolar else 'bos'
            })
        
        return jsonify({
            'success': True,
            'sefer_id': sefer_id,
            'toplam_koltuk': toplam_koltuk,
            'dolu_koltuk_sayisi': len(dolu_koltuk_nolar),
            'bos_koltuk_sayisi': toplam_koltuk - len(dolu_koltuk_nolar),
            'koltuklar': koltuklar
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/seferler', methods=['POST'])
def create_sefer():
    """Yeni sefer oluştur"""
    try:
        if 'user_id' not in session:
            return jsonify({'success': False, 'error': 'Oturum bulunamadı'}), 401
        
        if session.get('rol') != 'admin':
            return jsonify({'success': False, 'error': 'Bu işlem için yetkiniz yok'}), 403

        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Geçersiz istek verisi'}), 400

        required_fields = ['tren_id', 'kalkis_istasyon_id', 'varis_istasyon_id', 'kalkis_zamani', 'varis_zamani']
        for field in required_fields:
            if field not in data or data[field] in (None, ''):
                return jsonify({'success': False, 'error': f'{field} alanı zorunludur'}), 400

        try:
            tren_id = int(data['tren_id'])
            kalkis_istasyon_id = int(data['kalkis_istasyon_id'])
            varis_istasyon_id = int(data['varis_istasyon_id'])
        except (ValueError, TypeError):
            return jsonify({'success': False, 'error': 'Tren ve istasyon bilgileri sayısal olmalıdır'}), 400

        if kalkis_istasyon_id == varis_istasyon_id:
            return jsonify({'success': False, 'error': 'Kalkış ve varış istasyonu farklı olmalıdır'}), 400

        def parse_datetime(value):
            value = value.strip()
            if value.endswith('Z'):
                value = value[:-1]
            # datetime-local formatı için T'yi boşlukla değiştir
            if 'T' in value and ' ' not in value:
                value = value.replace('T', ' ')
            try:
                return datetime.fromisoformat(value)
            except ValueError:
                return None

        kalkis_dt = parse_datetime(str(data['kalkis_zamani']))
        varis_dt = parse_datetime(str(data['varis_zamani']))

        if not kalkis_dt or not varis_dt:
            return jsonify({'success': False, 'error': 'Tarih formatı geçersiz'}), 400

        if varis_dt <= kalkis_dt:
            return jsonify({'success': False, 'error': 'Varış zamanı kalkıştan sonra olmalıdır'}), 400

        query = """
            INSERT INTO Sefer 
            (tren_id, kalkis_istasyon_id, varis_istasyon_id, kalkis_zamani, varis_zamani, durum) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        db.execute_query(query, (
            tren_id,
            kalkis_istasyon_id,
            varis_istasyon_id,
            kalkis_dt.strftime('%Y-%m-%d %H:%M:%S'),
            varis_dt.strftime('%Y-%m-%d %H:%M:%S'),
            data.get('durum', 'satisa_acik')
        ))
        sefer_id = db.get_last_insert_id()
        return jsonify({
            'success': True,
            'message': 'Sefer başarıyla oluşturuldu',
            'sefer_id': sefer_id
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/seferler/<int:sefer_id>', methods=['DELETE'])
def delete_sefer(sefer_id):
    """Sefer sil"""
    try:
        query = "DELETE FROM Sefer WHERE sefer_id = %s"
        rows = db.execute_query(query, (sefer_id,))
        if rows > 0:
            return jsonify({'success': True, 'message': 'Sefer silindi'})
        return jsonify({'success': False, 'error': 'Sefer bulunamadı'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# YOLCU API
# ============================================

@app.route('/api/yolcular', methods=['GET'])
def get_yolcular():
    """Tüm yolcuları listele"""
    try:
        query = "SELECT * FROM Yolcu ORDER BY ad_soyad"
        yolcular = db.execute_query(query, fetch=True)
        return jsonify({
            'success': True,
            'data': yolcular,
            'count': len(yolcular)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/yolcular', methods=['POST'])
def create_yolcu():
    """Yeni yolcu ekle veya mevcut yolcuyu getir"""
    try:
        data = request.get_json()
        
        # Önce e-posta ile kontrol et
        query_check = "SELECT * FROM Yolcu WHERE eposta = %s"
        existing = db.execute_query(query_check, (data['eposta'],), fetch=True)
        
        if existing:
            return jsonify({
                'success': True,
                'message': 'Yolcu zaten kayıtlı',
                'data': existing[0]
            })
        
        # Yoksa yeni yolcu ekle
        query = "INSERT INTO Yolcu (ad_soyad, eposta, telefon) VALUES (%s, %s, %s)"
        db.execute_query(query, (data['ad_soyad'], data['eposta'], data.get('telefon', '')))
        yolcu_id = db.get_last_insert_id()
        
        return jsonify({
            'success': True,
            'message': 'Yolcu başarıyla eklendi',
            'data': {
                'yolcu_id': yolcu_id,
                'ad_soyad': data['ad_soyad'],
                'eposta': data['eposta'],
                'telefon': data.get('telefon', '')
            }
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# REZERVASYON API
# ============================================

@app.route('/api/rezervasyonlar', methods=['GET'])
def get_rezervasyonlar():
    """Tüm rezervasyonları listele"""
    try:
        if 'user_id' not in session:
            return jsonify({'success': False, 'error': 'Oturum bulunamadı'}), 401

        user_id = session['user_id']
        is_admin = session.get('rol') == 'admin'

        query = "SELECT * FROM vw_rezervasyon_ozet"
        params = ()
        if not is_admin:
            query += " WHERE kullanici_id = %s"
            params = (user_id,)
        query += " ORDER BY olusturulma_zamani DESC"

        rezervasyonlar = db.execute_query(query, params, fetch=True)
        
        for r in rezervasyonlar:
            r['olusturulma_zamani'] = format_datetime(r['olusturulma_zamani'])
        
        return jsonify({
            'success': True,
            'data': rezervasyonlar,
            'count': len(rezervasyonlar)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/rezervasyonlar/<pnr>', methods=['GET'])
def get_rezervasyon_by_pnr(pnr):
    """PNR koduyla rezervasyon sorgula"""
    try:
        if 'user_id' not in session:
            return jsonify({'success': False, 'error': 'Oturum bulunamadı'}), 401

        user_id = session['user_id']
        is_admin = session.get('rol') == 'admin'

        # Rezervasyon bilgisi
        query1 = """
            SELECT r.*, o.yontem as odeme_yontem, o.durum as odeme_durum
            FROM Rezervasyon r
            LEFT JOIN Odeme o ON r.rezervasyon_id = o.rezervasyon_id
            WHERE r.pnr = %s
        """
        rezervasyon = db.execute_query(query1, (pnr,), fetch=True)
        
        if not rezervasyon:
            return jsonify({'success': False, 'error': 'Rezervasyon bulunamadı'}), 404
        
        rezervasyon = rezervasyon[0]
        if not is_admin and rezervasyon['kullanici_id'] != user_id:
            return jsonify({'success': False, 'error': 'Bu rezervasyonu görüntüleme yetkiniz yok'}), 403

        rezervasyon['olusturulma_zamani'] = format_datetime(rezervasyon['olusturulma_zamani'])
        
        # Bilet bilgileri
        query2 = """
            SELECT b.*, y.ad_soyad, y.eposta, y.telefon,
                   s.kalkis_zamani, s.varis_zamani,
                   ik.ad as kalkis_istasyon, ik.sehir as kalkis_sehir,
                   iv.ad as varis_istasyon, iv.sehir as varis_sehir,
                   t.kod as tren_kodu
            FROM Bilet b
            JOIN Yolcu y ON b.yolcu_id = y.yolcu_id
            JOIN Sefer s ON b.sefer_id = s.sefer_id
            JOIN Istasyon ik ON s.kalkis_istasyon_id = ik.istasyon_id
            JOIN Istasyon iv ON s.varis_istasyon_id = iv.istasyon_id
            JOIN Tren t ON s.tren_id = t.tren_id
            WHERE b.rezervasyon_id = %s
        """
        biletler = db.execute_query(query2, (rezervasyon['rezervasyon_id'],), fetch=True)
        
        for bilet in biletler:
            bilet['kalkis_zamani'] = format_datetime(bilet['kalkis_zamani'])
            bilet['varis_zamani'] = format_datetime(bilet['varis_zamani'])
            bilet['created_at'] = format_datetime(bilet['created_at'])
        
        return jsonify({
            'success': True,
            'data': {
                'rezervasyon': rezervasyon,
                'biletler': biletler
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/rezervasyonlar', methods=['POST'])
def create_rezervasyon():
    """
    Yeni rezervasyon oluştur
    Body: {
        "yolcular": [
            {"ad_soyad": "...", "eposta": "...", "telefon": "..."}
        ],
        "biletler": [
            {"sefer_id": 1, "yolcu_index": 0, "koltuk_no": 5, "fiyat": 250.00}
        ]
    }
    """
    try:
        if 'user_id' not in session:
            return jsonify({'success': False, 'error': 'Oturum bulunamadı'}), 401

        user_id = session['user_id']
        data = request.get_json()

        # 0. Koltuk uygunluk kontrolü (ön kontrol)
        conflicts = []
        for bilet in data.get('biletler', []):
            check = db.execute_query(
                "SELECT 1 FROM Bilet WHERE sefer_id = %s AND koltuk_no = %s AND durum != 'iade' LIMIT 1",
                (bilet['sefer_id'], bilet['koltuk_no']),
                fetch=True
            )
            if check:
                conflicts.append({
                    'sefer_id': bilet['sefer_id'],
                    'koltuk_no': bilet['koltuk_no']
                })
        if conflicts:
            return jsonify({
                'success': False,
                'error': 'Seçilen koltuklardan bazıları dolu.',
                'conflicts': conflicts
            }), 409

        # 1. Yolcuları ekle/getir
        yolcu_ids = []
        for yolcu_data in data['yolcular']:
            # E-posta ile kontrol
            query_check = "SELECT yolcu_id FROM Yolcu WHERE eposta = %s"
            existing = db.execute_query(query_check, (yolcu_data['eposta'],), fetch=True)

            if existing:
                yolcu_ids.append(existing[0]['yolcu_id'])
            else:
                query_yolcu = "INSERT INTO Yolcu (ad_soyad, eposta, telefon) VALUES (%s, %s, %s)"
                db.execute_query(query_yolcu, (
                    yolcu_data['ad_soyad'],
                    yolcu_data['eposta'],
                    yolcu_data.get('telefon', '')
                ))
                yolcu_ids.append(db.get_last_insert_id())

        # 2. Rezervasyon oluştur (PNR benzersizlik kontrolü ile)
        max_pnr_attempts = 10
        rezervasyon_id = None
        pnr = None
        for attempt in range(max_pnr_attempts):
            pnr = generate_pnr()
            try:
                query_rez = "INSERT INTO Rezervasyon (pnr, durum, kullanici_id) VALUES (%s, 'olusturuldu', %s)"
                db.execute_query(query_rez, (pnr, user_id))
                rezervasyon_id = db.get_last_insert_id()
                break  # Başarılı, döngüden çık
            except Exception as pnr_error:
                if 'Duplicate entry' in str(pnr_error) or 'UNIQUE' in str(pnr_error):
                    if attempt == max_pnr_attempts - 1:
                        raise Exception("PNR oluşturulamadı. Lütfen tekrar deneyin.")
                    continue  # Tekrar dene
                else:
                    raise  # Başka bir hata, yukarı fırlat
        
        if not rezervasyon_id:
            raise Exception("Rezervasyon oluşturulamadı.")

        # 3. Biletleri ekle
        eklenen_biletler = []  # Hata durumunda temizlik için
        try:
            for bilet_data in data['biletler']:
                yolcu_id = yolcu_ids[bilet_data['yolcu_index']]
                
                # Son kontrol: Koltuk hala boş mu? (race condition için)
                final_check = db.execute_query(
                    "SELECT 1 FROM Bilet WHERE sefer_id = %s AND koltuk_no = %s AND durum != 'iade' LIMIT 1",
                    (bilet_data['sefer_id'], bilet_data['koltuk_no']),
                    fetch=True
                )
                if final_check:
                    # Eğer koltuk doluysa, rezervasyonu iptal et ve eklenen biletleri temizle
                    if eklenen_biletler:
                        db.execute_query("UPDATE Bilet SET durum = 'iade' WHERE bilet_id IN (%s)" % 
                                        ','.join(['%s'] * len(eklenen_biletler)), tuple(eklenen_biletler))
                    db.execute_query("UPDATE Rezervasyon SET durum = 'iptal' WHERE rezervasyon_id = %s", (rezervasyon_id,))
                    return jsonify({
                        'success': False,
                        'error': f'Koltuk {bilet_data["koltuk_no"]} artık dolu. Lütfen başka bir koltuk seçin.'
                    }), 409
                
                query_bilet = """
                    INSERT INTO Bilet 
                    (rezervasyon_id, sefer_id, yolcu_id, koltuk_no, fiyat, durum) 
                    VALUES (%s, %s, %s, %s, %s, 'rezerve')
                """
                try:
                    db.execute_query(query_bilet, (
                        rezervasyon_id,
                        bilet_data['sefer_id'],
                        yolcu_id,
                        bilet_data['koltuk_no'],
                        bilet_data['fiyat']
                    ))
                    bilet_id = db.get_last_insert_id()
                    eklenen_biletler.append(bilet_id)
                except Exception as insert_error:
                    # UNIQUE KEY hatası yakalanırsa (eğer hala varsa)
                    if 'Duplicate entry' in str(insert_error) or 'UNIQUE' in str(insert_error):
                        # Eklenen biletleri temizle
                        if eklenen_biletler:
                            db.execute_query("UPDATE Bilet SET durum = 'iade' WHERE bilet_id IN (%s)" % 
                                            ','.join(['%s'] * len(eklenen_biletler)), tuple(eklenen_biletler))
                        db.execute_query("UPDATE Rezervasyon SET durum = 'iptal' WHERE rezervasyon_id = %s", (rezervasyon_id,))
                        return jsonify({
                            'success': False,
                            'error': f'Koltuk {bilet_data["koltuk_no"]} zaten rezerve edilmiş.'
                        }), 409
                    raise  # Diğer hatalar için yukarı fırlat
        except Exception as bilet_error:
            # Beklenmeyen hata durumunda eklenen biletleri temizle
            if eklenen_biletler:
                try:
                    db.execute_query("UPDATE Bilet SET durum = 'iade' WHERE bilet_id IN (%s)" % 
                                    ','.join(['%s'] * len(eklenen_biletler)), tuple(eklenen_biletler))
                    db.execute_query("UPDATE Rezervasyon SET durum = 'iptal' WHERE rezervasyon_id = %s", (rezervasyon_id,))
                except:
                    pass  # Temizlik hatası görmezden gel
            raise  # Orijinal hatayı yukarı fırlat

        # 4. Toplam tutarı güncelle (trigger otomatik yapıyor ama yine de kontrol edelim)
        query_tutar = """
            SELECT SUM(fiyat) as toplam 
            FROM Bilet 
            WHERE rezervasyon_id = %s
        """
        tutar_result = db.execute_query(query_tutar, (rezervasyon_id,), fetch=True)
        toplam_tutar = tutar_result[0]['toplam']

        return jsonify({
            'success': True,
            'message': 'Rezervasyon başarıyla oluşturuldu',
            'data': {
                'rezervasyon_id': rezervasyon_id,
                'pnr': pnr,
                'toplam_tutar': float(toplam_tutar),
                'durum': 'olusturuldu'
            }
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/rezervasyonlar/<int:rezervasyon_id>/iptal', methods=['POST'])
def iptal_rezervasyon(rezervasyon_id):
    """Rezervasyonu iptal et"""
    try:
        if 'user_id' not in session:
            return jsonify({'success': False, 'error': 'Oturum bulunamadı'}), 401

        user_id = session['user_id']
        is_admin = session.get('rol') == 'admin'

        kontrol = db.execute_query(
            "SELECT kullanici_id FROM Rezervasyon WHERE rezervasyon_id = %s",
            (rezervasyon_id,),
            fetch=True
        )
        if not kontrol:
            return jsonify({'success': False, 'error': 'Rezervasyon bulunamadı'}), 404

        if not is_admin and kontrol[0]['kullanici_id'] != user_id:
            return jsonify({'success': False, 'error': 'Bu rezervasyonu iptal etme yetkiniz yok'}), 403

        # Rezervasyon durumunu iptal yap
        query1 = "UPDATE Rezervasyon SET durum = 'iptal' WHERE rezervasyon_id = %s"
        db.execute_query(query1, (rezervasyon_id,))
        
        # İlgili biletleri iade et
        query2 = "UPDATE Bilet SET durum = 'iade' WHERE rezervasyon_id = %s"
        db.execute_query(query2, (rezervasyon_id,))
        
        return jsonify({
            'success': True,
            'message': 'Rezervasyon iptal edildi'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# ÖDEME API
# ============================================

@app.route('/api/odemeler', methods=['POST'])
def create_odeme():
    """
    Ödeme işlemi (mock)
    Body: {
        "rezervasyon_id": 1,
        "yontem": "kart",
        "tutar": 500.00
    }
    """
    try:
        if 'user_id' not in session:
            return jsonify({'success': False, 'error': 'Oturum bulunamadı'}), 401

        user_id = session['user_id']
        is_admin = session.get('rol') == 'admin'
        data = request.get_json()

        # Rezervasyon bilgisini ve mevcut ödeme durumunu kontrol et
        query_rez = "SELECT toplam_tutar, durum, kullanici_id FROM Rezervasyon WHERE rezervasyon_id = %s"
        rez_result = db.execute_query(query_rez, (data['rezervasyon_id'],), fetch=True)

        if not rez_result:
            return jsonify({'success': False, 'error': 'Rezervasyon bulunamadı'}), 404

        if not is_admin and rez_result[0]['kullanici_id'] != user_id:
            return jsonify({'success': False, 'error': 'Bu rezervasyon için işlem yapma yetkiniz yok'}), 403

        if rez_result[0]['durum'] == 'odendi':
            return jsonify({'success': False, 'error': 'Rezervasyon zaten ödenmiş'}), 400

        odeme_var_mi = db.execute_query(
            "SELECT odeme_id FROM Odeme WHERE rezervasyon_id = %s",
            (data['rezervasyon_id'],),
            fetch=True
        )
        if odeme_var_mi:
            return jsonify({'success': False, 'error': 'Bu rezervasyon için ödeme zaten mevcut'}), 400

        toplam_tutar = float(rez_result[0]['toplam_tutar'])

        # Tutar kontrolü
        if abs(float(data['tutar']) - toplam_tutar) > 0.01:
            return jsonify({
                'success': False,
                'error': f'Ödeme tutarı rezervasyon tutarı ile eşleşmiyor. Beklenen: {toplam_tutar}'
            }), 400

        # Mock ödeme (her zaman başarılı)
        query_odeme = """
            INSERT INTO Odeme 
            (rezervasyon_id, yontem, tutar, durum) 
            VALUES (%s, %s, %s, 'basarili')
        """
        db.execute_query(query_odeme, (
            data['rezervasyon_id'],
            data['yontem'],
            data['tutar']
        ))
        odeme_id = db.get_last_insert_id()

        # Rezervasyon durumunu güncelle
        query_update_rez = "UPDATE Rezervasyon SET durum = 'odendi' WHERE rezervasyon_id = %s"
        db.execute_query(query_update_rez, (data['rezervasyon_id'],))

        # Biletleri kesildi yap
        query_update_bilet = "UPDATE Bilet SET durum = 'kesildi' WHERE rezervasyon_id = %s"
        db.execute_query(query_update_bilet, (data['rezervasyon_id'],))

        return jsonify({
            'success': True,
            'message': 'Ödeme başarıyla tamamlandı',
            'data': {
                'odeme_id': odeme_id,
                'durum': 'basarili'
            }
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# RAPOR API
# ============================================

@app.route('/api/raporlar/sefer-doluluk', methods=['GET'])
def rapor_sefer_doluluk():
    """Sefer doluluk oranı raporu"""
    try:
        query = """
            SELECT 
                sefer_id,
                kalkis_istasyon,
                varis_istasyon,
                kalkis_zamani,
                varis_zamani,
                tren_kodu,
                koltuk_sayisi,
                dolu_koltuk_sayisi,
                bos_koltuk_sayisi,
                ROUND((dolu_koltuk_sayisi * 100.0 / koltuk_sayisi), 2) as doluluk_orani
            FROM vw_sefer_detay
            WHERE durum = 'satisa_acik'
            ORDER BY kalkis_zamani
        """
        # execute_query içinde connection açılıp kapatılacak
        sonuclar = db.execute_query(query, fetch=True)
        
        # Sonuçları JSON serializable formata çevir
        # Cursor sonuçlarını hemen yeni dict'lere kopyala
        data = []
        for row in sonuclar:
            item = {
                'sefer_id': row.get('sefer_id'),
                'kalkis_istasyon': row.get('kalkis_istasyon'),
                'varis_istasyon': row.get('varis_istasyon'),
                'kalkis_zamani': format_datetime(row.get('kalkis_zamani')),
                'varis_zamani': format_datetime(row.get('varis_zamani')),
                'tren_kodu': row.get('tren_kodu'),
                'koltuk_sayisi': row.get('koltuk_sayisi'),
                'dolu_koltuk_sayisi': row.get('dolu_koltuk_sayisi'),
                'bos_koltuk_sayisi': row.get('bos_koltuk_sayisi'),
                'doluluk_orani': float(row.get('doluluk_orani', 0))
            }
            data.append(item)
        
        return jsonify({
            'success': True,
            'data': data,
            'count': len(data)
        })
    except Exception as e:
        logger.error(f"Sefer doluluk raporu hatası: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/raporlar/gelir-ozeti', methods=['GET'])
def rapor_gelir_ozeti():
    """
    Gelir özeti raporu
    Query params: baslangic_tarih, bitis_tarih (YYYY-MM-DD)
    """
    try:
        baslangic = request.args.get('baslangic_tarih')
        bitis = request.args.get('bitis_tarih')
        
        # Toplam gelir
        query_toplam = """
            SELECT 
                COUNT(DISTINCT o.odeme_id) as odeme_sayisi,
                SUM(o.tutar) as toplam_gelir
            FROM Odeme o
            WHERE o.durum = 'basarili'
        """
        
        params_toplam = []
        if baslangic and bitis:
            query_toplam += " AND DATE(o.odeme_zamani) BETWEEN %s AND %s"
            params_toplam = [baslangic, bitis]
        
        toplam_result = db.execute_query(query_toplam, tuple(params_toplam), fetch=True)
        
        # Hat bazlı gelir
        query_hat = """
            SELECT 
                ik.sehir as kalkis_sehir,
                iv.sehir as varis_sehir,
                CONCAT(ik.sehir, ' - ', iv.sehir) as hat,
                COUNT(b.bilet_id) as bilet_sayisi,
                SUM(b.fiyat) as gelir
            FROM Bilet b
            JOIN Sefer s ON b.sefer_id = s.sefer_id
            JOIN Istasyon ik ON s.kalkis_istasyon_id = ik.istasyon_id
            JOIN Istasyon iv ON s.varis_istasyon_id = iv.istasyon_id
            WHERE b.durum = 'kesildi'
        """
        
        params_hat = []
        if baslangic and bitis:
            query_hat += " AND DATE(s.kalkis_zamani) BETWEEN %s AND %s"
            params_hat = [baslangic, bitis]
        
        query_hat += " GROUP BY kalkis_sehir, varis_sehir ORDER BY gelir DESC"
        
        hat_result = db.execute_query(query_hat, tuple(params_hat), fetch=True)
        
        # Decimal to float conversion
        for item in hat_result:
            item['gelir'] = float(item['gelir']) if item['gelir'] else 0
        
        toplam_gelir = float(toplam_result[0]['toplam_gelir']) if toplam_result[0]['toplam_gelir'] else 0
        
        return jsonify({
            'success': True,
            'data': {
                'ozet': {
                    'odeme_sayisi': toplam_result[0]['odeme_sayisi'],
                    'toplam_gelir': toplam_gelir
                },
                'hat_bazli_gelir': hat_result,
                'en_cok_gelir_getiren_hat': hat_result[0] if hat_result else None
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/raporlar/bilet-istatistik', methods=['GET'])
def rapor_bilet_istatistik():
    """Bilet durumu istatistikleri"""
    try:
        query = """
            SELECT 
                durum,
                COUNT(*) as adet,
                SUM(fiyat) as toplam_tutar
            FROM Bilet
            GROUP BY durum
        """
        sonuclar = db.execute_query(query, fetch=True)
        
        for s in sonuclar:
            s['toplam_tutar'] = float(s['toplam_tutar']) if s['toplam_tutar'] else 0
        
        return jsonify({
            'success': True,
            'data': sonuclar
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# AUTHENTİCATİON ENDPOİNTLERİ
# ============================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Yeni kullanıcı kaydı"""
    try:
        data = request.get_json()

        # Zorunlu alanları kontrol et
        required_fields = ['kullanici_adi', 'eposta', 'sifre', 'ad_soyad']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'success': False, 'error': f'{field} alanı zorunludur'}), 400

        kullanici_adi = data['kullanici_adi']
        eposta = data['eposta']
        sifre = data['sifre']
        ad_soyad = data['ad_soyad']
        telefon = data.get('telefon', '')

        # Kullanıcı adı ve eposta kontrolü
        existing_user = db.execute_query(
            "SELECT kullanici_id FROM Kullanici WHERE kullanici_adi = %s OR eposta = %s",
            (kullanici_adi, eposta),
            fetch=True
        )

        if existing_user:
            return jsonify({'success': False, 'error': 'Bu kullanıcı adı veya eposta zaten kullanılıyor'}), 400

        # İstenmediği için şifreyi hashlemeden sakla
        sifre_hash = sifre

        # Kullanıcıyı kaydet
        db.execute_query(
            """INSERT INTO Kullanici (kullanici_adi, eposta, sifre_hash, ad_soyad, telefon, rol)
               VALUES (%s, %s, %s, %s, %s, 'kullanici')""",
            (kullanici_adi, eposta, sifre_hash, ad_soyad, telefon)
        )
        user_id = db.get_last_insert_id()

        logger.info(f"Yeni kullanıcı kaydedildi: {kullanici_adi} (ID: {user_id})")

        return jsonify({
            'success': True,
            'message': 'Kayıt başarılı',
            'data': {
                'kullanici_id': user_id,
                'kullanici_adi': kullanici_adi
            }
        }), 201

    except Exception as e:
        logger.error(f"Register hatası: {str(e)}")
        return jsonify({'success': False, 'error': 'Kayıt sırasında bir hata oluştu'}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Kullanıcı girişi"""
    try:
        data = request.get_json()

        kullanici_adi = data.get('kullanici_adi')
        sifre = data.get('sifre')

        if not kullanici_adi or not sifre:
            return jsonify({'success': False, 'error': 'Kullanıcı adı ve şifre gereklidir'}), 400

        # Kullanıcıyı bul
        user = db.execute_query(
            """SELECT kullanici_id, kullanici_adi, eposta, sifre_hash, ad_soyad, telefon, rol, aktif
               FROM Kullanici WHERE kullanici_adi = %s""",
            (kullanici_adi,),
            fetch=True
        )

        if not user or len(user) == 0:
            return jsonify({'success': False, 'error': 'Kullanıcı adı veya şifre hatalı'}), 401

        user_data = user[0]
        # Dict olarak al
        kullanici_id = user_data['kullanici_id']
        kul_adi = user_data['kullanici_adi']
        eposta = user_data['eposta']
        sifre_hash = user_data['sifre_hash']
        ad_soyad = user_data['ad_soyad']
        telefon = user_data['telefon']
        rol = user_data['rol']
        aktif = user_data['aktif']

        # Aktif mi kontrol et (MySQL BOOLEAN/TINYINT bazen True/False, bazen 1/0 döndürür)
        if not aktif:
            return jsonify({'success': False, 'error': 'Hesabınız devre dışı bırakılmış'}), 403

        # Şifre kontrolü
        if sifre != sifre_hash:
            return jsonify({'success': False, 'error': 'Kullanıcı adı veya şifre hatalı'}), 401

        # Session oluştur
        session.permanent = True
        session['user_id'] = kullanici_id
        session['kullanici_adi'] = kul_adi
        session['rol'] = rol

        # Last login güncelle
        db.execute_query(
            "UPDATE Kullanici SET last_login = NOW() WHERE kullanici_id = %s",
            (kullanici_id,)
        )

        logger.info(f"Kullanıcı giriş yaptı: {kul_adi} (Rol: {rol})")

        return jsonify({
            'success': True,
            'message': 'Giriş başarılı',
            'data': {
                'kullanici_id': kullanici_id,
                'kullanici_adi': kul_adi,
                'eposta': eposta,
                'ad_soyad': ad_soyad,
                'telefon': telefon,
                'rol': rol
            }
        }), 200

    except Exception as e:
        logger.error(f"Login hatası: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': 'Giriş sırasında bir hata oluştu'}), 500


@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Kullanıcı çıkışı"""
    try:
        kullanici_adi = session.get('kullanici_adi', 'Bilinmeyen')
        session.clear()
        logger.info(f"Kullanıcı çıkış yaptı: {kullanici_adi}")
        return jsonify({'success': True, 'message': 'Çıkış başarılı'}), 200
    except Exception as e:
        logger.error(f"Logout hatası: {str(e)}")
        return jsonify({'success': False, 'error': 'Çıkış sırasında bir hata oluştu'}), 500


@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    """Mevcut kullanıcı bilgilerini getir (session kontrolü)"""
    try:
        if 'user_id' not in session:
            return jsonify({'success': False, 'error': 'Oturum bulunamadı'}), 401

        user = db.execute_query(
            """SELECT kullanici_id, kullanici_adi, eposta, ad_soyad, telefon, rol
               FROM Kullanici WHERE kullanici_id = %s AND aktif = TRUE""",
            (session['user_id'],),
            fetch=True
        )

        if not user or len(user) == 0:
            session.clear()
            return jsonify({'success': False, 'error': 'Kullanıcı bulunamadı'}), 404

        user_data = user[0]

        return jsonify({
            'success': True,
            'data': {
                'kullanici_id': user_data[0],
                'kullanici_adi': user_data[1],
                'eposta': user_data[2],
                'ad_soyad': user_data[3],
                'telefon': user_data[4],
                'rol': user_data[5]
            }
        }), 200

    except Exception as e:
        logger.error(f"Get current user hatası: {str(e)}")
        return jsonify({'success': False, 'error': 'Kullanıcı bilgileri alınamadı'}), 500


# ============================================
# HATA YÖNETİMİ
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Endpoint bulunamadı'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'error': 'Sunucu hatası'}), 500

# ============================================
# UYGULAMA BAŞLATMA
# ============================================

if __name__ == '__main__':
    host = os.getenv('HOST', '127.0.0.1')
    port = int(os.getenv('PORT', 5000))
    debug = False  # Stabil başlatma

    # Test DB bağlantısını kontrol et
    db_status = "OK"
    try:
        test_conn = db.get_connection()
        if test_conn:
            test_conn.close()
    except Exception:
        db_status = "ERROR"

    banner = (
        "\n" + "=" * 66 + "\n" +
        "TREN REZERVASYON SİSTEMİ API" + "\n" +
        "=" * 66 + "\n" +
        f"HOST        : {host}" + "\n" +
        f"PORT        : {port}" + "\n" +
        f"HEALTH      : http://{host}:{port}/health" + "\n" +
        f"LOG LEVEL   : {LOG_LEVEL}" + "\n" +
        f"DEBUG MODE  : {debug}" + "\n" +
        f"DB STATUS   : {db_status}" + "\n" +
        f"PYTHON PID  : {os.getpid()}" + "\n" +
        "=" * 66
    )
    print(banner, flush=True)
    logger.info("Flask sunucusu başlatılıyor (app.run)...")
    try:
        app.run(host=host, port=port, debug=debug, use_reloader=False)
    except Exception:
        logger.exception("Sunucu başlatma hatası")
        raise
